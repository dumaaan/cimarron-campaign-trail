// ============================================================
// ENDINGS — victory speeches, the general election, the first 100 days and consequences.
// ============================================================

// ---------- endings ----------
// How the race was won. Used by the victory speeches.
function raceContext(s) {
  const final = s.runoffResult ? s.runoffResult.total : s.election.total, order = sorted(final).map(e => e[0]);
  const w = s.finalWinner, second = order.find(id => id !== w);
  s.finalRunnerUp = second;
  return { w, second, runoff: !!s.runoffResult, share: final[w], margin: final[w] - final[second],
    presFor: s.endorsed === w, presAgainst: !!s.endorsed && s.endorsed !== w, war: !!s.war,
    comeback: (s.lowPlace || 1) >= 3 };
}
// Your victory speech. The Governor speaks as the incumbent. Every other candidate speaks in their own voice
// (RIVAL_SPEECH), and both versions add your running mate, your record, your biggest moments and the rival you beat.
function yourSpeech(s) {
  const ctx = raceContext(s), Y = YOUR_SPEECH, R = RIVAL_SPEECH[s.player];
  const gov = isGov(s) || !R;
  const open = gov ? (ctx.runoff ? Y.open.runoff : ctx.comeback ? Y.open.comeback : ctx.presAgainst ? Y.open.presAgainst
    : ctx.presFor ? Y.open.presFor : ctx.share >= 55 ? Y.open.landslide : ctx.margin < 4 ? Y.open.close : SPEECH.open)
    : (ctx.runoff ? R.open.runoff : ctx.comeback ? Y.open.comeback : ctx.presFor ? R.open.president : ctx.share >= 50 ? R.open.landslide : R.open.default);
  const top = FKEYS.map(f => [f, s.delta.you[f] || 0]).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
  const moments = Y.moments.filter(m => m.cond(s)).slice(0, 2).map(m => textOf(s, m.text));
  const orgs = Object.values(s.endorsements).filter(h => h === 'you').length;
  const nod = Y.rival[ctx.second] && (s.rino >= 6 || ctx.margin > 15 ? Y.rival[ctx.second].kind : Y.rival[ctx.second].fight);
  const close = ctx.war ? (gov ? Y.close.war : R.war) : ctx.runoff ? Y.close.runoff : gov ? (s.rino >= 6 ? Y.close.unity : Y.close.fight) : R.close;
  return [open, gov ? '' : RIVAL_OUTCOMES[s.player].speech, [Y.mate[s.mate], s.flags.mate_swap ? Y.mateSwap : ''].filter(Boolean).join(' '), SPEECH.record[s.record],
    ...moments, gov ? top.map(f => SPEECH.faction[f]).join(' ') : '', orgs >= 3 ? Y.endorsements(orgs) : '', nod, close].filter(Boolean);
}
// A rival's victory speech: the opening depends on how the race was won, and one line answers your campaign.
function rivalSpeech(s, w) {
  const R = RIVAL_SPEECH[w], ctx = raceContext(s), loser = displayName(s, 'you');
  if (!R) return [RIVAL_OUTCOMES[w].speech];
  const scandal = ['tape2', 'donor_deal', 'official1', 'tolliver_pardoned', 'renner_pardon', 'drone_deal', 'emails_bad'].some(f => s.flags[f]);
  const open = ctx.runoff ? R.open.runoff : ctx.presFor ? R.open.president : ctx.share >= 50 ? R.open.landslide : R.open.default;
  // The lines about the defeated Governor fit only when you played the Governor.
  const line = !isGov(s) && R.beat ? R.beat : scandal ? R.you.scandal : s.rino >= 6 ? R.you.rino : R.you.default;
  const you = line.replace(/\{loser\}/g, loser);
  return [open, RIVAL_OUTCOMES[w].speech, you, ctx.war ? R.war : '', R.close].filter(Boolean);
}
function hundredDays(items) {
  return `<ol class="timeline">${items.map(([d, t]) => `<li><span class="tl-date">${d}</span><span>${esc(t)}</span></li>`).join('')}</ol>`;
}
function consequences(s) {
  const governed = isGov(s) || s.finalWinner === 'you';
  const L = EPILOGUE.filter(e => s.flags[e.flag] && (governed || !e.acts)).map(e => typeof e.text === 'function' ? e.text(s) : e.text);
  L.push(s.rino >= 10 ? EPILOGUE_RINO_HIGH : s.rino < 2 ? EPILOGUE_RINO_LOW : '');
  return L.filter(Boolean).map(t => rivalize(s, t));
}
function generalLine(s, w, margin) {
  const rPct = 50 + margin / 2 - .7, dPct = 100 - rPct - 1.4;
  return `<p class="q-text">On November 5, ${displayName(s, w)} faces the Democratic nominee, ${DEMOCRAT.name}, ${DEMOCRAT.desc}.</p>
    <div class="ge"><div style="width:${rPct}%;background:#b3202a">${esc(shortName(s, w))} ${rPct.toFixed(1)}%</div><div style="width:${dPct}%;background:#2c5aa0">Lindqvist ${dPct.toFixed(1)}%</div></div>
    <p class="muted small">Other candidates: 1.4%. ${s.war ? 'The war and the price of diesel made this the closest governor\'s race in Cimarron in a generation.' : margin < 15 ? 'This is the smallest margin for a Republican governor in Cimarron in twenty years, a sign that the primary cost the party support among independents.' : 'The result was never in doubt.'}</p>`;
}

function renderEnding(s) {
  const e = s.election, w = s.finalWinner, won = w === 'you', rr = s.runoffResult;
  const final = rr ? rr.total : e.total;
  let sections = '';
  if (won) {
    const margin = clamp(27 - s.rino * .6 - (s.flags.tape2 ? 3 : 0) - (s.flags.donor_deal ? 2 : 0) - (s.war ? WAR.general : 0), 4, 34);
    const start = new Date(2031, 0, 12);
    const days = s.promises.slice(0, 12).map((p, i) => [new Date(start.getTime() + i * 8 * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), p]);
    if (days.length < 3) days.push(...(isGov(s) ? [['Feb 1', 'Presented a budget that continues the policies of your first term.'], ['Mar 15', 'Signed the legislature\'s tax and public safety package.']]
      : RIVAL_OUTCOMES[s.player].days.slice(0, 3)));
    const n = s.promises.length;
    sections = `
      <div class="panel-title">Your Victory Speech</div><blockquote>${yourSpeech(s).map(p => `<p>${esc(p)}</p>`).join('')}</blockquote>
      <div class="panel-title">The General Election</div>${generalLine(s, 'you', margin)}
      <div class="panel-title">${isGov(s) ? 'The First 100 Days of Your Second Term' : 'Your First 100 Days as Governor'}</div>
      <p class="muted small">Built from the promises you made during the campaign.</p>${hundredDays(days)}
      <div class="panel-title">One Year Later</div>
      <p class="q-text">${!isGov(s) ? esc(RIVAL_OUTCOMES[s.player].later) : n >= 10 ? 'You campaigned on an aggressive agenda, and you kept most of it. Several of your laws are in federal court. Your approval among Republicans is above 80%. Among all voters it is below 50%, the lowest of your career. National conservative media treat Cimarron as a model.'
        : n >= 5 ? 'Your second term follows the promises of the campaign. Some laws pass easily; others are slowed by the courts and by the cost of the income tax repeal. The base is satisfied. Your rivals are already preparing for 2034.'
        : 'You made few specific promises, and your second term looks much like your first. The base is not excited, but it is not angry. Dunmore\'s movement continues to grow outside the government.'}</p>
      ${consequences(s).length ? `<div class="panel-title">Consequences of Your Campaign</div><ul class="epilogue">${consequences(s).map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`;
  } else {
    const o = RIVAL_OUTCOMES[w], con = CONCESSION.find(c => c.id === s.concession) || CONCESSION[1];
    const obj = w === 'whitlock' ? 'her' : 'him';
    sections = `
      <div class="panel-title">Your Concession</div><blockquote><p>${esc(con.speech(displayName(s, w), obj, s))}</p></blockquote>
      <div class="panel-title">${esc(displayName(s, w))}'s Victory Speech</div><blockquote>${rivalSpeech(s, w).map(p => `<p>${esc(p)}</p>`).join('')}</blockquote>
      <div class="panel-title">The General Election</div>${generalLine(s, w, clamp(o.general + con.general - (s.war ? WAR.general : 0), 2, 34))}
      <div class="panel-title">${esc(CAND[w].short)}'s First 100 Days</div>${hundredDays(o.days)}
      <div class="panel-title">One Year Later</div><p class="q-text">${esc(o.later)}</p>
      <div class="panel-title">Your Future</div><p class="q-text">${esc(concessionFuture(s, con))}</p>
      ${consequences(s).length ? `<div class="panel-title">The Legacy of Your Campaign</div><ul class="epilogue">${consequences(s).map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`;
  }
  return `<div class="panel ending">
    <div class="ending-head" style="background:${colorOf(w)}">${won ? 'YOU WIN THE NOMINATION' : 'DEFEATED IN THE PRIMARY'}</div>
    <div class="ending-body">
      <div class="endorse-card">${portrait(s, w, 72)}<div><b>${displayName(s, w)}</b>${rr ? ' (after a runoff)' : ''}
        <div class="muted">${sorted(final).map(([id, v]) => `${esc(shortName(s, id))} ${v.toFixed(1)}%`).join(' · ')}</div></div></div>
      <div class="muted small">Seed ${s.seed} · ${difficultyOf(s).name} · Scenario: ${esc(scenarioOf(s).name)}${s.war ? ' · The war in the Middle East' : ''}</div>
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
