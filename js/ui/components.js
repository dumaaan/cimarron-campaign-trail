// ============================================================
// UI COMPONENTS — portraits, the map, polls, panels, chips, reactions and answer lists.
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
    <div><span class="lbl" title="He endorses you only if his opinion of you is at least ${PRES_ENDORSE.youNeed}.">The President's Opinion${s.endorsed ? '' : ` · ${Math.round(s.pres)}/${PRES_ENDORSE.youNeed}`}</span><span class="mini-bar"><span style="width:${s.pres}%"></span></span></div>
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
  if (fx.mate) out.push([`New running mate: ${RUNNING_MATES.find(m => m.id === fx.mate).name}`, 'down']);
  return `<div class="chips">${out.map(([t, c]) => `<span class="chip ${c}">${t}</span>`).join('')}</div>`;
}

function reactionsBox(s, r) {
  if (!r) return '';
  const o = OUTLETS[r.chyron.outlet];
  const post = (id, text) => { const p = PERSONAS[id], removed = text.startsWith('[This post was removed');
    return `<div class="post ${removed ? 'removed' : ''}"><span class="portrait" style="--c:${p.color};width:30px;height:30px;font-size:12px">${p.initials}</span>
      <div><div class="post-head"><b>${esc(p.name)}</b> <span class="muted">${esc(p.handle)}</span></div><div class="post-text">${esc(text)}</div></div></div>`; };
  return `<div class="reactions">
    <div class="chyron" style="--oc:${o.color};--ac:${o.accent}"><span class="outlet">${o.name}</span><span class="clabel">${o.label}</span><span class="ctext">${esc(r.chyron.text)}</span></div>
    <div class="posts">${post('boomer', r.boomer)}${post('groyper', r.groyper)}</div></div>`;
}
const breakingBox = c => c?.breaking?.length ? c.breaking.map(b => `<div class="breaking"><b>BREAKING:</b> ${esc(b)}</div>`).join('') : '';

function costTag(s, a, c) {
  const cost = costOf(a);
  if (!cost) return '';
  const short = c.answered == null && !canAfford(s, a);
  return `<span class="risk-tag ${short ? 'broke' : 'cost'}" title="${short ? 'Your war chest cannot pay for this.' : 'This choice spends money from your war chest.'}">${short ? 'NOT ENOUGH MONEY · ' : ''}COSTS $${cost.toFixed(1)}M</span> `;
}
function answersList(list, c, riskOf = () => false) {
  const unlockOf = a => typeof a.unlock === 'function' ? a.unlock(S) : a.unlock;
  return `<div class="answers">${list.map((a, i) => c.shown && !c.shown.includes(i) ? '' : `
    <label class="answer ${c.answered != null || (c.answered == null && !canAfford(S, a)) ? 'locked' : ''} ${c.answered === i ? 'chosen' : ''}">
      <input type="radio" name="ans" value="${i}" ${c.sel === i ? 'checked' : ''} ${c.answered != null || !canAfford(S, a) ? 'disabled' : ''}>
      <span>${costTag(S, a, c)}${a.unlock ? `<span class="risk-tag unlock" title="This choice is available because of an earlier decision.">${esc(unlockOf(a))}</span> ` : ''}${esc(a.text)}${riskOf(a) ? ` <span class="risk-tag" title="The outcome of this choice is uncertain.">RISK · ${Math.round(riskP(S, a.risk) * 100)}% chance it works</span>` : ''}</span></label>`).join('')}</div>`;
}
