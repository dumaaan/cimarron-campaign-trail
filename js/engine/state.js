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
// A new game for one of the PLAYABLE candidates. The seed decides the scenario, the war and every random event.
// Whitlock: the easier the difficulty, the more likely the war and The Reckoning, the conditions that favor her.
function newState(player, seed, difficulty = 'normal') {
  seed = (seed >>> 0) || Math.floor(Math.random() * 900000) + 100000;
  if (!DIFFICULTY[difficulty]) difficulty = 'normal';
  if (!PLAYABLE.includes(player)) player = 'castellano';
  S = {
    player, seed, rng: seed, difficulty, screen: 'record', record: null, mate: null,
    step: 0, rino: 0, label: 0, pres: CAND[player].pres, money: DIFFICULTY[difficulty].money,
    delta: Object.fromEntries(CAND_IDS.map(id => [id, {}])),
    bonus: Object.fromEntries(CAND_IDS.map(id => [id, {}])),
    gotv: {},
    endorsements: Object.fromEntries(Object.entries(ENDORSERS).map(([k, v]) => [k, v.holder])),
    flags: {}, asked: [], dAsked: [], seenEvents: [], usedNews: [], wire: [], log: [], promises: [],
    dropped: [], endorsed: null, cur: null, lastPoll: null, election: null, concession: null,
    runoff: null, runoffResult: null, electionPhase: 'primary', finalWinner: null, war: null,
  };
  applyPlayer(S);
  const W = difficultyOf(S).whitlock;
  const warRoll = rand(), warStep = WAR.earliest + Math.floor(rand() * (WAR.latest - WAR.earliest + 1));
  let sc = pickScenario();
  const favorRoll = rand();
  if (player === 'whitlock' && !URLQ.get('scenario') && favorRoll < W.favor) sc = SCENARIOS.find(x => x.id === 'reckoning');
  S.warPlanned = URLQ.get('war') === '1' || warRoll < (player === 'whitlock' ? W.war : WAR.chance) ? warStep : null;
  applyScenario(S, sc);
  applyDifficulty(S);
  addAll(S, 'you', PLAYER_INFO[player].start || 0);
  for (const org of PLAYER_INFO[player].endorsements || []) S.endorsements[org] = 'you';
  return S;
}
// Copy the chosen candidate into the player slot. Called for a new game and when a saved game loads.
function applyPlayer(s) {
  for (const k of Object.keys(CAND.you)) delete CAND.you[k];
  Object.assign(CAND.you, CAND[s.player], { id: 'you' });
}
const isGov = s => s.player === 'castellano';
const staffOf = id => (STAFF_TEAMS[S?.player] || STAFF_TEAMS.castellano)[id];
// The first of the player's other running mates, for "replace your running mate" choices.
const altMate = s => (MATES[s.player] || MATES.castellano).find(m => m.id !== s.mate && m.id !== s.formerMate) || MATES[s.player].find(m => m.id !== s.mate);
// Shared content often names a rival as a third person ("Dunmore will call it amnesty"). When you play that
// candidate, the name becomes "your rival". Candidate-specific content is written for you and is not changed.
const RIVAL_NAMES = {
  castellano: ['Governor Victor Castellano', 'Governor Castellano', 'Victor Castellano', 'Castellano'],
  dunmore: ['Lt. Governor Dunmore', 'Travis Dunmore', 'Dunmore'],
  rick: ['Pastor Rick Dollins', 'Pastor Rick', 'Rick Dollins'],
  krantz: ['Sheriff Bo Krantz', 'Sheriff Krantz', 'Bo Krantz', 'Krantz'],
  vaskel: ['Brent Vaskel', 'Vaskel'],
  whitlock: ['Former Senator Whitlock', 'Senator Whitlock', 'Carol Whitlock', 'Whitlock'],
};
function rivalize(s, t) {
  if (!t || !s?.player || typeof t !== 'string') return t;
  for (const name of RIVAL_NAMES[s.player] || []) {
    t = t.replace(new RegExp(`\\b${name.replace('.', '\\.')}('s)?\\b`, 'g'), (m, poss, at, all) => {
      const start = at === 0 || /[.!?"]\s+$/.test(all.slice(0, at));
      return (start ? 'Your rival' : 'your rival') + (poss ? '\'s' : '');
    });
  }
  return t;
}
// Shared content: everything except your own campaign's events, your running mate's story and your own questions.
const isShared = x => !(x.kind === 'Running Mate' || x.kind === 'Record' || CAMPAIGN_KINDS[x.kind] || x.weight === OWN || /^q_/.test(x.id));
// Choices and feedback may be written as functions of the game state.
const textOf = (s, t) => typeof t === 'function' ? t(s) : t;
// Resolve 'alt' running mates before a decision is applied, so the chips and the result name the same person.
function resolveFx(s, fx) {
  if (!fx || fx.mate !== 'alt') return fx;
  return { ...fx, mate: altMate(s).id };
}
// Set up the field and starting conditions of a scenario. Used by newState and by the simulator.
function applyScenario(s, sc) {
  const pid = id => id === s.player ? 'you' : id;   // the chosen candidate becomes the player slot
  s.scenario = sc.id;
  s.field = sc.field.map(pid);
  s.presOverride = {};
  for (const id in sc.presOverride || {}) if (pid(id) === 'you') s.pres = sc.presOverride[id]; else s.presOverride[id] = sc.presOverride[id];
  for (const id in sc.oppAll || {}) addAll(s, pid(id), sc.oppAll[id]);
  for (const id in sc.oppFx || {}) addDelta(s, pid(id), sc.oppFx[id]);
  if (sc.youAll) addAll(s, 'you', sc.youAll);
  if (sc.flag) s.flags[sc.flag] = 1;
  if (sc.warAt != null) s.warPlanned = sc.warAt;
  for (const org in s.endorsements) if (s.endorsements[org]) s.endorsements[org] = pid(s.endorsements[org]);
  // Endorsements held by candidates who are not in this field become open.
  for (const org in s.endorsements) if (s.endorsements[org] && !s.field.includes(s.endorsements[org])) s.endorsements[org] = null;
}
const scenarioOf = s => SCENARIOS.find(x => x.id === s.scenario) || SCENARIOS[0];
const displayName = (s, id) => CAND[id === 'you' ? (s?.player || 'castellano') : id].name;
const shortName = (s, id) => CAND[id === 'you' ? (s?.player || 'castellano') : id].short;
const initials = (s, id) => CAND[id === 'you' ? (s?.player || 'castellano') : id].initials;
const headlineName = (s, id = 'you') => { const c = CAND[id === 'you' ? s.player : id]; return c.headline || c.short.toUpperCase(); };

function addDelta(s, cid, fx, mult = 1) {
  for (const f of FKEYS) if (fx[f]) s.delta[cid][f] = (s.delta[cid][f] || 0) + fx[f] * mult;
}
function addAll(s, cid, v) { for (const f of FKEYS) s.delta[cid][f] = (s.delta[cid][f] || 0) + v; }

function applyFx(s, fx) {
  if (!fx) return;
  // Negativity bias: voters remember what they dislike more than what they like.
  for (const f of FKEYS) if (fx[f]) s.delta.you[f] = (s.delta.you[f] || 0) + (fx[f] > 0 ? fx[f] * TUNE.posMult : fx[f]);
  if (fx.rino) s.rino = Math.max(0, s.rino + fx.rino);
  if (fx.label) s.label = Math.max(0, (s.label || 0) + fx.label);
  if (fx.pres) s.pres = clamp(s.pres + fx.pres, 0, 100);
  if (fx.money) s.money = Math.max(0, s.money + fx.money);
  for (const f of [].concat(fx.flag || [])) s.flags[f] = s.step + 1;   // flag: 'name' or ['name', 'other']
  if (fx.mate) swapMate(s, fx.mate === 'alt' ? altMate(s).id : fx.mate);
  for (const id in fx.opp || {}) if (active(s).includes(id)) addAll(s, id, fx.opp[id]);
  if (fx.oppLeader) { const r = sorted(stateShares(s)).map(e => e[0]).find(id => id !== 'you'); if (r) addAll(s, r, fx.oppLeader); }
  for (const org in fx.endorse || {}) {
    const to = endorseTarget(s, org, fx.endorse[org]);
    if (to) s.endorsements[org] = to;
  }
  for (const r in fx.gotv || {}) s.gotv[r] = (s.gotv[r] || 0) + fx.gotv[r];
  if (fx.gotvAll) for (const r of REGIONS) s.gotv[r.id] = (s.gotv[r.id] || 0) + fx.gotvAll;
  if (fx.drop && active(s).includes(fx.drop.id)) dropOut(s, fx.drop.id, fx.drop.to);
  if (fx.oppRival && s.runoff) addAll(s, s.runoff.rival, fx.oppRival);
  // The President never endorses the traditional conservative.
  if (fx.presEndorse && s.runoff && !(fx.presEndorse === 'rival' && s.runoff.rival === 'whitlock')) s.endorsed = fx.presEndorse === 'you' ? 'you' : s.runoff.rival;
}

// Who an organization endorses when content names a rival ("the Association endorses Krantz").
// If that rival is the candidate you play, or is not in the race, it goes to the rival who leads the organization's main faction.
function endorseTarget(s, org, to) {
  if (to === 'you' || (to !== s.player && active(s).includes(to) && !s.dropped.includes(to))) return to;
  const mainF = Object.entries(ENDORSERS[org].fx).sort((a, b) => b[1] - a[1])[0][0];
  return sorted(factionShares(s, mainF)).map(e => e[0]).find(id => id !== 'you' && id !== 'whitlock') || null;
}
// Replace the running mate: remove what the old one added, then add half of what the new one brings (it is late).
function swapMate(s, id) {
  const old = mateOf(s.mate), nu = mateOf(id);
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
