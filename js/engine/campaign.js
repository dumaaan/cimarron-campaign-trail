// ============================================================
// CAMPAIGN — the schedule of steps, event and question picks, the President, rival news, the war.
// ============================================================

// ---------- campaign flow ----------
// weight: a number or s => number (default 1). A kind at its limit in KIND_LIMITS is not drawn again, but follow-ups (priority) always run.
const weightOf = (s, e) => typeof e.weight === 'function' ? e.weight(s) : e.weight ?? 1;
function pickWeighted(s, list) {
  let r = rand() * list.reduce((a, e) => a + weightOf(s, e), 0);
  return list.find(e => (r -= weightOf(s, e)) < 0) || list[list.length - 1];
}
function pickEvent(s) {
  const ok = e => !s.seenEvents.includes(e.id) && (!e.cond || e.cond(s)) && (e.minStep || 0) <= s.step && (e.maxStep ?? 99) >= s.step;
  const pool = EVENTS.filter(ok);
  const seenOfKind = k => s.seenEvents.filter(id => { const e = EVENTS.find(x => x.id === id); return e && !e.priority && e.kind === k; }).length;
  const open = pool.filter(e => !e.priority && weightOf(s, e) > 0 && seenOfKind(e.kind) < (KIND_LIMITS[e.kind] ?? 99));
  // due: a personal event that has not come up by this step comes next.
  return pool.find(e => e.priority) || pool.find(e => e.due && s.step >= e.due) || (open.length ? pickWeighted(s, open) : null);
}
// A choice that spends money (fx.money < 0) is locked when the war chest cannot pay for it.
// A candidate who self-funds (Vaskel) can always pay: what the war chest cannot cover comes from his own fortune,
// and every $1M of it raises his weak-spot label (see selfFund in candidates.js).
const costOf = a => Math.max(0, -(a?.fx?.money || 0));
const selfFunds = s => !!PLAYER_INFO[s?.player]?.selfFund;
const shortfall = (s, cost) => Math.max(0, cost - s.money);
const canAfford = (s, a) => selfFunds(s) || costOf(a) <= s.money + 1e-9;
// Pay a cost: from the war chest first, then (for a self-funder) from his own fortune.
function spend(s, cost) {
  const own = selfFunds(s) ? shortfall(s, cost) : 0;
  s.money = Math.max(0, s.money - cost);
  if (own > 0) {
    s.selfFunded = (s.selfFunded || 0) + own;
    s.label = (s.label || 0) + Math.max(1, Math.round(own));
  }
  return own;
}
// Choices with a cond appear only when it is true. The list is fixed when the event starts, so indices never change.
const shownChoices = (s, list) => list.map((ch, i) => i).filter(i => !list[i].cond || list[i].cond(s));
function pickQuestion(s) {
  const pool = QUESTIONS.filter(q => !s.asked.includes(q.id) && (!q.cond || q.cond(s)) && shownChoices(s, q.answers).length >= 2);
  const pri = s.step >= 2 ? pool.filter(q => q.priority) : [];
  return pri[0] || pick(pool.filter(q => !q.priority));
}

// The President's endorsement: only a candidate who can win (see PRES_ENDORSE in data.js).
function presidentsChoice(s) {
  const sh = stateShares(s), pool = active(s).filter(id => id !== 'whitlock');
  const can = id => sh[id] >= PRES_ENDORSE.viable && (id !== 'you' || s.pres >= PRES_ENDORSE.youNeed);
  const rank = id => presOf(s, id) + sh[id] * 1.5 + (id === 'you' ? 0 : (rand() - .5) * 10);
  const viable = pool.filter(can);
  if (!viable.length) return sorted(sh).map(e => e[0]).find(id => id !== 'you' && id !== 'whitlock');
  return viable.map(id => [id, rank(id)]).sort((a, b) => b[1] - a[1])[0][0];
}

// An outsider can enter the race partway through the campaign (see SCENARIOS.enter).
function lateEntries(s) {
  const out = [];
  for (const [id, step] of Object.entries(scenarioOf(s).enter || {})) if (step === s.step && !s.field.includes(id)) {
    s.field.push(id);
    const line = `${CAND[id].name} enters the race for governor. ${CAND[id].blurb.split('. ')[0]}.`;
    s.wire.unshift({ who: id, text: line });
    out.push(line);
  }
  return out;
}
function startStep() {
  const s = S, type = SCHEDULE[s.step];
  s.entryNews = lateEntries(s);
  s.lastPoll = stateShares(s);
  if (s.step >= 6) s.lowPlace = Math.max(s.lowPlace || 1, sorted(s.lastPoll).findIndex(e => e[0] === 'you') + 1);
  if (type === 'event') {
    const e = pickEvent(s);
    if (!e) return startQuestion(s);
    s.seenEvents.push(e.id);
    s.cur = { type: 'event', eid: e.id, sel: null, answered: null, breaking: [], shown: shownChoices(s, e.choices) };
  } else if (type === 'q') {
    return startQuestion(s);
  } else if (type === 'stop') {
    s.cur = { type: 'stop', region: null, action: 'rally', done: false, breaking: [] };
  } else if (type === 'debate1' || type === 'debate2') {
    // Three random questions, then closing statements.
    // The second debate asks up to three questions that come from the campaign so far (round 2), then general ones.
    const ok = q => !s.dAsked.includes(q.id) && q.id !== 'd_closing' && q.needs.every(id => active(s).includes(id)) && (!q.cond || q.cond(s));
    const general = shuffle(DEBATE_QUESTIONS.filter(q => !q.round && ok(q)));
    const topical = type === 'debate2' ? shuffle(DEBATE_QUESTIONS.filter(q => q.round === 2 && ok(q))).slice(0, 3) : [];
    const pool = [...topical, ...general];
    const qs = pool.slice(0, 3).map(q => q.id).concat('d_closing');
    s.dAsked.push(...qs.filter(id => id !== 'd_closing'));
    s.cur = { type: 'debate', which: type === 'debate1' ? 1 : 2, qs, idx: -1, sel: null, answered: null,
      scores: Object.fromEntries(active(s).map(id => [id, 0])), grades: Object.fromEntries(active(s).map(id => [id, []])), best: null, breaking: [] };
  } else if (type === 'endorse') {
    const who = presidentsChoice(s);
    s.endorsed = who;
    s.cur = { type: 'endorse', who, breaking: [] };
    // Organizations that have not decided yet announce now.
    for (const org in s.endorsements) if (!s.endorsements[org]) {
      const mainF = Object.entries(ENDORSERS[org].fx).sort((a, b) => b[1] - a[1])[0][0];
      const to = sorted(factionShares(s, mainF)).map(e => e[0]).find(id => id !== 'whitlock');
      s.endorsements[org] = to;
      s.cur.breaking.push(`${ENDORSERS[org].name} endorses ${displayName(s, to)}.`);
    }
    s.cur.breaking.push(...checkDropouts(s));
  } else if (type === 'election') {
    return runElection();
  }
  if (s.entryNews?.length) { s.cur.breaking = [...s.entryNews, ...(s.cur.breaking || [])]; s.entryNews = []; }
  save(); render();
}
function startQuestion(s) {
  const q = pickQuestion(s);
  if (!q) { s.step++; return startStep(); }
  s.asked.push(q.id);
  s.cur = { type: 'q', qid: q.id, sel: null, answered: null, breaking: s.entryNews || [], shown: shownChoices(s, q.answers) };
  s.entryNews = [];
  save(); render();
}

function advance() { S.step++; S.cur = null; startStep(); }

function opponentNews(s) {
  const opps = active(s).filter(id => id !== 'you' && NEWS[id]);
  const who = pick(opps.filter(id => id !== 'whitlock').concat(rand() < .2 && opps.includes('whitlock') ? ['whitlock'] : []));
  if (who) {
    const fresh = NEWS[who].filter((_, i) => !s.usedNews.includes(`${who}${i}`));
    if (fresh.length) {
      const item = pick(fresh);
      s.usedNews.push(`${who}${NEWS[who].indexOf(item)}`);
      addDelta(s, who, item[1]);
      s.wire.unshift({ who, text: item[0] });
    }
  }
  for (const id of active(s)) if (id !== 'you') for (const f of FKEYS) s.delta[id][f] = (s.delta[id][f] || 0) + (rand() - .5) * .8;
  // Rivals grow where they can win the most new votes: appeal × the faction's share of the vote × voters they do not have yet.
  const grows = id => id !== 'you' && (id !== 'whitlock' || scenarioOf(s).favors === 'whitlock');
  for (const id of active(s)) if (grows(id))
    for (const f of growthFactions(s, id)) s.delta[id][f] = (s.delta[id][f] || 0) + TUNE.oppMomentum;
  // Everybody attacks the frontrunner: in factions you lead, rivals claw back.
  for (const f of FKEYS) {
    const sh = factionShares(s, f);
    if (sorted(sh)[0][0] !== 'you') continue;
    for (const id of active(s)) if (id !== 'you' && id !== 'whitlock') s.delta[id][f] = (s.delta[id][f] || 0) + TUNE.clawback + sh.you / 200;
  }
}

function growthFactions(s, id) {
  const ev = expectedVote();
  return FKEYS.map(f => [f, CAND[id].base[f] * ev[f] * (1 - factionShares(s, f)[id] / 100)]).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
}
// risk.p is a number, or s => number when the chance depends on the campaign so far. Always between 5% and 95%.
const riskP = (s, risk) => clamp((typeof risk.p === 'function' ? risk.p(s) : risk.p) + difficultyOf(s).risk, .05, .95);
function startWar(s) {
  s.war = { start: s.step };
  s.flags.war = s.step + 1;
  for (const line of WAR_NEWS.slice().reverse()) s.wire.unshift({ who: null, text: line });
}
