// ============================================================
// ELECTION — primary night, the runoff campaign, and runoff meetings.
// ============================================================

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
    s.cur = { type: 'revent', eid: e.id, sel: null, answered: null, breaking: [], shown: shownChoices(s, e.choices) };
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
  if (!canAfford(s, ch)) return;
  applyFx(s, ch.fx);
  const p = typeof ch.p === 'function' ? ch.p(s) : ch.p;
  // Staying away: their voters decide alone, so neutral is as likely as backing your rival.
  c.result = rand() < p ? 'you' : rand() < (ch.stayAway ? .5 : .6) ? 'rival' : 'none';
  s.runoff.endorse[c.who] = c.result === 'you' ? 'you' : c.result === 'rival' ? s.runoff.rival : 'none';
  const line = c.result === 'none' ? `${CAND[c.who].name} declines to endorse in the runoff.` : `${CAND[c.who].name} endorses ${displayName(s, s.runoff.endorse[c.who])} in the runoff.`;
  s.wire.unshift({ who: c.who, text: line });
  s.log.push({ q: `Runoff: ${COURT[c.who].title}`, a: `${ch.text} (${RUNOFF_TEXT.endorsed[c.result]})` });
  c.reactions = buildReactions(s, `court_${c.who}:${c.sel}`, ch.fx, ch.text, null, COURT[c.who].title);
  c.answered = c.sel;
  save(); render();
}
