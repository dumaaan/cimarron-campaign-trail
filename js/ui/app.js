// ============================================================
// APP — setup screens, the main render, input handling, and start-up. Loaded last.
// ============================================================

// ---------- setup screens ----------
function renderTitle() {
  const hasSave = !!load();
  return `<div class="panel title-panel">
    <div class="field-row">${CANDIDATES.filter(c => c.id !== 'you' && !c.outsider).map(c => `<div class="field-mini">${portrait(null, c.id, 54)}<div>${c.short}</div></div>`).join('')}</div>
    ${TEXT.title.map(p => `<p class="q-text">${p}</p>`).join('')}
    <label class="name-row">Your name: <input id="name" maxlength="28" placeholder="Dale Whitcomb"></label>
    <label class="name-row">Seed (optional): <input id="seed" inputmode="numeric" maxlength="9" placeholder="random"> <span class="muted small">The same seed gives the same scenario and the same random events.</span></label>
    <div class="name-row">Difficulty:<div class="difficulty-row">${Object.entries(DIFFICULTY).map(([id, d]) => `<label class="difficulty"><input type="radio" name="difficulty" value="${id}" ${id === 'normal' ? 'checked' : ''}> <b>${d.name}</b><span class="muted small">${d.desc}</span></label>`).join('')}</div></div>
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
    <div class="scenario-card"><span class="lbl">Scenario · Seed ${s.seed} · ${difficultyOf(s).name}</span><b>${esc(scenarioOf(s).name)}</b><div>${esc(scenarioOf(s).desc)}</div></div>
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
    case 'start': newState($('#name').value.trim() || 'Dale Whitcomb', parseInt($('#seed').value, 10), $('input[name=difficulty]:checked')?.value); save(); render(); break;
    case 'resume': S = load(); applyDifficulty(S); render(); if (S.screen === 'election') tickElection(); break;
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
