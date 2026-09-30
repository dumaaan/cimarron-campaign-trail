// ============================================================
// THE TRAIL — debate options, campaign stops, and rivals who drop out.
// ============================================================

// The rival closest to you in the polls, and the gap (positive = they are ahead).
function nearestRival(s) {
  const sh = stateShares(s), mine = sh.you;
  const id = Object.keys(sh).filter(c => c !== 'you').sort((a, b) => Math.abs(sh[a] - mine) - Math.abs(sh[b] - mine))[0];
  return id ? { id, gap: sh[id] - mine } : null;
}
const factionFx = fx => Object.fromEntries(FKEYS.filter(f => fx[f]).map(f => [f, fx[f]]));
function attackOption(s) {
  const n = nearestRival(s);
  if (!n || Math.abs(n.gap) > CLOSE_RACE || !ATTACK_LINES[n.id]) return null;
  const who = CAND[n.id].short, li = Math.floor(rand() * ATTACK_LINES[n.id].length);
  return { text: `Turn to ${who}: ${ATTACK_LINES[n.id][li]}`, fx: { ...ATTACK_FX[n.id], opp: { [n.id]: -3 } }, attackOpt: true, rkey: `attack:${n.id}:${li}`,
    fb: `${displayName(s, n.id)} is ${n.gap > 0 ? `ahead of you by ${n.gap.toFixed(1)}` : `behind you by ${(-n.gap).toFixed(1)}`} points. In a close race, the voters you take from your nearest rival count twice.` };
}
// Closing statements depend on your record, your position in the race and your strongest faction.
function closingOptions(s, which) {
  const lead = sorted(stateShares(s))[0][0] === 'you';
  const topF = FKEYS.map(f => [f, s.delta.you[f] || 0]).sort((a, b) => b[1] - a[1])[0][0];
  const intro = which === 2 ? 'This is the last time we will stand on this stage together. ' : '';
  const say = t => t.replace(/^"/, `"${intro}`);
  const rec = RECORDS.find(r => r.id === s.record);
  return [
    { rkey: `close:record:${s.record}`, text: say(RECORD_CLOSE[s.record]), fx: factionFx(rec.fx), fb: 'You closed on your record. Voters who know what you have done hear a reason to stay with you.' },
    { rkey: `close:${lead ? 'leading' : 'behind'}`, text: say(POSITION_CLOSE[lead ? 'leading' : 'behind'].text), fx: POSITION_CLOSE[lead ? 'leading' : 'behind'].fx,
      fb: lead ? 'A front-runner\'s close: steady and confident.' : 'An underdog\'s close. It fires up your supporters.' },
    { rkey: `close:${topF}`, text: say(FACTION_CLOSE[topF].text), fx: FACTION_CLOSE[topF].fx, fb: `A closing aimed at your strongest group, ${FACTIONS[topF].name}.` },
  ];
}
function buildDebateOptions(s, q, which) {
  // Answers keep their original index as their reaction key, even when some are hidden for this candidate.
  const opts = q.id === 'd_closing' ? closingOptions(s, which)
    : q.answers.map((a, i) => ({ ...a, rkey: a.rkey || `${q.id}:${i}` })).filter(a => !a.cond || a.cond(s));
  const atk = attackOption(s);
  if (atk) opts.push(atk);
  if (q.id === 'd_closing') opts.push({ ...MODERATE_CLOSE, rkey: 'close:moderate' });
  return opts;
}

function debateNext() {
  const c = S.cur;
  if (c.idx < c.qs.length - 1) {
    c.idx++; c.sel = null; c.answered = null; c.round = null; c.reactions = null;
    c.opts = buildDebateOptions(S, DEBATE_QUESTIONS.find(q => q.id === c.qs[c.idx]), c.which);
  }
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
  if (act.cost > 0 && !canAfford(s, { fx: { money: -act.cost } })) return;
  if (act.cost > 0) spend(s, act.cost); else s.money -= act.cost;
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
    // The incumbent, Whitlock and the President's candidate never drop out.
    if (id === 'you' || id === 'whitlock' || id === 'castellano' || id === s.endorsed || v >= DROPOUT_LINE || active(s).length <= 3) continue;
    const topF = FKEYS.slice().sort((a, b) => CAND[id].base[b] - CAND[id].base[a])[0];
    const to = sorted(factionShares(s, topF)).map(e => e[0]).find(c => c !== 'whitlock' && c !== id);
    out.push(dropOut(s, id, to));
  }
  return out;
}
