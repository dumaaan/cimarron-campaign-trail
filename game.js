// ============================================================
// THE CAMPAIGN TRAIL: CIMARRON 2030 — engine + UI
// ============================================================
// Difficulty and balance. Change these to make the game easier or harder.
const TUNE = {
  T: 9,               // softmax temperature: lower = more decisive faction swings
  posMult: .8,        // how much of an answer's gains you keep (voters remember losses in full)
  oppMomentum: .15,   // per step, rivals grow in the two factions where they can win the most new votes
  clawback: .15,      // rivals regain ground in factions you lead
  rivalDebate: .5,    // share of their debate gains that rivals keep
  runoffGangup: 6,    // eliminated campaigns consolidate against you in a runoff
  runoffMomentum: 1.5, // per runoff step, your rival gains in every faction (anti-incumbent consolidation)
  endorseTop: 5,      // runoff endorsement: bonus in the endorser's two strongest factions
  endorseAll: 1,      // runoff endorsement: bonus in every faction
  fringeRunoff: 8,    // in a runoff, older, evangelical, business and farm voters unite against a fringe outsider
};
const RUNOFF_LINE = 40;      // a candidate needs this % to avoid a runoff
const DROPOUT_LINE = 9;      // rivals below this % may drop out (after the President's endorsement)
const SAVE_KEY = 'cimarron_campaign_trail_save_v4';
const FKEYS = Object.keys(FACTIONS);
const CAND = Object.fromEntries(CANDIDATES.map(c => [c.id, c]));
const REG = Object.fromEntries(REGIONS.map(r => [r.id, r]));
const STRAW_WEIGHTS = { online: 2.2, maga: 1.6, faith: 1.4, liberty: 1.4, guns: 1, farm: .5, chamber: .5, seniors: .5 };

let S = null;
let electionTimer = null;
const UI = { tab: 'state' };
const $ = sel => document.querySelector(sel);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// Seeded random numbers (mulberry32). The seed is stored in the game state, so a game can be replayed.
function rand() {
  if (!S) return Math.random();
  let t = (S.rng = (S.rng + 0x6D2B79F5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = a => a[Math.floor(rand() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- state ----------
const URLQ = new URLSearchParams(location.search);   // testing: ?scenario=celebrity&war=1
function pickScenario() {
  const forced = SCENARIOS.find(x => x.id === URLQ.get('scenario'));
  if (forced) return forced;
  let r = rand() * SCENARIOS.reduce((a, x) => a + x.weight, 0);
  return SCENARIOS.find(x => (r -= x.weight) < 0) || SCENARIOS[0];
}
function newState(name, seed) {
  seed = (seed >>> 0) || Math.floor(Math.random() * 900000) + 100000;
  S = {
    name, seed, rng: seed, screen: 'record', record: null, mate: null,
    step: 0, rino: 0, pres: CAND.you.pres, money: 2.0,
    delta: Object.fromEntries(CANDIDATES.map(c => [c.id, {}])),
    bonus: Object.fromEntries(CANDIDATES.map(c => [c.id, {}])),
    gotv: {},
    endorsements: Object.fromEntries(Object.entries(ENDORSERS).map(([k, v]) => [k, v.holder])),
    flags: {}, asked: [], dAsked: [], seenEvents: [], usedNews: [], wire: [], log: [], promises: [],
    dropped: [], endorsed: null, cur: null, lastPoll: null, election: null, concession: null,
    runoff: null, runoffResult: null, electionPhase: 'primary', finalWinner: null, war: null,
  };
  const warRoll = rand(), warStep = WAR.earliest + Math.floor(rand() * (WAR.latest - WAR.earliest + 1));
  S.warPlanned = URLQ.get('war') === '1' || warRoll < WAR.chance ? warStep : null;
  applyScenario(S, pickScenario());
  return S;
}
// Set up the field and starting conditions of a scenario. Used by newState and by the simulator.
function applyScenario(s, sc) {
  s.scenario = sc.id;
  s.field = sc.field.slice();
  s.presOverride = { ...(sc.presOverride || {}) };
  for (const id in sc.oppAll || {}) addAll(s, id, sc.oppAll[id]);
  for (const id in sc.oppFx || {}) addDelta(s, id, sc.oppFx[id]);
  if (sc.youAll) addAll(s, 'you', sc.youAll);
  if (sc.flag) s.flags[sc.flag] = 1;
  if (sc.warAt != null) s.warPlanned = sc.warAt;
  // Endorsements held by candidates who are not in this field become open.
  for (const org in s.endorsements) if (s.endorsements[org] && !s.field.includes(s.endorsements[org])) s.endorsements[org] = null;
}
const scenarioOf = s => SCENARIOS.find(x => x.id === s.scenario) || SCENARIOS[0];
const displayName = (s, id) => id === 'you' ? `Gov. ${s.name}` : CAND[id].name;
const shortName = (s, id) => id === 'you' ? s.name.split(' ').slice(-1)[0] : CAND[id].short;
const initials = (s, id) => id === 'you' ? (s ? s.name : 'You').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : CAND[id].initials;

function addDelta(s, cid, fx, mult = 1) {
  for (const f of FKEYS) if (fx[f]) s.delta[cid][f] = (s.delta[cid][f] || 0) + fx[f] * mult;
}
function addAll(s, cid, v) { for (const f of FKEYS) s.delta[cid][f] = (s.delta[cid][f] || 0) + v; }

function applyFx(s, fx) {
  if (!fx) return;
  // Negativity bias: voters remember what they dislike more than what they like.
  for (const f of FKEYS) if (fx[f]) s.delta.you[f] = (s.delta.you[f] || 0) + (fx[f] > 0 ? fx[f] * TUNE.posMult : fx[f]);
  if (fx.rino) s.rino = Math.max(0, s.rino + fx.rino);
  if (fx.pres) s.pres = clamp(s.pres + fx.pres, 0, 100);
  if (fx.money) s.money = Math.max(0, s.money + fx.money);
  if (fx.flag) s.flags[fx.flag] = s.step + 1;
  for (const id in fx.opp || {}) if (active(s).includes(id)) addAll(s, id, fx.opp[id]);
  if (fx.oppLeader) { const r = sorted(stateShares(s)).map(e => e[0]).find(id => id !== 'you'); if (r) addAll(s, r, fx.oppLeader); }
  for (const org in fx.endorse || {}) {
    const to = fx.endorse[org];
    if (to === 'you' || !s.dropped.includes(to)) s.endorsements[org] = to;
  }
  for (const r in fx.gotv || {}) s.gotv[r] = (s.gotv[r] || 0) + fx.gotv[r];
  if (fx.gotvAll) for (const r of REGIONS) s.gotv[r.id] = (s.gotv[r.id] || 0) + fx.gotvAll;
  if (fx.drop && active(s).includes(fx.drop.id)) dropOut(s, fx.drop.id, fx.drop.to);
  if (fx.oppRival && s.runoff) addAll(s, s.runoff.rival, fx.oppRival);
  // The President never endorses the traditional conservative.
  if (fx.presEndorse && s.runoff && !(fx.presEndorse === 'rival' && s.runoff.rival === 'whitlock')) s.endorsed = fx.presEndorse === 'you' ? 'you' : s.runoff.rival;
}

// ---------- vote model ----------
// Candidates in the race. During a live runoff, only the two finalists.
const active = s => s.runoff?.live ? s.runoff.two : s.field.filter(id => !s.dropped.includes(id));
const FRINGE_OPPONENTS = ['seniors', 'faith', 'chamber', 'farm'];
const presOf = (s, id) => id === 'you' ? s.pres : (s.presOverride?.[id] ?? CAND[id].pres);
const topFactions = id => FKEYS.slice().sort((a, b) => CAND[id].base[b] - CAND[id].base[a]).slice(0, 2);

// War: how closely a candidate is tied to the President and his war (0 = not at all, about 1.2 = fully).
function warLoyalty(s, cid) {
  const endorsed = s.endorsed === cid ? .5 : 0;
  const maga = cid === 'you' ? CAND.you.base.maga + Math.min(s.delta.you.maga || 0, 30) : CAND[cid].base.maga;
  const stance = cid === 'you' ? (s.flags.war_hawk ? .25 : 0) - (s.flags.war_dove ? .3 : 0) : (CAND[cid].hawk || 0);
  return endorsed + presOf(s, cid) / 200 + maga / 200 + stance;
}
function warPenalty(s, cid, f) {
  if (!s.war) return 0;
  const ramp = Math.min(1, (s.step - s.war.start + 1) / WAR.rampSteps);
  return (warLoyalty(s, cid) - WAR.pivot) * (WAR.weights[f] || 0) * ramp;
}
function score(s, cid, f, rid) {
  let v = CAND[cid].base[f] + (s.delta[cid][f] || 0);
  if (cid === 'you') {
    v += f === 'chamber' ? s.rino * .8 : -s.rino * 1.2;   // the RINO label costs support everywhere but the business wing
    v += Math.min(s.money, 6) * .4;                        // war chest = ads and staff
  }
  if (s.endorsed === cid) v += ({ maga: 8, online: 3, seniors: 3 })[f] || 0;
  for (const org in s.endorsements) if (s.endorsements[org] === cid) v += ENDORSERS[org].fx[f] || 0;
  if (rid) v += s.bonus[cid][rid] || 0;
  v -= warPenalty(s, cid, f);
  // Runoff endorsements: the endorser's two strongest factions +5, every faction +1.
  if (CAND[cid].fringe && s.runoff && FRINGE_OPPONENTS.includes(f)) v -= TUNE.fringeRunoff;
  for (const e in s.runoff?.endorse || {}) if (s.runoff.endorse[e] === cid) v += (topFactions(e).includes(f) ? TUNE.endorseTop : 0) + TUNE.endorseAll;
  return v;
}
function softmax(s, f, rid, cands, noise) {
  const ex = cands.map(c => Math.exp((score(s, c, f, rid) + (noise ? noise[c] : 0)) / TUNE.T));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map(e => e / sum);
}
// ---- Vote model (all numbers are vote counts) ----
// A faction's expected votes in a region = registered Republicans in the region × faction share × faction turnout × regional turnout.
const REGISTERED_R = STATE_PROFILE.registeredR;
// Turnout rate of a faction: the base rate plus any change from the scenario (for example, a surge of young voters).
const turnoutOf = f => FACTIONS[f].turnout + (S ? scenarioOf(S).turnout?.[f] || 0 : 0);
const factionVotes = (r, f) => REGISTERED_R * r.voters / 100 * (r.mix[f] || 0) * turnoutOf(f) * r.turnoutMod;
const sumVals = o => Object.values(o).reduce((a, b) => a + b, 0);
const toShares = votes => { const t = sumVals(votes); return Object.fromEntries(Object.entries(votes).map(([c, v]) => [c, v / t * 100])); };
const gotvMult = (s, c, rid) => c === 'you' ? 1 + (s.gotv[rid] || 0) : 1;   // GOTV: more of your supporters vote

// Votes for each candidate in one region. Each faction splits its votes by the softmax of candidate appeal.
function regionVotes(s, rid, cands = active(s), noise) {
  const r = REG[rid], out = Object.fromEntries(cands.map(c => [c, 0]));
  for (const f in r.mix) {
    const v = factionVotes(r, f), sm = softmax(s, f, rid, cands, noise);
    cands.forEach((c, i) => out[c] += v * sm[i] * gotvMult(s, c, rid));
  }
  return out;
}
const regionShares = (s, rid, cands = active(s), noise) => toShares(regionVotes(s, rid, cands, noise));
function stateVotes(s, cands = active(s), noiseByRegion) {
  const out = Object.fromEntries(cands.map(c => [c, 0]));
  for (const r of REGIONS) { const v = regionVotes(s, r.id, cands, noiseByRegion?.[r.id]); for (const c of cands) out[c] += v[c]; }
  return out;
}
const stateShares = (s, cands = active(s), noiseByRegion) => toShares(stateVotes(s, cands, noiseByRegion));
// Support within one faction, statewide: the faction's votes in every region, added together.
function factionShares(s, f, cands = active(s)) {
  const out = Object.fromEntries(cands.map(c => [c, 0]));
  for (const r of REGIONS) {
    if (!r.mix[f]) continue;
    const v = factionVotes(r, f), sm = softmax(s, f, r.id, cands);
    cands.forEach((c, i) => out[c] += v * sm[i] * gotvMult(s, c, r.id));
  }
  return toShares(out);
}
// Expected turnout before any campaign activity.
const regionWeight = r => FKEYS.reduce((a, f) => a + factionVotes(r, f), 0);     // expected votes in a region
const TOTAL_WEIGHT = () => REGIONS.reduce((a, r) => a + regionWeight(r), 0);       // expected votes statewide
const regionTurnout = r => regionWeight(r) / (REGISTERED_R * r.voters / 100);      // share of the region's registered Republicans
const registered = Object.fromEntries(FKEYS.map(f => [f, REGIONS.reduce((a, r) => a + r.voters * (r.mix[f] || 0), 0)]));
const expectedVote = () => { const t = TOTAL_WEIGHT(); return Object.fromEntries(FKEYS.map(f => [f, REGIONS.reduce((a, r) => a + factionVotes(r, f), 0) / t * 100])); };
const sorted = sh => Object.entries(sh).sort((a, b) => b[1] - a[1]);

// ---------- campaign flow ----------
function pickEvent(s) {
  const ok = e => !s.seenEvents.includes(e.id) && (!e.cond || e.cond(s)) && (e.minStep || 0) <= s.step && (e.maxStep ?? 99) >= s.step;
  const pool = EVENTS.filter(ok);
  return pool.find(e => e.priority) || pick(pool.filter(e => !e.priority));
}
function pickQuestion(s) {
  const pool = QUESTIONS.filter(q => !s.asked.includes(q.id) && (!q.cond || q.cond(s)));
  const pri = s.step >= 2 ? pool.filter(q => q.priority) : [];
  return pri[0] || pick(pool.filter(q => !q.priority));
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
  if (type === 'event') {
    const e = pickEvent(s);
    if (!e) return startQuestion(s);
    s.seenEvents.push(e.id);
    s.cur = { type: 'event', eid: e.id, sel: null, answered: null, breaking: [] };
  } else if (type === 'q') {
    return startQuestion(s);
  } else if (type === 'stop') {
    s.cur = { type: 'stop', region: null, action: 'rally', done: false, breaking: [] };
  } else if (type === 'debate1' || type === 'debate2') {
    // Three random questions, then closing statements.
    const pool = shuffle(DEBATE_QUESTIONS.filter(q => !s.dAsked.includes(q.id) && q.id !== 'd_closing' && q.needs.every(id => active(s).includes(id))));
    const qs = pool.slice(0, 3).map(q => q.id).concat('d_closing');
    s.dAsked.push(...qs.filter(id => id !== 'd_closing'));
    s.cur = { type: 'debate', which: type === 'debate1' ? 1 : 2, qs, idx: -1, sel: null, answered: null,
      scores: Object.fromEntries(active(s).map(id => [id, 0])), grades: Object.fromEntries(active(s).map(id => [id, []])), best: null, breaking: [] };
  } else if (type === 'endorse') {
    const pool = active(s).filter(id => id !== 'whitlock');
    const who = pool.map(id => [id, presOf(s, id) + (id === 'you' ? 0 : (rand() - .5) * 10)]).sort((a, b) => b[1] - a[1])[0][0];
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
  s.cur = { type: 'q', qid: q.id, sel: null, answered: null, breaking: s.entryNews || [] };
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
const riskP = (s, risk) => typeof risk.p === 'function' ? risk.p(s) : risk.p;
function startWar(s) {
  s.war = { start: s.step };
  s.flags.war = s.step + 1;
  for (const line of WAR_NEWS.slice().reverse()) s.wire.unshift({ who: null, text: line });
}

function recordPromise(s, key) { const p = PROMISES[key]; if (p && !s.promises.includes(p)) s.promises.push(p); }

function perfOf(fx) {
  let p = 0;
  for (const f of FKEYS) if (fx[f]) p += fx[f] > 0 ? fx[f] : fx[f] * .5;
  for (const id in fx.opp || {}) p += -fx.opp[id] * .8;
  return p - (fx.rino || 0) * 1.5;
}
const grade = p => p >= 5 ? 'Strong' : p >= 2.5 ? 'Solid' : p >= .5 ? 'Weak' : 'Poor';

function answer() {
  const s = S, c = s.cur;
  if (c.sel == null) return;
  if (c.type === 'q') {
    const q = QUESTIONS.find(q => q.id === c.qid), a = q.answers[c.sel];
    applyFx(s, a.fx);
    if (q.region) s.bonus.you[q.region] = (s.bonus.you[q.region] || 0) + 1;
    recordPromise(s, `${q.id}:${c.sel}`);
    s.log.push({ q: q.setting, a: a.text });
    opponentNews(s);
    if (s.step > SCHEDULE.indexOf('endorse')) c.breaking = checkDropouts(s);
  } else if (c.type === 'event' || c.type === 'revent') {
    const e = (c.type === 'revent' ? RUNOFF_EVENTS : EVENTS).find(e => e.id === c.eid), ch = e.choices[c.sel];
    applyFx(s, ch.fx);
    c.fb = ch.fb; c.fx = { ...ch.fx };
    if (ch.risk) {
      const won = rand() < riskP(s, ch.risk), o = won ? ch.risk.win : ch.risk.lose;
      c.outcome = won ? 'win' : 'lose';
      applyFx(s, o.fx);
      c.fb = o.fb; c.fx = { ...ch.fx, ...o.fx };
    }
    if (e.special === 'strawpoll') runStrawPoll(s, c);
    if (e.special === 'war') startWar(s);
    recordPromise(s, `${e.id}:${c.sel}`);
    s.log.push({ q: `${c.type === 'revent' ? 'Runoff' : e.kind}: ${e.title}`, a: ch.text + (c.outcome ? ` (${c.outcome === 'win' ? 'it worked' : 'it failed'})` : '') });
    if (c.type === 'event') {
      opponentNews(s);
      if (s.step > SCHEDULE.indexOf('endorse')) c.breaking = checkDropouts(s);
    }
  } else if (c.type === 'debate') {
    const q = DEBATE_QUESTIONS.find(q => q.id === c.qs[c.idx]), a = q.answers[c.sel];
    applyFx(s, a.fx);
    const round = [];
    const myPerf = perfOf(a.fx);
    c.scores.you += myPerf;
    round.push({ id: 'you', text: a.text, perf: myPerf });
    for (const id in a.fx.opp || {}) if (c.scores[id] != null) c.scores[id] += a.fx.opp[id] * .5;
    for (const id of active(s)) {
      if (id === 'you' || !q.rivals?.[id]) continue;
      const r = q.rivals[id];
      addDelta(s, id, r.fx, TUNE.rivalDebate);
      let p = perfOf(r.fx);
      const target = r.attack && active(s).includes(r.attack) ? r.attack : null;
      if (target) {
        p += 1.5;
        c.scores[target] -= .75;
        addAll(s, target, target === 'you' ? -.5 : -1);
      }
      c.scores[id] += p;
      round.push({ id, text: r.text, perf: p, attack: target });
    }
    for (const r of round) {
      c.grades[r.id]?.push(grade(r.perf));
      if (!c.best || r.perf > c.best.perf) c.best = { id: r.id, text: r.text, perf: r.perf };
    }
    c.round = round;
    s.log.push({ q: `Debate #${c.which}`, a: a.text });
  }
  c.answered = c.sel;
  save(); render();
}

function runStrawPoll(s, c) {
  const cands = active(s), out = Object.fromEntries(cands.map(id => [id, 0]));
  let tot = 0;
  for (const f of FKEYS) {
    const w = STRAW_WEIGHTS[f] * registered[f], fs = factionShares(s, f);
    for (const id of cands) out[id] += w * fs[id];
    tot += w;
  }
  for (const id of cands) out[id] = Math.max(out[id] / tot + (rand() - .5) * 4, 0);
  const sum = Object.values(out).reduce((a, b) => a + b, 0);
  for (const id of cands) out[id] = out[id] / sum * 100;
  c.straw = sorted(out);
  addAll(s, c.straw[0][0], 2);
}

function debateNext() {
  const c = S.cur;
  if (c.idx < c.qs.length - 1) { c.idx++; c.sel = null; c.answered = null; c.round = null; }
  else if (c.idx === c.qs.length - 1) {
    c.idx = 99;
    const ids = Object.keys(c.scores).filter(id => active(S).includes(id));
    const ex = ids.map(id => Math.exp(c.scores[id] / 3)), sum = ex.reduce((a, b) => a + b, 0);
    c.snap = sorted(Object.fromEntries(ids.map((id, i) => [id, ex[i] / sum * 100])));
    c.winner = c.snap[0][0];
    addAll(S, c.winner, 2);
    const last = c.snap[c.snap.length - 1][0];
    if (last !== c.winner) addAll(S, last, -1);
    if (c.which === 2) c.breaking = checkDropouts(S);
  } else return advance();
  save(); render();
}

function doStop() {
  const s = S, c = s.cur, act = STOP_ACTIONS.find(a => a.id === c.action);
  if (!c.region) return;
  if (act.cost > 0 && s.money < act.cost) return;
  s.money = Math.max(0, s.money - act.cost);
  s.bonus.you[c.region] = (s.bonus.you[c.region] || 0) + act.bonus;
  if (act.gotv) s.gotv[c.region] = (s.gotv[c.region] || 0) + act.gotv;
  c.oppMoves = [];
  for (const id of active(s)) {
    if (id === 'you') continue;
    const best = REGIONS.map(r => [r.id, regionShares(s, r.id)[id] + rand() * 15]).sort((a, b) => b[1] - a[1])[0][0];
    const amt = id === 'vaskel' ? 6 : id === 'whitlock' ? 2 : 4;
    s.bonus[id][best] = (s.bonus[id][best] || 0) + amt;
    c.oppMoves.push(`${CAND[id].short} ${id === 'vaskel' ? 'runs television ads in' : 'holds events in'} ${REG[best].name}.`);
  }
  s.log.push({ q: 'Campaign Stop', a: `${act.name} in ${REG[c.region].name}` });
  c.done = true;
  if (s.step > SCHEDULE.indexOf('endorse')) c.breaking = checkDropouts(s);
  save(); render();
}

function dropOut(s, id, to) {
  s.dropped.push(id);
  addAll(s, to, 2);
  for (const org in s.endorsements) if (s.endorsements[org] === id) s.endorsements[org] = to;
  if (s.endorsed === id) s.endorsed = null;
  const line = `${CAND[id].name} withdraws from the race and endorses ${displayName(s, to)}.` + (TEXT.dropout[id] || '');
  s.wire.unshift({ who: id, text: line });
  return line;
}
function checkDropouts(s) {
  const out = [], sh = stateShares(s);
  for (const [id, v] of sorted(sh).reverse()) {
    if (id === 'you' || id === 'whitlock' || v >= DROPOUT_LINE || active(s).length <= 3) continue;
    const topF = FKEYS.slice().sort((a, b) => CAND[id].base[b] - CAND[id].base[a])[0];
    const to = sorted(factionShares(s, topF)).map(e => e[0]).find(c => c !== 'whitlock' && c !== id);
    out.push(dropOut(s, id, to));
  }
  return out;
}

// ---------- election night ----------
const RUNOFF_TURNOUT = .8;   // runoffs draw fewer voters than the primary
const RUNOFF_DAY = new Date(2030, 7, 25);

// Count an election: real vote counts per region, with a little polling error per region.
function countVotes(s, cands, turnoutMult = 1) {
  const noise = {};
  for (const r of REGIONS) noise[r.id] = Object.fromEntries(cands.map(c => [c, (rand() - .5) * 4]));
  const order = shuffle(REGIONS.map(r => r.id));
  const votes = Object.fromEntries(REGIONS.map(r => [r.id, Object.fromEntries(Object.entries(regionVotes(s, r.id, cands, noise[r.id])).map(([c, v]) => [c, Math.round(v * turnoutMult)]))]));
  const results = Object.fromEntries(REGIONS.map(r => [r.id, toShares(votes[r.id])]));
  const totalVotes = Object.fromEntries(cands.map(c => [c, REGIONS.reduce((a, r) => a + votes[r.id][c], 0)]));
  const total = toShares(totalVotes);
  return { order, votes, results, totalVotes, total, cast: sumVals(totalVotes), winner: sorted(total)[0][0], revealed: 0 };
}

function runElection() {
  const s = S;
  s.election = countVotes(s, active(s));
  const ranked = sorted(s.election.total);
  if (ranked[0][1] >= RUNOFF_LINE) s.finalWinner = ranked[0][0];
  else {
    const two = [ranked[0][0], ranked[1][0]];
    s.election.needsRunoff = two;
    if (!two.includes('you')) {
      // You are eliminated. The other two finish the race without you.
      s.runoff = { two, rival: null, live: false, endorse: {} };
      s.runoffResult = countVotes(s, two, RUNOFF_TURNOUT);
      s.finalWinner = s.runoffResult.winner;
    }
  }
  s.electionPhase = 'primary';
  s.screen = 'election';
  save(); render();
}

// ---------- the runoff campaign ----------
function startRunoff() {
  const s = S, two = s.election.needsRunoff, rival = two.find(c => c !== 'you');
  const eliminated = sorted(s.election.total).map(e => e[0]).filter(id => !two.includes(id)).slice(0, 3);
  s.runoff = { two, rival, live: true, endorse: {}, eliminated, seen: [], idx: 0,
    queue: ['intro', ...eliminated.map(id => `court:${id}`), 'revent', 'revent', 'vote'] };
  addAll(s, rival, TUNE.runoffGangup);
  s.screen = 'runoff';
  startRunoffStep();
}
function startRunoffStep() {
  const s = S, R = s.runoff, item = R.queue[R.idx];
  s.lastPoll = stateShares(s);
  if (item === 'intro') s.cur = { type: 'rintro', breaking: [] };
  else if (item.startsWith('court:')) s.cur = { type: 'court', who: item.slice(6), sel: null, answered: null, breaking: [] };
  else if (item === 'revent') {
    const e = pick(RUNOFF_EVENTS.filter(e => !R.seen.includes(e.id) && (!e.cond || e.cond(s))));
    if (!e) { R.idx++; return startRunoffStep(); }
    R.seen.push(e.id);
    s.cur = { type: 'revent', eid: e.id, sel: null, answered: null, breaking: [] };
  } else if (item === 'vote') {
    s.runoffResult = countVotes(s, R.two, RUNOFF_TURNOUT);
    s.finalWinner = s.runoffResult.winner;
    s.electionPhase = 'runoff';
    s.screen = 'election';
  }
  save(); render();
}
function runoffAdvance() { S.runoff.idx++; S.cur = null; addAll(S, S.runoff.rival, TUNE.runoffMomentum); startRunoffStep(); }
const runoffDate = s => new Date(PRIMARY_DAY.getTime() + Math.round((s.runoff.idx + 1) * (RUNOFF_DAY - PRIMARY_DAY) / DAY / s.runoff.queue.length) * DAY);

function courtAnswer() {
  const s = S, c = s.cur, ch = COURT[c.who].choices[c.sel];
  applyFx(s, ch.fx);
  const p = typeof ch.p === 'function' ? ch.p(s) : ch.p;
  c.result = rand() < p ? 'you' : rand() < .6 ? 'rival' : 'none';
  s.runoff.endorse[c.who] = c.result === 'you' ? 'you' : c.result === 'rival' ? s.runoff.rival : 'none';
  const line = c.result === 'none' ? `${CAND[c.who].name} declines to endorse in the runoff.` : `${CAND[c.who].name} endorses ${displayName(s, s.runoff.endorse[c.who])} in the runoff.`;
  s.wire.unshift({ who: c.who, text: line });
  s.log.push({ q: `Runoff: ${COURT[c.who].title}`, a: `${ch.text} (${RUNOFF_TEXT.endorsed[c.result]})` });
  c.answered = c.sel;
  save(); render();
}

// ---------- save ----------
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }
function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return null; } }
function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

// ============================================================
// RENDERING
// ============================================================
const colorOf = id => CAND[id].color;
function portrait(s, id, size = 44) {
  const tip = id === 'you' ? 'Your campaign. Click for details.' : `${CAND[id].name}, ${CAND[id].title}. Click for profile.`;
  return `<span class="portrait clickable" data-cand="${id}" title="${esc(tip)}"
    style="--c:${colorOf(id)};width:${size}px;height:${size}px;font-size:${size * .36}px">${initials(s, id)}</span>`;
}
const nameLink = (s, id, full = true) => `<span class="cand-link" data-cand="${id}">${full ? displayName(s, id) : shortName(s, id)}</span>`;
function staffBadge(id) {
  const m = STAFF[id];
  return `<span class="portrait" style="--c:${m.color};width:30px;height:30px;font-size:11px">${m.initials}</span>`;
}
const CAMPAIGN_START = new Date(2030, 1, 3), PRIMARY_DAY = new Date(2030, 7, 4), DAY = 864e5;
const dateAt = step => new Date(CAMPAIGN_START.getTime() + Math.round(step * (PRIMARY_DAY - CAMPAIGN_START) / DAY / (SCHEDULE.length - 1)) * DAY);
const daysToPrimary = step => Math.round((PRIMARY_DAY - dateAt(step)) / DAY);
const fmtDate = d => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const dateOf = step => fmtDate(dateAt(step));

function mapSVG(s, opts = {}) {
  const { results, revealed, clickable, selected } = opts;
  const paths = REGIONS.map(r => {
    let fill = '#d9d4c7', label = '', op = 1, sh = null;
    if (results) sh = revealed.includes(r.id) ? results[r.id] : null;
    else sh = regionShares(s, r.id);
    if (sh) {
      const rk = sorted(sh), margin = rk[0][1] - (rk[1]?.[1] || 0);
      fill = colorOf(rk[0][0]); op = .35 + Math.min(margin, 25) / 25 * .65;
      label = `${shortName(s, rk[0][0])} ${rk[0][1].toFixed(0)}%`;
    }
    return `<g class="region ${clickable ? 'selecting' : ''} ${selected === r.id ? 'selected' : ''}" data-region="${r.id}">
      <path d="${r.path}" fill="${fill}" fill-opacity="${op}"><title>${esc(r.name)}: click for details</title></path>
      <text x="${r.label[0]}" y="${r.label[1] - 6}" class="rname">${r.name}</text>
      <text x="${r.label[0]}" y="${r.label[1] + 10}" class="rlead">${label}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="-4 -4 608 308" class="map" role="img" aria-label="Map of ${STATE_NAME}">${paths}
    <path d="M565,0 L580,22 L572,48 L600,70" class="river"/></svg>`;
}

function pollRows(s, sh, last) {
  return sorted(sh).map(([id, v]) => {
    const d = last && last[id] != null ? v - last[id] : 0;
    return `<div class="poll-row">${portrait(s, id, 26)}
      <div class="poll-main"><div class="poll-name">${nameLink(s, id)}${s.endorsed === id ? ' <span class="endorse-tag">★ President</span>' : ''}</div>
        <div class="pbar"><div style="width:${v}%;background:${colorOf(id)}"></div></div></div>
      <div class="poll-num">${v.toFixed(1)}%${Math.abs(d) >= .1 ? `<span class="${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${d.toFixed(1)}</span>` : ''}</div>
    </div>`;
  }).join('');
}

function crosstab(s, rows, getShares, labelOf, subOf) {
  const cands = Object.keys(getShares(rows[0]));
  return `<table class="xtab"><thead><tr><th></th>${cands.map(id => `<th>${portrait(s, id, 22)}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(row => {
      const sh = getShares(row), lead = sorted(sh)[0][0];
      return `<tr><td class="xlabel">${labelOf(row)}<span class="muted small"> ${subOf(row)}</span></td>${cands.map(id =>
        `<td class="${id === lead ? 'lead' : ''}" style="${id === lead ? `background:${colorOf(id)}22;color:${colorOf(id)}` : ''}">${sh[id].toFixed(0)}</td>`).join('')}</tr>`;
    }).join('') + '</tbody></table>';
}

function pollPanel(s) {
  const tabs = [['state', 'Statewide'], ['faction', 'By Faction'], ['region', 'By Region']];
  let body = '';
  if (UI.tab === 'state') body = pollRows(s, stateShares(s), s.lastPoll) + (s.dropped.length ? `<div class="dropped">Withdrawn: ${s.dropped.map(id => CAND[id].short).join(', ')}</div>` : '');
  else if (UI.tab === 'faction') body = crosstab(s, FKEYS, f => factionShares(s, f), f => `<span title="${esc(FACTIONS[f].blurb)}">${FACTIONS[f].name}</span>`, f => `${expectedVote()[f].toFixed(0)}% of vote`)
    + `<p class="muted small">Support within each faction. "% of vote" is the faction's expected share of primary voters after turnout.</p>`;
  else body = crosstab(s, REGIONS.map(r => r.id), rid => regionShares(s, rid), rid => `<span class="region-link" data-region="${rid}">${REG[rid].name}</span>`, rid => `${(regionWeight(REG[rid]) / TOTAL_WEIGHT() * 100).toFixed(0)}%`)
    + `<p class="muted small">Current support by region. The small number is the region's expected share of the statewide vote.</p>`;
  return `<div class="panel-title">Primary Polling</div>
    <div class="tabs">${tabs.map(([id, n]) => `<button class="tab ${UI.tab === id ? 'on' : ''}" data-tab="${id}">${n}</button>`).join('')}</div>${body}`;
}

function endorsementPanel(s) {
  return `<div class="panel-title">Endorsements</div>` + Object.entries(ENDORSERS).map(([org, e]) => {
    const h = s.endorsements[org];
    return `<div class="endo-row"><span>${e.name}</span><span>${h ? `${portrait(s, h, 20)} ${nameLink(s, h, false)}` : '<span class="muted">Undecided</span>'}</span></div>`;
  }).join('') + `<div class="endo-row"><span><b>The President</b></span><span>${s.endorsed ? `${portrait(s, s.endorsed, 20)} ${nameLink(s, s.endorsed, false)}` : '<span class="muted">Not yet</span>'}</span></div>`;
}

function statusBar(s) {
  const rinoLabel = s.rino < 3 ? 'Trusted' : s.rino < 7 ? 'Questioned' : s.rino < 12 ? 'Attacked as RINO' : 'Branded a RINO';
  return `<div class="status">
    ${s.runoff?.live ? `<div><span class="lbl">Runoff Campaign</span>${fmtDate(runoffDate(s))}</div>
      <div><span class="lbl">Days to Runoff</span>${Math.max(0, Math.round((RUNOFF_DAY - runoffDate(s)) / DAY))}</div>`
    : `<div><span class="lbl">Date</span>${dateOf(s.step)}</div>
    <div><span class="lbl">Days to Primary</span>${daysToPrimary(s.step)}</div>`}
    ${s.war ? `<div><span class="lbl">Oil Crisis</span><span class="down">Gas $${(6.2 + Math.min(s.step - s.war.start, 4) * .15).toFixed(2)}</span></div>` : ''}
    <div><span class="lbl">War Chest</span>$${s.money.toFixed(1)}M</div>
    <div><span class="lbl">RINO Label</span><span class="${s.rino >= 7 ? 'down' : ''}">${s.rino.toFixed(0)} · ${rinoLabel}</span></div>
    <div><span class="lbl">The President's Opinion</span><span class="mini-bar"><span style="width:${s.pres}%"></span></span></div>
    <div class="status-btns"><button class="btn small" id="open-profile">State Profile</button><button class="btn small alt" data-cand="you">My Campaign</button></div>
  </div>`;
}

function wirePanel(s) {
  if (!s.wire.length) return '';
  return `<div class="wire"><div class="wire-title">CAMPAIGN WIRE</div>${s.wire.slice(0, 6).map((w, i) =>
    `<div class="wire-item ${i === 0 ? 'fresh' : ''}"><span class="dot" style="background:${w.who ? colorOf(w.who) : '#c9a13b'}"></span>${esc(w.text)}</div>`).join('')}</div>`;
}

function chips(s, fx) {
  const out = [];
  const arrow = v => v > 0 ? (v >= 4 ? '▲▲' : '▲') : (v <= -4 ? '▼▼' : '▼');
  for (const f of FKEYS) if (fx[f]) out.push([`${FACTIONS[f].name} ${arrow(fx[f])}`, fx[f] > 0 ? 'up' : 'down']);
  if (fx.rino) out.push([`RINO Label ${fx.rino > 0 ? '+' : ''}${fx.rino}`, fx.rino > 0 ? 'down' : 'up']);
  if (fx.pres) out.push([`The President ${arrow(fx.pres)}`, fx.pres > 0 ? 'up' : 'down']);
  if (fx.money) out.push([`War Chest ${fx.money > 0 ? '+' : '−'}$${Math.abs(fx.money).toFixed(2)}M`, fx.money > 0 ? 'up' : 'down']);
  for (const id in fx.opp || {}) out.push([`${CAND[id].short} ${arrow(fx.opp[id])}`, fx.opp[id] < 0 ? 'up' : 'down']);
  if (fx.oppLeader) out.push(['Race leader ▼', 'up']);
  for (const org in fx.endorse || {}) out.push([`${ENDORSERS[org].name} → ${fx.endorse[org] === 'you' ? 'You' : CAND[fx.endorse[org]].short}`, fx.endorse[org] === 'you' ? 'up' : 'down']);
  if (fx.gotvAll || fx.gotv) out.push(['Turnout operation ▲', 'up']);
  if (fx.drop) out.push([`${CAND[fx.drop.id].short} withdraws`, 'up']);
  return `<div class="chips">${out.map(([t, c]) => `<span class="chip ${c}">${t}</span>`).join('')}</div>`;
}

const breakingBox = c => c?.breaking?.length ? c.breaking.map(b => `<div class="breaking"><b>BREAKING:</b> ${esc(b)}</div>`).join('') : '';

function answersList(list, c, riskOf = () => false) {
  return `<div class="answers">${list.map((a, i) => `
    <label class="answer ${c.answered != null ? 'locked' : ''} ${c.answered === i ? 'chosen' : ''}">
      <input type="radio" name="ans" value="${i}" ${c.sel === i ? 'checked' : ''} ${c.answered != null ? 'disabled' : ''}>
      <span>${esc(a.text)}${riskOf(a) ? ` <span class="risk-tag" title="The outcome of this choice is uncertain.">RISK · ${Math.round(riskP(S, a.risk) * 100)}% chance it works</span>` : ''}</span></label>`).join('')}</div>`;
}

function renderQuestion(s) {
  const c = s.cur, q = QUESTIONS.find(q => q.id === c.qid);
  let h = `<div class="q-meta"><span>Campaign Question</span><span>${esc(q.setting)}</span></div>
    <div class="q-text">${esc(q.text)}</div>${answersList(q.answers, c)}`;
  if (c.answered == null) h += `<button class="btn" id="submit" ${c.sel == null ? 'disabled' : ''}>Answer</button>`;
  else {
    const a = q.answers[c.answered];
    h += `<div class="feedback"><div class="fb-head">Campaign Manager's Assessment</div><p>${esc(a.fb)}</p>${chips(s, a.fx)}</div>
      ${breakingBox(c)}<button class="btn" id="next">Continue</button>`;
  }
  return h;
}

function renderEvent(s) {
  const c = s.cur, e = (c.type === 'revent' ? RUNOFF_EVENTS : EVENTS).find(e => e.id === c.eid);
  const text = typeof e.text === 'function' ? e.text(s) : e.text;
  let h = `<div class="q-meta"><span class="kind" style="background:${EVENT_KINDS[e.kind] || '#333'}">${e.kind}</span><span>${c.type === 'revent' ? `Runoff · ${fmtDate(runoffDate(s))}` : dateOf(s.step)}</span></div>
    <div class="event-title">${esc(e.title)}</div>
    <div class="q-text">${esc(text)}</div>`;
  if (e.advice?.length) h += `<div class="advice"><div class="fb-head">Your Advisors</div>${e.advice.map(([id, t]) =>
    `<div class="adv">${staffBadge(id)}<div><b>${STAFF[id].name}</b> <span class="muted small">${STAFF[id].role}</span><div>${esc(t)}</div></div></div>`).join('')}</div>`;
  h += answersList(e.choices, c, a => !!a.risk);
  if (c.answered == null) h += `<button class="btn" id="submit" ${c.sel == null ? 'disabled' : ''}>Decide</button>`;
  else {
    h += `<div class="feedback ${c.outcome === 'lose' ? 'fail' : c.outcome === 'win' ? 'success' : ''}"><div class="fb-head">${c.outcome === 'win' ? 'The Gamble Paid Off' : c.outcome === 'lose' ? 'The Gamble Failed' : 'Result'}</div><p>${esc(c.fb)}</p>${chips(s, c.fx)}</div>`;
    if (c.straw) h += `<div class="panel-title">Straw Poll Result · 2,400 delegates</div>` + c.straw.map(([id, v]) => `<div class="poll-row">${portrait(s, id, 24)}
      <div class="poll-main"><div class="poll-name">${nameLink(s, id)}</div><div class="pbar"><div style="width:${v}%;background:${colorOf(id)}"></div></div></div><div class="poll-num">${v.toFixed(1)}%</div></div>`).join('')
      + `<p class="muted small">${displayName(s, c.straw[0][0])} wins the straw poll and gains momentum. Delegates are more online and more religious than primary voters, so the result is not a forecast.</p>`;
    h += `${breakingBox(c)}<button class="btn" id="${c.type === 'revent' ? 'rnext' : 'next'}">Continue</button>`;
  }
  return h;
}

function renderDebate(s) {
  const c = s.cur;
  const venue = c.which === 1 ? 'Harlan County Fairgrounds' : 'Fort Eisenhower Civic Center';
  const stage = active(s).map(id => `<div class="podium">${portrait(s, id, 40)}<div>${shortName(s, id)}</div><div class="pscore">${c.idx >= 0 && c.idx < 99 && c.scores[id] != null ? c.scores[id].toFixed(1) : ''}</div></div>`).join('');
  if (c.idx === -1) {
    return `<div class="q-meta"><span>Republican Primary Debate #${c.which}</span><span>${venue}</span></div>
      <div class="stage">${stage}</div>
      <div class="q-text">${TEXT.debateIntro[c.which]}</div>
      <p class="muted small">How debates are scored: each answer is graded by how strongly it moves primary voters, minus the damage it does. Attacks on rivals add to the attacker's score and take from the target's. Moderate answers lose points. The snap poll after the debate is based on the total scores, shown under each podium.</p>
      <button class="btn" id="dnext">Take the Stage</button>`;
  }
  if (c.idx === 99) {
    const ids = c.snap.map(e => e[0]);
    return `<div class="q-meta"><span>Debate #${c.which}: Results</span><span>${venue}</span></div>
      <div class="q-text">Snap poll of debate watchers: <b>"Who won tonight's debate?"</b></div>
      ${c.snap.map(([id, v]) => `<div class="poll-row">${portrait(s, id, 26)}<div class="poll-main"><div class="poll-name">${nameLink(s, id)}</div>
        <div class="pbar"><div style="width:${v}%;background:${colorOf(id)}"></div></div></div><div class="poll-num">${v.toFixed(0)}%</div></div>`).join('')}
      <div class="panel-title">Scorecard</div>
      <table class="xtab score"><thead><tr><th></th>${c.qs.map((_, i) => `<th>Q${i + 1}</th>`).join('')}<th>Total</th></tr></thead><tbody>
        ${ids.map(id => `<tr><td class="xlabel">${nameLink(s, id)}</td>${c.qs.map((_, i) => `<td class="g-${(c.grades[id][i] || '').toLowerCase()}">${c.grades[id][i] || '—'}</td>`).join('')}<td><b>${c.scores[id].toFixed(1)}</b></td></tr>`).join('')}
      </tbody></table>
      <div class="feedback"><div class="fb-head">Why ${esc(shortName(s, c.winner))} Won</div>
        <p>${displayName(s, c.winner)} had the highest total score. The moment of the night belonged to ${displayName(s, c.best.id)}: ${esc(c.best.text)}</p>
        <p class="muted small">The winner gains support in every faction. The last-place candidate loses some.</p></div>
      ${breakingBox(c)}<button class="btn" id="dnext">Leave the Stage</button>`;
  }
  const q = DEBATE_QUESTIONS.find(q => q.id === c.qs[c.idx]);
  let h = `<div class="q-meta"><span>Debate #${c.which} · Question ${c.idx + 1} of ${c.qs.length}</span><span>${venue}</span></div>
    <div class="stage small-stage">${stage}</div>
    <div class="q-text">${esc(q.text)}</div>`;
  if (c.answered == null) h += answersList(q.answers, c) + `<button class="btn" id="submit" ${c.sel == null ? 'disabled' : ''}>Answer</button>`;
  else {
    h += `<div class="round">${c.round.map(r => `<div class="round-row ${r.id === 'you' ? 'mine' : ''}">${portrait(s, r.id, 32)}
        <div class="round-main"><div><b>${displayName(s, r.id)}</b> <span class="grade g-${grade(r.perf).toLowerCase()}">${grade(r.perf)}</span>${r.attack ? ` <span class="atk">attacks ${esc(shortName(s, r.attack))}</span>` : ''}</div>
        <div class="round-text">${esc(r.text)}</div></div></div>`).join('')}</div>
      <div class="feedback"><div class="fb-head">From the Spin Room</div><p>${esc(q.answers[c.answered].fb)}</p>${chips(s, q.answers[c.answered].fx)}</div>
      <button class="btn" id="dnext">Continue</button>`;
  }
  return h;
}

function renderStop(s) {
  const c = s.cur;
  if (c.done) {
    return `<div class="q-meta"><span>Campaign Stop</span><span>${REG[c.region].name}</span></div>
      <div class="q-text">You ${TEXT.stopVerb[c.action]} ${REG[c.region].name}. ${TEXT.stop[c.action]}</div>
      <div class="feedback"><div class="fb-head">Meanwhile, on the Trail</div>${c.oppMoves.map(m => `<p class="opp-move">${esc(m)}</p>`).join('')}</div>
      ${breakingBox(c)}<button class="btn" id="next">Continue</button>`;
  }
  const r = c.region && REG[c.region];
  return `<div class="q-meta"><span>Campaign Stop</span><span>Choose a region on the map</span></div>
    <div class="q-text">Where will the campaign go this week? <b>Click a region on the map</b>, then choose an action.</div>
    ${r ? `<div class="sel-region"><b>${r.name}</b> · ${(regionWeight(r) / TOTAL_WEIGHT() * 100).toFixed(0)}% of the expected statewide vote · expected turnout ${(regionTurnout(r) * 100).toFixed(0)}%
      <div class="muted small">${esc(r.desc)}</div></div>` : ''}
    <div class="answers">${STOP_ACTIONS.map(a => `<label class="answer ${a.cost > s.money ? 'locked' : ''}"><input type="radio" name="stop" value="${a.id}" ${c.action === a.id ? 'checked' : ''} ${a.cost > s.money ? 'disabled' : ''}>
      <span><b>${a.name}.</b> ${a.desc}</span></label>`).join('')}</div>
    <button class="btn" id="go" ${c.region ? '' : 'disabled'}>Go</button>`;
}

function renderEndorse(s) {
  const who = s.cur.who;
  return `<div class="q-meta"><span>Breaking News</span><span>The President's Endorsement</span></div>
    <div class="endorse-card">${portrait(s, who, 72)}
      <div><div class="endorse-head">THE PRESIDENT ENDORSES ${displayName(s, who).toUpperCase()}</div>
      <p class="post">${esc(ENDORSE_TEXT[who] || ENDORSE_TEXT.dunmore)}</p></div></div>
    <p class="q-text">${who === 'you' ? TEXT.endorseYou : TEXT.endorseOther}</p>
    ${breakingBox(s.cur)}<button class="btn" id="next">Continue</button>`;
}

function renderRunoffIntro(s) {
  const R = s.runoff, e = s.election;
  return `<div class="q-meta"><span class="kind" style="background:var(--red)">Runoff</span><span>August 5, 2030</span></div>
    <div class="event-title">You vs. ${esc(displayName(s, R.rival))}</div>
    <div class="endorse-card">${portrait(s, 'you', 56)} <b>vs.</b> ${portrait(s, R.rival, 56)}</div>
    <div class="q-text">${esc(RUNOFF_TEXT.intro(s))}</div>
    <div class="panel-title">The Eliminated Candidates</div>
    ${R.eliminated.map(id => `<div class="poll-row">${portrait(s, id, 26)}<div class="poll-main"><div class="poll-name">${nameLink(s, id)} <span class="muted small">— strongest with ${topFactions(id).map(f => FACTIONS[f].name).join(' and ')}</span></div>
      <div class="pbar"><div style="width:${e.total[id]}%;background:${colorOf(id)}"></div></div></div><div class="poll-num">${e.total[id].toFixed(1)}%<span class="muted">${e.totalVotes[id].toLocaleString()} votes</span></div></div>`).join('')}
    <p class="muted small">You will meet each of them. An endorsement moves part of their supporters: the endorser's two strongest factions and, to a smaller degree, every faction. Runoff turnout will be about ${Math.round(RUNOFF_TURNOUT * 100)}% of the primary.</p>
    <button class="btn" id="rnext">Begin the Runoff Campaign</button>`;
}

function renderCourt(s) {
  const c = s.cur, C = COURT[c.who], e = s.election;
  let h = `<div class="q-meta"><span class="kind" style="background:${colorOf(c.who)}">Endorsement</span><span>Runoff · ${fmtDate(runoffDate(s))}</span></div>
    <div class="event-title">${esc(C.title)}</div>
    <div class="endorse-card">${portrait(s, c.who, 56)}<div><b>${nameLink(s, c.who)}</b><div class="muted small">${e.total[c.who].toFixed(1)}% in the primary (${e.totalVotes[c.who].toLocaleString()} votes) · strongest with ${topFactions(c.who).map(f => FACTIONS[f].name).join(' and ')}</div></div></div>
    <div class="q-text">${esc(C.text)}</div>`;
  h += `<div class="answers">${C.choices.map((a, i) => `<label class="answer ${c.answered != null ? 'locked' : ''} ${c.answered === i ? 'chosen' : ''}">
      <input type="radio" name="ans" value="${i}" ${c.sel === i ? 'checked' : ''} ${c.answered != null ? 'disabled' : ''}>
      <span>${esc(a.text)} <span class="risk-tag" style="background:#1f6b3a">${Math.round((typeof a.p === 'function' ? a.p(s) : a.p) * 100)}% chance of endorsement</span></span></label>`).join('')}</div>`;
  if (c.answered == null) h += `<button class="btn" id="court-submit" ${c.sel == null ? 'disabled' : ''}>Make the Offer</button>`;
  else {
    const ch = C.choices[c.answered];
    h += `<div class="feedback ${c.result === 'you' ? 'success' : c.result === 'rival' ? 'fail' : ''}"><div class="fb-head">${CAND[c.who].short}: ${RUNOFF_TEXT.endorsed[c.result]}</div><p>${esc(ch.fb)}</p>${chips(s, ch.fx)}</div>
      <button class="btn" id="rnext">Continue</button>`;
  }
  return h;
}

function renderCampaign(s) {
  const c = s.cur;
  const body = { q: renderQuestion, event: renderEvent, revent: renderEvent, rintro: renderRunoffIntro, court: renderCourt, debate: renderDebate, stop: renderStop, endorse: renderEndorse }[c.type](s);
  return `${statusBar(s)}
    <div class="cols">
      <div class="left-col"><div class="panel q-panel">${body}</div>${wirePanel(s)}</div>
      <div class="right-col">
        <div class="panel">${mapSVG(s, { clickable: c.type === 'stop' && !c.done, selected: c.region })}
          <div class="legend">${active(s).map(id => `<span data-cand="${id}" class="cand-link"><i style="background:${colorOf(id)}"></i>${shortName(s, id)}</span>`).join('')}
          <span class="muted small">Click a region or a candidate for details.</span></div></div>
        <div class="panel">${pollPanel(s)}</div>
        <div class="panel">${endorsementPanel(s)}</div>
      </div>
    </div>`;
}

const currentResult = s => s.electionPhase === 'runoff' ? s.runoffResult : s.election;
function resultRows(s, total, votes) {
  return sorted(total).map(([id, v]) => `<div class="poll-row">${portrait(s, id, 26)}
    <div class="poll-main"><div class="poll-name">${displayName(s, id)}</div><div class="pbar"><div style="width:${v}%;background:${colorOf(id)}"></div></div></div>
    <div class="poll-num">${v.toFixed(1)}%<span class="muted">${votes[id].toLocaleString()} votes</span></div></div>`).join('');
}
function renderElection(s) {
  const isRunoff = s.electionPhase === 'runoff', e = currentResult(s), rev = e.order.slice(0, e.revealed);
  const run = Object.fromEntries(Object.keys(e.totalVotes).map(c => [c, rev.reduce((a, r) => a + e.votes[r][c], 0)]));
  const counted = sumVals(run), done = e.revealed >= e.order.length;
  const sh = counted ? toShares(run) : Object.fromEntries(Object.keys(run).map(c => [c, 0]));
  const expected = isRunoff ? s.election.cast * RUNOFF_TURNOUT : TOTAL_WEIGHT();
  let verdict = '';
  if (done) {
    const top = sorted(e.total)[0], need = !isRunoff && e.needsRunoff;
    if (isRunoff) verdict = `<div class="breaking"><b>DECISION DESK:</b> ${displayName(s, top[0])} wins the runoff and the Republican nomination with ${top[1].toFixed(1)}%.</div>
        <button class="btn" id="to-after">${s.finalWinner === 'you' ? 'Continue' : 'Your Response'}</button>`;
    else if (!need) verdict = `<div class="breaking"><b>DECISION DESK:</b> ${displayName(s, top[0])} wins the Republican nomination outright with ${top[1].toFixed(1)}%.</div>
        <button class="btn" id="to-after">${s.finalWinner === 'you' ? 'Continue' : 'Your Response'}</button>`;
    else if (need.includes('you')) verdict = `<div class="breaking"><b>RUNOFF:</b> No candidate reaches ${RUNOFF_LINE}%. You and ${displayName(s, need.find(c => c !== 'you'))} advance to a runoff on August 25.</div>
        <button class="btn" id="begin-runoff">Begin the Runoff</button>`;
    else verdict = `<div class="breaking"><b>ELIMINATED:</b> You finish outside the top two. ${displayName(s, need[0])} and ${displayName(s, need[1])} advance to the runoff.</div>
        <div class="panel-title">Runoff Result · August 25</div>${resultRows(s, s.runoffResult.total, s.runoffResult.totalVotes)}
        <p class="muted small">Runoff turnout: ${s.runoffResult.cast.toLocaleString()} votes.</p>
        <button class="btn" id="to-after">Your Response</button>`;
  }
  return `<div class="status"><div><span class="lbl">${isRunoff ? 'Runoff Night' : 'Primary Night'}</span>${isRunoff ? 'August 25, 2030' : 'August 4, 2030'}</div>
      <div><span class="lbl">Reporting</span>${(counted / e.cast * 100).toFixed(0)}% of votes counted</div><div><span class="lbl">Votes Counted</span>${counted.toLocaleString()}</div>
      <div><span class="lbl">${done ? 'Final Turnout' : 'Expected Turnout'}</span>${((done ? e.cast : expected) / REGISTERED_R * 100).toFixed(1)}% of registered Republicans</div></div>
    <div class="cols">
      <div class="left-col"><div class="panel q-panel"><div class="q-meta"><span>${isRunoff ? 'Runoff' : 'Election'} Night Coverage</span><span>KCIM-TV Channel 4</span></div>
        <div class="q-text">${done ? 'All regions have reported.' : rev.length ? `${REG[rev[rev.length - 1]].name} has just reported.` : `Polls have closed across ${STATE_NAME}.`}</div>
        ${resultRows(s, done ? e.total : sh, run)}${verdict}</div></div>
      <div class="right-col"><div class="panel">${mapSVG(s, { results: e.results, revealed: rev })}</div></div>
    </div>`;
}

function renderConcede(s) {
  const w = s.finalWinner;
  return `<div class="panel choose-panel"><div class="panel-title big">Primary Night: Your Decision</div>
    <div class="endorse-card">${portrait(s, w, 60)}<div><b>${displayName(s, w)}</b> has won the Republican nomination.</div></div>
    <p class="q-text">Your campaign manager hands you two drafts and a phone. The winner's campaign is waiting for your call. Your supporters are waiting in the ballroom.</p>
    <div class="answers">${CONCESSION.map(o => `<label class="answer"><input type="radio" name="concede" value="${o.id}" ${s.concession === o.id ? 'checked' : ''}><span>${esc(o.text)}</span></label>`).join('')}</div>
    <button class="btn" id="confirm-concede" ${s.concession ? '' : 'disabled'}>Go to the Ballroom</button></div>`;
}

// ---------- endings ----------
function yourSpeech(s) {
  const top = FKEYS.map(f => [f, s.delta.you[f] || 0]).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
  return [SPEECH.open, SPEECH.record[s.record], ...top.map(f => SPEECH.faction[f]), s.rino >= 6 ? SPEECH.closeUnity : SPEECH.closeFight];
}
function hundredDays(items) {
  return `<ol class="timeline">${items.map(([d, t]) => `<li><span class="tl-date">${d}</span><span>${esc(t)}</span></li>`).join('')}</ol>`;
}
function consequences(s) {
  const L = EPILOGUE.filter(e => s.flags[e.flag]).map(e => e.text);
  L.push(s.rino >= 10 ? EPILOGUE_RINO_HIGH : s.rino < 2 ? EPILOGUE_RINO_LOW : '');
  return L.filter(Boolean);
}
function generalLine(s, w, margin) {
  const rPct = 50 + margin / 2 - .7, dPct = 100 - rPct - 1.4;
  return `<p class="q-text">On November 5, ${displayName(s, w)} faces the Democratic nominee, ${DEMOCRAT.name}, ${DEMOCRAT.desc}.</p>
    <div class="ge"><div style="width:${rPct}%;background:${colorOf(w)}">${esc(shortName(s, w))} ${rPct.toFixed(1)}%</div><div style="width:${dPct}%;background:#2c5aa0">Lindqvist ${dPct.toFixed(1)}%</div></div>
    <p class="muted small">Other candidates: 1.4%. ${margin < 15 ? 'This is the smallest margin for a Republican governor in Cimarron in twenty years, a sign that the primary cost the party support among independents.' : 'The result was never in doubt.'}</p>`;
}

function renderEnding(s) {
  const e = s.election, w = s.finalWinner, won = w === 'you', rr = s.runoffResult;
  const final = rr ? rr.total : e.total;
  let sections = '';
  if (won) {
    const margin = clamp(27 - s.rino * .6 - (s.flags.tape2 ? 3 : 0) - (s.flags.donor_deal ? 2 : 0), 6, 34);
    const start = new Date(2031, 0, 12);
    const days = s.promises.slice(0, 12).map((p, i) => [new Date(start.getTime() + i * 8 * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), p]);
    if (days.length < 3) days.push(['Feb 1', 'Presented a budget that continues the policies of your first term.'], ['Mar 15', 'Signed the legislature\'s tax and public safety package.']);
    const n = s.promises.length;
    sections = `
      <div class="panel-title">Your Victory Speech</div><blockquote>${yourSpeech(s).map(p => `<p>${esc(p)}</p>`).join('')}</blockquote>
      <div class="panel-title">The General Election</div>${generalLine(s, 'you', margin)}
      <div class="panel-title">The First 100 Days of Your Second Term</div>
      <p class="muted small">Built from the promises you made during the campaign.</p>${hundredDays(days)}
      <div class="panel-title">One Year Later</div>
      <p class="q-text">${n >= 10 ? 'You campaigned on an aggressive agenda, and you kept most of it. Several of your laws are in federal court. Your approval among Republicans is above 80%. Among all voters it is below 50%, the lowest of your career. National conservative media treat Cimarron as a model.'
        : n >= 5 ? 'Your second term follows the promises of the campaign. Some laws pass easily; others are slowed by the courts and by the cost of the income tax repeal. The base is satisfied. Your rivals are already preparing for 2034.'
        : 'You made few specific promises, and your second term looks much like your first. The base is not excited, but it is not angry. Dunmore\'s movement continues to grow outside the government.'}</p>
      ${consequences(s).length ? `<div class="panel-title">Consequences of Your Campaign</div><ul class="epilogue">${consequences(s).map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`;
  } else {
    const o = RIVAL_OUTCOMES[w], con = CONCESSION.find(c => c.id === s.concession) || CONCESSION[1];
    const obj = w === 'whitlock' ? 'her' : 'him';
    sections = `
      <div class="panel-title">Your Concession</div><blockquote><p>${esc(con.speech(displayName(s, w), obj))}</p></blockquote>
      <div class="panel-title">${esc(displayName(s, w))}'s Victory Speech</div><blockquote><p>${esc(o.speech)}</p></blockquote>
      <div class="panel-title">The General Election</div>${generalLine(s, w, clamp(o.general + con.general, 4, 34))}
      <div class="panel-title">${esc(CAND[w].short)}'s First 100 Days</div>${hundredDays(o.days)}
      <div class="panel-title">One Year Later</div><p class="q-text">${esc(o.later)}</p>
      <div class="panel-title">Your Future</div><p class="q-text">${esc(con.future)}</p>
      ${consequences(s).length ? `<div class="panel-title">The Legacy of Your Campaign</div><ul class="epilogue">${consequences(s).map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`;
  }
  return `<div class="panel ending">
    <div class="ending-head" style="background:${colorOf(w)}">${won ? 'YOU WIN THE NOMINATION' : 'DEFEATED IN THE PRIMARY'}</div>
    <div class="ending-body">
      <div class="endorse-card">${portrait(s, w, 72)}<div><b>${displayName(s, w)}</b>${rr ? ' (after a runoff)' : ''}
        <div class="muted">${sorted(final).map(([id, v]) => `${esc(shortName(s, id))} ${v.toFixed(1)}%`).join(' · ')}</div></div></div>
      <div class="muted small">Seed ${s.seed} · Scenario: ${esc(scenarioOf(s).name)}${s.war ? ' · The war with Iran' : ''}</div>
      ${sections}
      ${rr ? `<div class="panel-title">The Runoff</div>${resultRows(s, rr.total, rr.totalVotes)}
        ${s.runoff.live ? `<ul class="epilogue">${Object.entries(s.runoff.endorse).map(([id, t]) => `<li>${esc(CAND[id].name)}: ${t === 'none' ? 'stayed neutral' : `endorsed ${esc(displayName(s, t))}`}.</li>`).join('')}</ul>` : ''}` : ''}
      <div class="cols end-cols">
        <div><div class="panel-title">Primary Results by Region</div>${mapSVG(s, { results: e.results, revealed: e.order })}
          ${crosstab(s, REGIONS.map(r => r.id), rid => e.results[rid], rid => REG[rid].name, () => '')}</div>
        <div><div class="panel-title">Your Campaign, Step by Step</div><ol class="review">${s.log.map(l => `<li><span class="muted">${esc(l.q)}:</span> ${esc(l.a)}</li>`).join('')}</ol></div>
      </div>
      <button class="btn" id="restart">Run Again</button>
    </div></div>`;
}

// ---------- modals ----------
function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').hidden = false; }
function closeModal() { $('#modal').hidden = true; }
const ordinal = n => n + (['st', 'nd', 'rd'][n - 1] || 'th');

function candidateModal(s, id) {
  const c = CAND[id], live = s && s.screen !== 'record' && s.screen !== 'mate';
  const inRaceNow = live && !s.dropped.includes(id);
  const st = inRaceNow ? stateShares(s) : null;
  const rank = st ? sorted(st).findIndex(e => e[0] === id) + 1 : null;
  const facs = inRaceNow ? FKEYS.map(f => [f, factionShares(s, f)[id]]).sort((a, b) => b[1] - a[1]) : [];
  const regs = inRaceNow ? REGIONS.map(r => [r.id, regionShares(s, r.id)[id]]).sort((a, b) => b[1] - a[1]) : [];
  const orgs = s ? Object.entries(s.endorsements).filter(([, h]) => h === id).map(([o]) => ENDORSERS[o].name) : [];
  if (s && s.endorsed === id) orgs.unshift('The President');
  const news = s ? s.wire.filter(w => w.who === id).slice(0, 4) : [];
  let body;
  if (id === 'you') {
    const rec = s && RECORDS.find(r => r.id === s.record), mate = s && RUNNING_MATES.find(m => m.id === s.mate);
    body = `<p>Governor of ${STATE_NAME} since 2027. You are running for a second term.</p>
      ${rec ? `<p><b>Signature record:</b> ${esc(rec.title)}.</p>` : ''}${mate ? `<p><b>Running mate:</b> ${esc(mate.name)} (${esc(mate.title)}).</p>` : ''}
      ${s?.promises.length ? `<div class="panel-title">Promises You Have Made (${s.promises.length})</div><ul class="small-list">${s.promises.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}`;
  } else {
    body = `<p class="muted">${c.title} · Age ${c.age} · ${esc(c.home)}</p><p>${esc(c.blurb)}</p>
      <div class="panel-title">Key Positions</div><ul class="small-list">${c.positions.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  }
  let stats = '';
  if (live) {
    stats = s.dropped.includes(id) ? '<p class="breaking">Withdrawn from the race.</p>' : `<div class="modal-stats">
      <div><span class="lbl">Statewide</span><b>${st[id].toFixed(1)}%</b> <span class="muted">(${ordinal(rank)})</span></div>
      <div><span class="lbl">Strongest factions</span>${facs.slice(0, 3).map(([f, v]) => `${FACTIONS[f].name} ${v.toFixed(0)}%`).join(' · ')}</div>
      <div><span class="lbl">Weakest faction</span>${FACTIONS[facs[facs.length - 1][0]].name} ${facs[facs.length - 1][1].toFixed(0)}%</div>
      <div><span class="lbl">Best regions</span>${regs.slice(0, 3).map(([r, v]) => `${REG[r].name} ${v.toFixed(0)}%`).join(' · ')}</div>
    </div>`;
    stats += `<div class="panel-title">Endorsements</div><p>${orgs.length ? orgs.map(esc).join(', ') : '<span class="muted">None yet.</span>'}</p>
      ${news.length ? `<div class="panel-title">Recent News</div><ul class="small-list">${news.map(n => `<li>${esc(n.text)}</li>`).join('')}</ul>` : ''}`;
  }
  return `<div class="modal-head">${portrait(s, id, 64)}<div><div class="modal-title">${id === 'you' ? (s ? displayName(s, 'you') : 'You') : c.name}</div>
    <span class="faction-tag" style="background:${c.color}">${c.title}</span></div></div>${body}${stats}`;
}

function regionModal(s, rid) {
  const r = REG[rid], d = r.demo, live = s && ['campaign', 'runoff', 'election', 'ending', 'concede'].includes(s.screen);
  const sh = live ? (['election', 'ending', 'concede'].includes(s.screen) ? currentResult(s).results[rid] : regionShares(s, rid)) : null;
  const facRows = Object.entries(r.mix).sort((a, b) => b[1] - a[1]).map(([f, m]) =>
    `<tr><td>${FACTIONS[f].name}</td><td>${(m * 100).toFixed(0)}%</td><td>${(turnoutOf(f) * r.turnoutMod * 100).toFixed(0)}%</td><td>${Math.round(factionVotes(r, f)).toLocaleString()}</td></tr>`).join('');
  return `<div class="modal-title">${r.name}</div><p class="muted">County seat: ${r.seat} · ${esc(r.economy)}</p><p>${esc(r.desc)}</p>
    <div class="modal-stats">
      <div><span class="lbl">Population</span>${d.pop}</div><div><span class="lbl">Median age</span>${d.age}</div>
      <div><span class="lbl">Rural</span>${d.rural}%</div><div><span class="lbl">Evangelical</span>${d.evangelical}%</div>
      <div><span class="lbl">Hispanic</span>${d.hispanic}%</div><div><span class="lbl">College degree</span>${d.college}%</div>
      <div><span class="lbl">Median household income</span>${d.income}</div>
      <div><span class="lbl">Registered Republicans</span>${Math.round(REGISTERED_R * r.voters / 100).toLocaleString()} (${r.voters}% of the state's)</div>
      <div><span class="lbl">Expected primary turnout</span>${(regionTurnout(r) * 100).toFixed(0)}% · ${Math.round(regionWeight(r)).toLocaleString()} votes</div>
      <div><span class="lbl">Share of expected statewide vote</span>${(regionWeight(r) / TOTAL_WEIGHT() * 100).toFixed(1)}%</div>
    </div>
    <div class="panel-title">Republican Primary Electorate</div>
    <table class="xtab"><thead><tr><th>Faction</th><th>Share of registered</th><th>Turnout here</th><th>Expected votes</th></tr></thead><tbody>${facRows}</tbody></table>
    ${sh ? `<div class="panel-title">${['campaign', 'runoff'].includes(s.screen) ? 'Current Polling' : 'Result'} in ${r.name}</div>${pollRows(s, sh)}
      <p class="muted small">Your campaign here: ${(s.bonus.you[rid] || 0).toFixed(0)} points from visits and ads${s.gotv[rid] ? `, +${Math.round(s.gotv[rid] * 100)}% turnout operation` : ''}.</p>` : ''}`;
}

const fmtK = n => n >= 1e6 ? `${(n / 1e6).toFixed(2)} million` : `${Math.round(n / 1000).toLocaleString()},000`;
function stateModal() {
  const P = STATE_PROFILE, regTotal = P.registeredR + P.registeredD + P.unaffiliated;
  const oldFaith = registered.seniors + registered.faith, oldFaithVote = expectedVote().seniors + expectedVote().faith;
  const bigTwo = (regionWeight(REG.fort) + regionWeight(REG.osgood)) / TOTAL_WEIGHT() * 100;
  const notes = [
    `Older conservatives and evangelicals are ${oldFaith.toFixed(0)}% of registered Republicans, but ${oldFaithVote.toFixed(0)}% of expected primary voters, because they turn out at ${Math.round(turnoutOf('seniors') * 100)}% and ${Math.round(turnoutOf('faith') * 100)}%.`,
    `The New Right is ${registered.online.toFixed(0)}% of registered Republicans, but only ${Math.round(turnoutOf('online') * 100)}% of them usually vote in a primary, so they are ${expectedVote().online.toFixed(0)}% of the expected vote.`,
    `Fort Eisenhower and the Osgood Exurbs together cast ${bigTwo.toFixed(0)}% of the expected primary vote.`,
    `Rural regions vote at higher rates. Expected turnout ranges from ${Math.round(Math.min(...REGIONS.map(regionTurnout)) * 100)}% (${REGIONS.slice().sort((x, y) => regionTurnout(x) - regionTurnout(y))[0].name}) to ${Math.round(Math.max(...REGIONS.map(regionTurnout)) * 100)}% (${REGIONS.slice().sort((x, y) => regionTurnout(y) - regionTurnout(x))[0].name}).`,
  ];
  return `<div class="modal-title">State of ${STATE_NAME}</div>
    <div class="modal-stats">
      <div><span class="lbl">Population</span>${fmtK(P.pop)} (${fmtK(P.adults)} adults)</div>
      <div><span class="lbl">Registered voters</span>${fmtK(regTotal)} (${Math.round(regTotal / P.adults * 100)}% of adults)</div>
      <div><span class="lbl">Registered Republicans</span>${P.registeredR.toLocaleString()} (${Math.round(P.registeredR / regTotal * 100)}%)</div>
      <div><span class="lbl">Registered Democrats</span>${P.registeredD.toLocaleString()} (${Math.round(P.registeredD / regTotal * 100)}%)</div>
      <div><span class="lbl">Unaffiliated</span>${P.unaffiliated.toLocaleString()} (${Math.round(P.unaffiliated / regTotal * 100)}%)</div>
      <div><span class="lbl">Expected primary turnout</span>${Math.round(TOTAL_WEIGHT()).toLocaleString()} votes (${(TOTAL_WEIGHT() / REGISTERED_R * 100).toFixed(1)}% of registered Republicans)</div>
    </div>
    <p><b>Rules:</b> ${P.primary}</p><p><b>Recent results:</b> ${P.lastResults}</p>
    <div class="panel-title">Why Turnout Matters</div><ul class="small-list">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
    <div class="panel-title">The Factions</div>
    <table class="xtab"><thead><tr><th>Faction</th><th>Registered</th><th>Turnout</th><th>Expected votes</th><th>Share of votes</th></tr></thead><tbody>
      ${FKEYS.map(f => `<tr><td>${FACTIONS[f].name}<div class="muted small">${esc(FACTIONS[f].blurb)}</div></td><td>${registered[f].toFixed(0)}%</td><td>${(turnoutOf(f) * 100).toFixed(0)}%*</td><td>${Math.round(expectedVote()[f] / 100 * TOTAL_WEIGHT()).toLocaleString()}</td><td><b>${expectedVote()[f].toFixed(1)}%</b></td></tr>`).join('')}
    </tbody></table>
    <p class="muted small">* Statewide base rate. Each region adjusts it up or down.</p>
    <div class="panel-title">The Regions</div>
    <table class="xtab"><thead><tr><th>Region</th><th>Population</th><th>Registered R</th><th>Turnout</th><th>Expected votes</th><th>Share of votes</th></tr></thead><tbody>
      ${REGIONS.map(r => `<tr><td><span class="region-link" data-region="${r.id}">${r.name}</span></td><td>${r.demo.pop}</td><td>${Math.round(REGISTERED_R * r.voters / 100).toLocaleString()}</td><td>${(regionTurnout(r) * 100).toFixed(0)}%</td><td>${Math.round(regionWeight(r)).toLocaleString()}</td><td><b>${(regionWeight(r) / TOTAL_WEIGHT() * 100).toFixed(1)}%</b></td></tr>`).join('')}
    </tbody></table>
    <p class="muted small">Get-Out-the-Vote operations at campaign stops raise turnout among your supporters in a region.</p>`;
}

// ---------- setup screens ----------
function renderTitle() {
  const hasSave = !!load();
  return `<div class="panel title-panel">
    <div class="field-row">${CANDIDATES.filter(c => c.id !== 'you' && !c.outsider).map(c => `<div class="field-mini">${portrait(null, c.id, 54)}<div>${c.short}</div></div>`).join('')}</div>
    ${TEXT.title.map(p => `<p class="q-text">${p}</p>`).join('')}
    <label class="name-row">Your name: <input id="name" maxlength="28" placeholder="Dale Whitcomb"></label>
    <label class="name-row">Seed (optional): <input id="seed" inputmode="numeric" maxlength="9" placeholder="random"> <span class="muted small">The same seed gives the same scenario and the same random events.</span></label>
    <div class="btn-row"><button class="btn" id="start">Begin Campaign</button>${hasSave ? '<button class="btn alt" id="resume">Continue Campaign</button>' : ''}<button class="btn alt" id="open-profile">State Profile</button></div>
  </div>`;
}
function renderChoice(title, intro, list, key) {
  const sel = S[key];
  return `<div class="panel choose-panel"><div class="panel-title big">${title}</div><p class="q-text">${intro}</p>
    <div class="answers">${list.map(o => `<label class="answer choice-card"><input type="radio" name="${key}" value="${o.id}" ${sel === o.id ? 'checked' : ''}>
      <span><b>${o.name || o.title}</b>${o.name ? ` <span class="muted">— ${o.title}</span>` : ''}<br><span class="muted">${esc(o.desc)}</span><br>${chips(S, o.fx)}</span></label>`).join('')}</div>
    <button class="btn" id="confirm-${key}" ${sel ? '' : 'disabled'}>Continue</button></div>`;
}
function renderField(s) {
  return `<div class="panel choose-panel"><div class="panel-title big">The Field</div>
    <div class="scenario-card"><span class="lbl">Scenario · Seed ${s.seed}</span><b>${esc(scenarioOf(s).name)}</b><div>${esc(scenarioOf(s).desc)}</div></div>
    <p class="q-text">${TEXT.fieldIntro} ${s.field.length - 1} challengers are on the ballot.</p>
    ${s.field.filter(id => id !== 'you').map(id => CAND[id]).map(c => `<div class="opp-card">${portrait(s, c.id, 60)}<div><b class="cand-link" data-cand="${c.id}">${c.name}</b> <span class="faction-tag" style="background:${c.color}">${c.title}</span><p>${esc(c.blurb)}</p>
      <p class="muted small">Endorsements: ${Object.entries(s.endorsements).filter(([, h]) => h === c.id).map(([o]) => ENDORSERS[o].name).join(', ') || 'none yet'}</p></div></div>`).join('')}
    <button class="btn" id="launch">Launch the Campaign</button></div>`;
}

// ---------- main render ----------
function render() {
  const app = $('#app'), s = S;
  if (!s) { app.innerHTML = renderTitle(); $('#ticket').innerHTML = ''; return; }
  const screens = {
    record: () => renderChoice('Your First Term', TEXT.recordIntro, RECORDS, 'record'),
    mate: () => renderChoice('Choose a Running Mate', TEXT.mateIntro, RUNNING_MATES, 'mate'),
    field: () => renderField(s), campaign: () => renderCampaign(s), runoff: () => renderCampaign(s), election: () => renderElection(s),
    concede: () => renderConcede(s), ending: () => renderEnding(s),
  };
  app.innerHTML = screens[s.screen]();
  $('#ticket').innerHTML = ['campaign', 'runoff', 'election'].includes(s.screen)
    ? `${portrait(s, 'you', 30)} <span>Gov. ${esc(s.name)}${s.mate ? ` / ${RUNNING_MATES.find(m => m.id === s.mate).name}` : ''}</span>` : '';
}

function tickElection() {
  clearInterval(electionTimer);
  electionTimer = setInterval(() => {
    if (!S || S.screen !== 'election') return clearInterval(electionTimer);
    const e = currentResult(S);
    if (e.revealed >= e.order.length) { clearInterval(electionTimer); return; }
    e.revealed++; save(); render();
  }, 900);
}

// ---------- input ----------
document.addEventListener('change', e => {
  const t = e.target;
  if (!S) return;
  if (t.name === 'ans') { S.cur.sel = +t.value; render(); }
  if (t.name === 'stop') { S.cur.action = t.value; render(); }
  if (t.name === 'concede') { S.concession = t.value; render(); }
  if (t.name === 'record' || t.name === 'mate') { S[t.name] = t.value; render(); }
});
document.addEventListener('click', e => {
  if (e.target.id === 'modal' || e.target.closest('.modal-x')) return closeModal();
  const tab = e.target.closest('[data-tab]');
  if (tab) { UI.tab = tab.dataset.tab; render(); return; }
  const reg = e.target.closest('.region, .region-link');
  if (reg) {
    if (reg.classList.contains('selecting') && S?.cur?.type === 'stop') { S.cur.region = reg.dataset.region; render(); }
    else openModal(regionModal(S, reg.dataset.region));
    return;
  }
  const cand = e.target.closest('[data-cand]');
  if (cand && !e.target.closest('label')) { openModal(candidateModal(S, cand.dataset.cand)); return; }
  const b = e.target.closest('button');
  if (!b) return;
  switch (b.id) {
    case 'open-profile': openModal(stateModal()); break;
    case 'start': newState($('#name').value.trim() || 'Dale Whitcomb', parseInt($('#seed').value, 10)); save(); render(); break;
    case 'resume': S = load(); render(); if (S.screen === 'election') tickElection(); break;
    case 'confirm-record': applyFx(S, RECORDS.find(r => r.id === S.record).fx); S.screen = 'mate'; save(); render(); break;
    case 'confirm-mate': applyFx(S, RUNNING_MATES.find(m => m.id === S.mate).fx); S.screen = 'field'; save(); render(); break;
    case 'launch': S.screen = 'campaign'; startStep(); break;
    case 'submit': answer(); break;
    case 'next': advance(); break;
    case 'dnext': debateNext(); break;
    case 'go': doStop(); break;
    case 'to-after': S.screen = S.finalWinner === 'you' ? 'ending' : 'concede'; save(); render(); break;
    case 'begin-runoff': startRunoff(); break;
    case 'rnext': runoffAdvance(); break;
    case 'court-submit': courtAnswer(); break;
    case 'confirm-concede': S.screen = 'ending'; save(); render(); break;
    case 'restart': wipe(); S = null; clearInterval(electionTimer); render(); break;
  }
  if (S?.screen === 'election' && currentResult(S).revealed === 0) tickElection();
  if (['next', 'dnext', 'go', 'to-after', 'confirm-concede', 'launch', 'begin-runoff', 'rnext'].includes(b.id)) window.scrollTo({ top: 0 });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

render();
