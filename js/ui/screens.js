// ============================================================
// SCREENS — questions, events, debates, stops, the endorsement, the runoff and election night.
// ============================================================

function renderQuestion(s) {
  const c = s.cur, q = QUESTIONS.find(q => q.id === c.qid);
  let h = `<div class="q-meta"><span>Campaign Question</span><span>${esc(q.setting)}</span></div>
    <div class="q-text">${esc(rivalize(s, textOf(s, q.text)))}</div>${answersList(q.answers, c)}`;
  if (c.answered == null) h += `<button class="btn" id="submit" ${c.sel == null ? 'disabled' : ''}>Answer</button>`;
  else {
    const a = q.answers[c.answered];
    h += `<div class="feedback"><div class="fb-head">Campaign Manager's Assessment</div><p>${esc(rivalize(s, textOf(s, a.fb)))}</p>${chips(s, a.fx)}</div>
      ${reactionsBox(s, c.reactions)}
      ${breakingBox(c)}<button class="btn" id="next">Continue</button>`;
  }
  return h;
}

function renderEvent(s) {
  const c = s.cur, e = (c.type === 'revent' ? RUNOFF_EVENTS : EVENTS).find(e => e.id === c.eid);
  const text = typeof e.text === 'function' ? e.text(s) : e.text;
  let h = `<div class="q-meta"><span class="kind" style="background:${EVENT_KINDS[e.kind] || '#333'}">${e.kind}</span><span>${c.type === 'revent' ? `Runoff · ${fmtDate(runoffDate(s))}` : dateOf(s.step)}</span></div>
    <div class="event-title">${esc(textOf(s, e.title))}</div>
    <div class="q-text">${esc(isShared(e) ? rivalize(s, text) : text)}</div>`;
  const advice = adviceOf(s, e);
  if (advice.length) h += `<div class="advice"><div class="fb-head">Your Advisors</div>${advice.map(([id, t]) =>
    `<div class="adv">${staffBadge(id)}<div><b>${staffOf(id).name}</b> <span class="muted small">${staffOf(id).role}</span><div>${esc(isShared(e) ? rivalize(s, t) : t)}</div></div></div>`).join('')}</div>`;
  h += answersList(e.choices, c, a => !!a.risk);
  if (c.answered == null) h += `<button class="btn" id="submit" ${c.sel == null ? 'disabled' : ''}>Decide</button>`;
  else {
    h += `<div class="feedback ${c.outcome === 'lose' ? 'fail' : c.outcome === 'win' ? 'success' : ''}"><div class="fb-head">${c.outcome === 'win' ? 'The Gamble Paid Off' : c.outcome === 'lose' ? 'The Gamble Failed' : 'Result'}</div><p>${esc(c.fb)}</p>${chips(s, c.fx)}</div>${reactionsBox(s, c.reactions)}`;
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
    <div class="q-text">${esc(q.round ? textOf(s, q.text) : rivalize(s, textOf(s, q.text)))}</div>`;
  if (c.answered == null) h += answersList(c.opts, c) + `<button class="btn" id="submit" ${c.sel == null ? 'disabled' : ''}>Answer</button>`;
  else {
    h += `<div class="round">${c.round.map(r => `<div class="round-row ${r.id === 'you' ? 'mine' : ''}">${portrait(s, r.id, 32)}
        <div class="round-main"><div><b>${displayName(s, r.id)}</b> <span class="grade g-${grade(r.perf).toLowerCase()}">${grade(r.perf)}</span>${r.attack ? ` <span class="atk">attacks ${esc(shortName(s, r.attack))}</span>` : ''}</div>
        <div class="round-text">${esc(r.text)}</div></div></div>`).join('')}</div>
      <div class="feedback"><div class="fb-head">From the Spin Room</div><p>${esc(c.opts[c.answered].fb)}</p>${chips(s, c.opts[c.answered].fx)}</div>
      ${reactionsBox(s, c.reactions)}
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
    <div class="answers">${STOP_ACTIONS.map(a => `<label class="answer ${a.cost > s.money && !selfFunds(s) ? 'locked' : ''}"><input type="radio" name="stop" value="${a.id}" ${c.action === a.id ? 'checked' : ''} ${a.cost > s.money && !selfFunds(s) ? 'disabled' : ''}>
      <span><b>${a.name}.</b> ${a.desc}</span></label>`).join('')}</div>
    <button class="btn" id="go" ${c.region ? '' : 'disabled'}>Go</button>`;
}

function renderEndorse(s) {
  const who = s.cur.who;
  return `<div class="q-meta"><span>Breaking News</span><span>The President's Endorsement</span></div>
    <div class="endorse-card">${portrait(s, who, 72)}
      <div><div class="endorse-head">THE PRESIDENT ENDORSES ${displayName(s, who).toUpperCase()}</div>
      <p class="post">${esc(ENDORSE_TEXT[who === 'you' ? s.player : who] || ENDORSE_TEXT.dunmore)}</p></div></div>
    <p class="q-text">${who === 'you' ? TEXT.endorseYou : TEXT.endorseOther}</p>
    ${who !== 'you' && s.pres < PRES_ENDORSE.youNeed ? `<p class="muted small">${esc(TEXT.endorseNoYou(s))}</p>` : ''}
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

// Offers that cost you with other factions are marked, so the trade is visible.
function dealCost(fx) {
  const lost = FKEYS.filter(f => (fx[f] || 0) <= -2).map(f => FACTIONS[f].name);
  return lost.length ? ` <span class="risk-tag" style="background:#8d1820">DEAL WITH THE DEVIL · costs you with ${lost.join(', ')}</span>` : '';
}
function renderCourt(s) {
  const c = s.cur, C = COURT[c.who], e = s.election;
  let h = `<div class="q-meta"><span class="kind" style="background:${colorOf(c.who)}">Endorsement</span><span>Runoff · ${fmtDate(runoffDate(s))}</span></div>
    <div class="event-title">${esc(C.title)}</div>
    <div class="endorse-card">${portrait(s, c.who, 56)}<div><b>${nameLink(s, c.who)}</b><div class="muted small">${e.total[c.who].toFixed(1)}% in the primary (${e.totalVotes[c.who].toLocaleString()} votes) · strongest with ${topFactions(c.who).map(f => FACTIONS[f].name).join(' and ')}</div></div></div>
    <div class="q-text">${esc(C.text)}</div>`;
  h += `<div class="answers">${C.choices.map((a, i) => `<label class="answer ${c.answered != null || !canAfford(s, a) ? 'locked' : ''} ${c.answered === i ? 'chosen' : ''}">
      <input type="radio" name="ans" value="${i}" ${c.sel === i ? 'checked' : ''} ${c.answered != null || !canAfford(s, a) ? 'disabled' : ''}>
      <span>${costTag(s, a, c)}${esc(a.text)} <span class="risk-tag" style="background:#1f6b3a">${Math.round((typeof a.p === 'function' ? a.p(s) : a.p) * 100)}% chance of endorsement</span>${dealCost(a.fx)}</span></label>`).join('')}</div>`;
  if (c.answered == null) h += `<button class="btn" id="court-submit" ${c.sel == null ? 'disabled' : ''}>Make the Offer</button>`;
  else {
    const ch = C.choices[c.answered];
    h += `<div class="feedback ${c.result === 'you' ? 'success' : c.result === 'rival' ? 'fail' : ''}"><div class="fb-head">${CAND[c.who].short}: ${RUNOFF_TEXT.endorsed[c.result]}</div><p>${esc(ch.fb)}</p>${chips(s, ch.fx)}</div>
      ${reactionsBox(s, c.reactions)}
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
