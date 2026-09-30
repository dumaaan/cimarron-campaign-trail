// ============================================================
// VOTE MODEL — support by faction and region, turnout, and polls.
// ============================================================

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
  if (s.endorsed === cid) v += PRES_ENDORSE.fx[f] || 0;
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
