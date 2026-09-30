// ============================================================
// DECISIONS — media reactions, and what happens when you answer a question, event or debate.
// ============================================================

// ---------- media reactions ----------
function reactionTags(fx, outcome) {
  const t = new Set();
  if (outcome === 'lose') t.add('fail');
  if ((fx.rino || 0) > 0) t.add('rino');
  for (const f of ['maga', 'online', 'faith', 'guns', 'liberty', 'chamber', 'farm']) if ((fx[f] || 0) >= 3) t.add(f);
  if (Object.values(fx.opp || {}).some(v => v < 0) || fx.oppRival < 0 || fx.oppLeader < 0) t.add('attack');
  if (!t.size) t.add('neutral');
  return t;
}
// Each persona's stance on a decision.
function postStance(who, tags, fx) {
  if (tags.has('fail')) return 'fail';
  if (tags.has('rino')) return 'disapprove';
  if (tags.has('attack')) return 'attack';
  if (who === 'boomer') {
    if (['maga', 'faith', 'guns', 'liberty', 'farm', 'chamber'].some(t => tags.has(t))) return 'approve';
    return tags.has('online') ? 'confused' : 'neutral';
  }
  if (tags.has('online') || (fx.maga || 0) >= 4) return 'approve';
  if (tags.has('chamber') || tags.has('liberty')) return 'disapprove';
  return ['maga', 'faith', 'guns', 'farm'].some(t => tags.has(t)) ? 'meh' : 'neutral';
}
function pickPost(s, pool) {
  s.usedPosts = s.usedPosts || [];
  const fresh = pool.filter(p => !s.usedPosts.includes(p));
  const post = pick(fresh.length ? fresh : pool);
  s.usedPosts.push(post);
  return post;
}
// Every decision has its own posts and chyron in REACTIONS (reactions.js). A gamble can have a second set for failure.
// The generic pools in media.js are only a fallback, and never quote the decision.
function reactionFor(key, outcome) {
  const r = REACTIONS[key];
  if (!r) return null;
  const [boomer, groyper, chyron] = outcome === 'lose' && r.length > 3 ? r.slice(3) : r;
  return { boomer, groyper, chyron };
}
function buildReactions(s, key, fx, text, outcome) {
  const tags = reactionTags(fx || {}, outcome), spec = reactionFor(key, outcome) || {};
  const src = EVENTS.find(e => e.id === key.replace(/:\d+$/, '')) || QUESTIONS.find(q => q.id === key.replace(/:\d+$/, ''));
  const rv = t => !src || isShared(src) ? rivalize(s, t) : t;
  const last = shortName(s, 'you'), LAST = headlineName(s), rivalId = Object.keys(fx?.opp || {})[0] || (fx?.oppRival ? s.runoff?.rival : null);
  const fill = t => t.replace(/\{last\}/g, last).replace(/\{LAST\}/g, LAST).replace(/\{rival\}/g, rivalId ? CAND[rivalId].short : 'the other guy')
    .replace(/\{RIVAL\}/g, (rivalId ? CAND[rivalId].short : 'RIVAL').toUpperCase());
  s.mediaTurn = (s.mediaTurn || 0) + 1;
  let outlet = s.mediaTurn % 2 ? 'fax' : 'max', chyron = spec.chyron;
  const m = chyron && chyron.match(/^(fax|max):\s*/);
  if (m) { outlet = m[1]; chyron = chyron.slice(m[0].length); }
  if (!chyron) chyron = pickPost(s, CHYRONS[tags.has('fail') ? 'fail' : tags.has('rino') ? 'rino' : tags.has('attack') ? 'attack' : (fx?.maga || 0) >= 4 ? 'maga' : 'neutral']);
  return {
    chyron: { outlet, text: fill(chyron) },
    boomer: rv(fill(spec.boomer || pickPost(s, BOOMER_POSTS[postStance('boomer', tags, fx || {})]))),
    groyper: rv(fill(spec.groyper || pickPost(s, GROYPER_POSTS[postStance('groyper', tags, fx || {})]))),
  };
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
  if (c.sel == null || (c.shown && !c.shown.includes(c.sel))) return;
  const picked = c.type === 'q' ? QUESTIONS.find(q => q.id === c.qid).answers[c.sel] : c.type === 'debate' ? c.opts[c.sel]
    : (c.type === 'revent' ? RUNOFF_EVENTS : EVENTS).find(e => e.id === c.eid).choices[c.sel];
  if (!canAfford(s, picked)) return;
  if (c.type === 'q') {
    const q = QUESTIONS.find(q => q.id === c.qid), a = q.answers[c.sel];
    applyFx(s, a.fx);
    if (q.region) s.bonus.you[q.region] = (s.bonus.you[q.region] || 0) + 1;
    recordPromise(s, `${q.id}:${c.sel}`);
    s.log.push({ q: q.setting, a: textOf(s, a.text) });
    c.reactions = buildReactions(s, `${q.id}:${c.sel}`, a.fx, a.text, null, q.text);
    opponentNews(s);
    if (s.step > SCHEDULE.indexOf('endorse')) c.breaking = checkDropouts(s);
  } else if (c.type === 'event' || c.type === 'revent') {
    const e = (c.type === 'revent' ? RUNOFF_EVENTS : EVENTS).find(e => e.id === c.eid), ch = e.choices[c.sel];
    const chText = textOf(s, ch.text), fx = resolveFx(s, ch.fx);
    const rv = t => isShared(e) ? rivalize(s, t) : t;
    c.fb = rv(textOf(s, ch.fb));             // written before the decision changes the game
    applyFx(s, fx);
    c.fx = { ...fx };
    if (ch.risk) {
      const won = rand() < riskP(s, ch.risk), o = won ? ch.risk.win : ch.risk.lose;
      c.outcome = won ? 'win' : 'lose';
      const ofx = resolveFx(s, o.fx);
      c.fb = rv(textOf(s, o.fb));
      applyFx(s, ofx);
      c.fx = { ...fx, ...ofx };
    }
    if (e.special === 'strawpoll') runStrawPoll(s, c);
    if (e.special === 'war') startWar(s);
    recordPromise(s, `${e.id}:${c.sel}`);
    s.log.push({ q: `${c.type === 'revent' ? 'Runoff' : e.kind}: ${textOf(s, e.title)}`, a: chText + (c.outcome ? ` (${c.outcome === 'win' ? 'it worked' : 'it failed'})` : '') });
    c.reactions = buildReactions(s, `${e.id}:${c.sel}`, c.fx, ch.text, c.outcome, e.title);
    if (c.type === 'event') {
      opponentNews(s);
      if (s.step > SCHEDULE.indexOf('endorse')) c.breaking = checkDropouts(s);
    }
  } else if (c.type === 'debate') {
    const q = DEBATE_QUESTIONS.find(q => q.id === c.qs[c.idx]), a = c.opts[c.sel];
    applyFx(s, a.fx);
    c.reactions = buildReactions(s, a.rkey || `${q.id}:${c.sel}`, a.fx, a.text, null, q.text);
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
      const tgt = r.attack === s.player ? 'you' : r.attack;   // a rival who attacks the candidate you play attacks you
      const target = tgt && active(s).includes(tgt) ? tgt : null;
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
