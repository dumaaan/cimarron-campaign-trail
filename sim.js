// ============================================================
// Balance simulator. Plays many automatic games and reports the results.
// Open sim.html with the server running, or call these functions from the console there.
// ============================================================
save = () => {};
render = () => {};

const fxOf = x => x.fx || {};
// Strategies: how the automatic player chooses answers.
const STRATEGIES = {
  random: a => Math.floor(Math.random() * a.length),
  // Never chooses an answer that adds to the RINO label.
  noModerate: a => { const ok = a.map((x, i) => i).filter(i => !fxOf(a[i]).rino); return ok[Math.floor(Math.random() * ok.length)] ?? 0; },
  // Chooses the answer with the best expected effect on primary voters.
  best: a => {
    let best = 0, bv = -1e9;
    a.forEach((x, i) => {
      const fx = fxOf(x); let v = 0;
      for (const f of FKEYS) v += (fx[f] || 0) * expectedVote()[f] / 12;
      v -= (fx.rino || 0) * 1.2;
      for (const o in fx.opp || {}) v -= fx.opp[o] * .5;
      if (v > bv) { bv = v; best = i; }
    });
    return best;
  },
};

// Play one full game. scenario, war (true/false) and difficulty are optional overrides.
function simGame(strategy, seed, scenario, war, difficulty = 'normal') {
  newState('Sim', seed, difficulty);
  if (scenario) {
    // Start again from a clean state, then apply the chosen scenario exactly as the game does.
    const keep = { seed: S.seed, rng: S.rng, warPlanned: S.warPlanned };
    newState('Sim', seed, difficulty); Object.assign(S, keep);
    for (const id in S.delta) S.delta[id] = {};
    S.flags = {};
    S.endorsements = Object.fromEntries(Object.entries(ENDORSERS).map(([k, v]) => [k, v.holder]));
    applyScenario(S, SCENARIOS.find(x => x.id === scenario));
  }
  if (war === true) S.warPlanned = 10;
  if (war === false) S.warPlanned = null;
  S.record = pick(RECORDS).id; applyFx(S, RECORDS.find(r => r.id === S.record).fx);
  S.mate = pick(RUNNING_MATES).id; applyFx(S, RUNNING_MATES.find(m => m.id === S.mate).fx);
  S.screen = 'campaign'; startStep();
  for (let g = 0; g < 600 && S.screen !== 'ending'; g++) {
    const c = S.cur;
    if (S.screen === 'election') {
      const e = currentResult(S);
      if (S.electionPhase === 'primary') S.top2 = sorted(e.total).slice(0, 2).map(x => x[0]);
      if (S.electionPhase === 'primary' && e.needsRunoff?.includes('you')) { startRunoff(); continue; }
      S.screen = 'ending'; break;
    }
    const choose = list => strategy(list);
    // Events: choose only from the choices the player can see.
    const chooseShown = list => { const vis = c.shown || list.map((_, i) => i); return vis[strategy(vis.map(i => list[i]))]; };
    if (c.type === 'q') { if (c.answered == null) { c.sel = choose(QUESTIONS.find(q => q.id === c.qid).answers); answer(); } else advance(); }
    else if (c.type === 'event') { if (c.answered == null) { c.sel = chooseShown(EVENTS.find(e => e.id === c.eid).choices); answer(); } else advance(); }
    else if (c.type === 'revent') { if (c.answered == null) { c.sel = chooseShown(RUNOFF_EVENTS.find(e => e.id === c.eid).choices); answer(); } else runoffAdvance(); }
    else if (c.type === 'court') {
      if (c.answered == null) {
        const ch = COURT[c.who].choices;
        c.sel = strategy === STRATEGIES.random ? Math.floor(Math.random() * ch.length) : ch.reduce((b, x, i) => (x.p > ch[b].p && !x.fx.rino) ? i : b, 0);
        courtAnswer();
      } else runoffAdvance();
    }
    else if (c.type === 'rintro') runoffAdvance();
    else if (c.type === 'debate') { if (c.idx >= 0 && c.idx < 99 && c.answered == null) { c.sel = choose(c.opts); answer(); } else debateNext(); }
    else if (c.type === 'stop') { if (!c.done) { c.region = pick(REGIONS).id; c.action = pick(['rally', 'gotv', 'ads']); doStop(); } else advance(); }
    else advance();
  }
  return S;
}

// Win rate for each strategy over n games, with the natural mix of scenarios.
function simBalance(n = 50) {
  const out = {};
  for (const [name, st] of Object.entries(STRATEGIES)) {
    let w = 0;
    for (let i = 0; i < n; i++) if (simGame(st, 9000 + i).finalWinner === 'you') w++;
    out[name] = `${Math.round(w / n * 100)}%`;
  }
  return out;
}

// Per scenario: your win rate, and how often the scenario's outsider reaches the top two and wins.
function simScenarios(n = 40, strategy = STRATEGIES.noModerate) {
  const out = {};
  for (const sc of SCENARIOS) {
    const outsider = [...sc.field, ...Object.keys(sc.enter || {})].find(id => CAND[id].outsider);
    let you = 0, top2 = 0, wins = 0;
    const winners = {};
    for (let i = 0; i < n; i++) {
      const s = simGame(strategy, 7000 + i, sc.id, false);
      winners[s.finalWinner] = (winners[s.finalWinner] || 0) + 1;
      if (s.finalWinner === 'you') you++;
      if (outsider && s.top2?.includes(outsider)) top2++;
      if (outsider && s.finalWinner === outsider) wins++;
    }
    out[sc.id] = { youWin: `${Math.round(you / n * 100)}%`, ...(outsider ? { outsider, outsiderTop2: `${Math.round(top2 / n * 100)}%`, outsiderWins: `${Math.round(wins / n * 100)}%` } : {}), winners };
  }
  return out;
}

// Runoffs: how often you win once you reach one, by the number of endorsements you won.
function simRunoffs(n = 80, strategy = STRATEGIES.noModerate) {
  let played = 0, won = 0;
  const byEndorsements = {};
  for (let i = 0; i < n; i++) {
    const s = simGame(strategy, 3000 + i, null, false);
    if (!s.runoff?.live) continue;
    played++;
    const k = Object.values(s.runoff.endorse).filter(t => t === 'you').length;
    byEndorsements[k] = byEndorsements[k] || [0, 0];
    byEndorsements[k][1]++;
    if (s.finalWinner === 'you') { won++; byEndorsements[k][0]++; }
  }
  return { runoffsPlayed: played, youWinRunoff: `${Math.round(won / played * 100)}%`,
    byEndorsementsWon: Object.fromEntries(Object.entries(byEndorsements).map(([k, [w, t]]) => [k, `${w}/${t}`])) };
}

// The war: how the President's endorsed candidate does with and without it (same seeds).
function simWar(n = 60, strategy = STRATEGIES.noModerate) {
  const run = war => {
    let share = 0, wins = 0, you = 0;
    for (let i = 0; i < n; i++) {
      const s = simGame(strategy, 5000 + i, 'standard', war);
      if (s.endorsed && s.election.total[s.endorsed] != null) share += s.election.total[s.endorsed];
      if (s.finalWinner === s.endorsed) wins++;
      if (s.finalWinner === 'you') you++;
    }
    return { endorsedPrimaryShare: `${(share / n).toFixed(1)}%`, endorsedWins: `${Math.round(wins / n * 100)}%`, youWin: `${Math.round(you / n * 100)}%` };
  };
  return { withoutWar: run(false), withWar: run(true) };
}

// Who wins the nomination, over n games with the natural mix of scenarios.
function simWinners(n = 300, strategy = STRATEGIES.noModerate) {
  const all = {}, byScenario = {};
  for (let i = 0; i < n; i++) {
    const s = simGame(strategy, 20000 + i);
    all[s.finalWinner] = (all[s.finalWinner] || 0) + 1;
    const b = byScenario[s.scenario] = byScenario[s.scenario] || { games: 0 };
    b.games++; b[s.finalWinner] = (b[s.finalWinner] || 0) + 1;
  }
  const pct = (o, t) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'games').sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, `${(v / t * 100).toFixed(1)}%`]));
  return { games: n, overall: pct(all, n), byScenario: Object.fromEntries(Object.entries(byScenario).map(([k, v]) => [k, { games: v.games, ...pct(v, v.games) }])) };
}

// Win rates inside every scenario (n games each), so rare scenarios are measured too.
function simEveryScenario(n = 60, strategy = STRATEGIES.noModerate) {
  const out = {};
  for (const sc of SCENARIOS) {
    const w = {};
    for (let i = 0; i < n; i++) { const s = simGame(strategy, 30000 + i, sc.id); w[s.finalWinner] = (w[s.finalWinner] || 0) + 1; }
    out[sc.id] = Object.fromEntries(Object.entries(w).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, `${Math.round(v / n * 100)}%`]));
  }
  return out;
}

// Your win rate at each difficulty level (same seeds).
function simDifficulty(n = 300, strategy = STRATEGIES.noModerate) {
  const out = {};
  for (const d of Object.keys(DIFFICULTY)) {
    let w = 0;
    for (let i = 0; i < n; i++) if (simGame(strategy, 40000 + i, null, null, d).finalWinner === 'you') w++;
    out[d] = `${Math.round(w / n * 100)}%`;
  }
  return out;
}
