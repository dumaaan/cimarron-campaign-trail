// ============================================================
// STATE — a new game, scenarios, and how a decision changes the game (applyFx).
// ============================================================

// ---------- state ----------
const URLQ = new URLSearchParams(location.search);   // testing: ?scenario=celebrity&war=1
function pickScenario() {
  const forced = SCENARIOS.find(x => x.id === URLQ.get('scenario'));
  if (forced) return forced;
  let r = rand() * SCENARIOS.reduce((a, x) => a + x.weight, 0);
  return SCENARIOS.find(x => (r -= x.weight) < 0) || SCENARIOS[0];
}
function newState(name, seed, difficulty = 'normal') {
  seed = (seed >>> 0) || Math.floor(Math.random() * 900000) + 100000;
  if (!DIFFICULTY[difficulty]) difficulty = 'normal';
  S = {
    name, seed, rng: seed, difficulty, screen: 'record', record: null, mate: null,
    step: 0, rino: 0, pres: CAND.you.pres, money: DIFFICULTY[difficulty].money,
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
  applyDifficulty(S);
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
  for (const f of [].concat(fx.flag || [])) s.flags[f] = s.step + 1;   // flag: 'name' or ['name', 'other']
  if (fx.mate) swapMate(s, fx.mate);
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

// Replace the running mate: remove what the old one added, then add half of what the new one brings (it is late).
function swapMate(s, id) {
  const old = RUNNING_MATES.find(m => m.id === s.mate), nu = RUNNING_MATES.find(m => m.id === id);
  if (!old || !nu || old.id === id) return;
  for (const f of FKEYS) if (old.fx[f]) s.delta.you[f] = (s.delta.you[f] || 0) - (old.fx[f] > 0 ? old.fx[f] * TUNE.posMult : old.fx[f]);
  if (old.fx.rino) s.rino = Math.max(0, s.rino - old.fx.rino);
  s.formerMate = old.id;
  s.mate = id;
  s.flags.mate_swap = s.step + 1;
  const half = {};
  for (const k of [...FKEYS, 'rino']) if (nu.fx[k]) half[k] = nu.fx[k] / 2;
  applyFx(s, half);
}
