// ============================================================
// MODALS — candidate, region and state profiles.
// ============================================================

// ---------- modals ----------
function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').hidden = false; }
function closeModal() { $('#modal').hidden = true; }
const ordinal = n => n + (['st', 'nd', 'rd'][n - 1] || 'th');

function candidateModal(s, id) {
  const c = CAND[id], live = s && !['record', 'mate', 'field'].includes(s.screen);
  const inRaceNow = live && !s.dropped.includes(id);
  const st = inRaceNow ? stateShares(s) : null;
  const rank = st ? sorted(st).findIndex(e => e[0] === id) + 1 : null;
  const facs = inRaceNow ? FKEYS.map(f => [f, factionShares(s, f)[id]]).sort((a, b) => b[1] - a[1]) : [];
  const regs = inRaceNow ? REGIONS.map(r => [r.id, regionShares(s, r.id)[id]]).sort((a, b) => b[1] - a[1]) : [];
  const orgs = s ? Object.entries(s.endorsements).filter(([, h]) => h === id).map(([o]) => ENDORSERS[o].name) : [];
  if (s && s.endorsed === id) orgs.unshift('The President');
  const news = s ? s.wire.filter(w => w.who === id).slice(0, 4) : [];
  let body;
  if (id === 'you') {
    const rec = s && RECORDS.find(r => r.id === s.record), mate = s && mateOf(s.mate), info = PLAYER_INFO[s?.player || 'castellano'];
    body = `<p class="muted">${c.title} · Age ${c.age} · ${esc(c.home)}</p><p>${esc(c.blurb)}</p>
      ${rec ? `<p><b>${esc(info.openingTitle)}:</b> ${esc(rec.title)}.</p>` : ''}${mate ? `<p><b>Running mate:</b> ${esc(mate.name)} (${esc(mate.title)}).</p>` : ''}
      <p><b>Your weak spot, "${esc(info.label)}":</b> ${esc(info.labelDesc)}</p>
      ${s?.promises.length ? `<div class="panel-title">Promises You Have Made (${s.promises.length})</div><ul class="small-list">${s.promises.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}`;
  } else {
    body = `<p class="muted">${c.title} · Age ${c.age} · ${esc(c.home)}</p><p>${esc(c.blurb)}</p>
      <div class="panel-title">Key Positions</div><ul class="small-list">${c.positions.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  }
  let stats = '';
  if (live) {
    stats = s.dropped.includes(id) ? '<p class="breaking">Withdrawn from the race.</p>' : `<div class="modal-stats">
      <div><span class="lbl">Statewide</span><b>${st[id].toFixed(1)}%</b> <span class="muted">(${ordinal(rank)})</span></div>
      <div><span class="lbl">Strongest factions</span>${facs.slice(0, 3).map(([f, v]) => `${FACTIONS[f].name} ${v.toFixed(0)}%`).join(' · ')}</div>
      <div><span class="lbl">Weakest faction</span>${FACTIONS[facs[facs.length - 1][0]].name} ${facs[facs.length - 1][1].toFixed(0)}%</div>
      <div><span class="lbl">Best regions</span>${regs.slice(0, 3).map(([r, v]) => `${REG[r].name} ${v.toFixed(0)}%`).join(' · ')}</div>
    </div>`;
    stats += `<div class="panel-title">Endorsements</div><p>${orgs.length ? orgs.map(esc).join(', ') : '<span class="muted">None yet.</span>'}</p>
      ${news.length ? `<div class="panel-title">Recent News</div><ul class="small-list">${news.map(n => `<li>${esc(n.text)}</li>`).join('')}</ul>` : ''}`;
  }
  return `<div class="modal-head">${portrait(s, id, 64)}<div><div class="modal-title">${id === 'you' ? (s ? displayName(s, 'you') : 'You') : c.name}</div>
    <span class="faction-tag" style="background:${c.color}">${c.title}</span></div></div>${body}${stats}`;
}

function regionModal(s, rid) {
  const r = REG[rid], d = r.demo, live = s && ['campaign', 'runoff', 'election', 'ending', 'concede'].includes(s.screen);
  const sh = live ? (['election', 'ending', 'concede'].includes(s.screen) ? currentResult(s).results[rid] : regionShares(s, rid)) : null;
  const facRows = Object.entries(r.mix).sort((a, b) => b[1] - a[1]).map(([f, m]) =>
    `<tr><td>${FACTIONS[f].name}</td><td>${(m * 100).toFixed(0)}%</td><td>${(turnoutOf(f) * r.turnoutMod * 100).toFixed(0)}%</td><td>${Math.round(factionVotes(r, f)).toLocaleString()}</td></tr>`).join('');
  return `<div class="modal-title">${r.name}</div><p class="muted">County seat: ${r.seat} · ${esc(r.economy)}</p><p>${esc(r.desc)}</p>
    <div class="modal-stats">
      <div><span class="lbl">Population</span>${d.pop}</div><div><span class="lbl">Median age</span>${d.age}</div>
      <div><span class="lbl">Rural</span>${d.rural}%</div><div><span class="lbl">Evangelical</span>${d.evangelical}%</div>
      <div><span class="lbl">Hispanic</span>${d.hispanic}%</div><div><span class="lbl">College degree</span>${d.college}%</div>
      <div><span class="lbl">Median household income</span>${d.income}</div>
      <div><span class="lbl">Registered Republicans</span>${Math.round(REGISTERED_R * r.voters / 100).toLocaleString()} (${r.voters}% of the state's)</div>
      <div><span class="lbl">Expected primary turnout</span>${(regionTurnout(r) * 100).toFixed(0)}% · ${Math.round(regionWeight(r)).toLocaleString()} votes</div>
      <div><span class="lbl">Share of expected statewide vote</span>${(regionWeight(r) / TOTAL_WEIGHT() * 100).toFixed(1)}%</div>
    </div>
    <div class="panel-title">Republican Primary Electorate</div>
    <table class="xtab"><thead><tr><th>Faction</th><th>Share of registered</th><th>Turnout here</th><th>Expected votes</th></tr></thead><tbody>${facRows}</tbody></table>
    ${sh ? `<div class="panel-title">${['campaign', 'runoff'].includes(s.screen) ? 'Current Polling' : 'Result'} in ${r.name}</div>${pollRows(s, sh)}
      <p class="muted small">Your campaign here: ${(s.bonus.you[rid] || 0).toFixed(0)} points from visits and ads${s.gotv[rid] ? `, +${Math.round(s.gotv[rid] * 100)}% turnout operation` : ''}.</p>` : ''}`;
}

const fmtK = n => n >= 1e6 ? `${(n / 1e6).toFixed(2)} million` : `${Math.round(n / 1000).toLocaleString()},000`;
function stateModal() {
  const P = STATE_PROFILE, regTotal = P.registeredR + P.registeredD + P.unaffiliated;
  const oldFaith = registered.seniors + registered.faith, oldFaithVote = expectedVote().seniors + expectedVote().faith;
  const bigTwo = (regionWeight(REG.fort) + regionWeight(REG.osgood)) / TOTAL_WEIGHT() * 100;
  const notes = [
    `Older conservatives and evangelicals are ${oldFaith.toFixed(0)}% of registered Republicans, but ${oldFaithVote.toFixed(0)}% of expected primary voters, because they turn out at ${Math.round(turnoutOf('seniors') * 100)}% and ${Math.round(turnoutOf('faith') * 100)}%.`,
    `The New Right is ${registered.online.toFixed(0)}% of registered Republicans, but only ${Math.round(turnoutOf('online') * 100)}% of them usually vote in a primary, so they are ${expectedVote().online.toFixed(0)}% of the expected vote.`,
    `Fort Eisenhower and the Osgood Exurbs together cast ${bigTwo.toFixed(0)}% of the expected primary vote.`,
    `Rural regions vote at higher rates. Expected turnout ranges from ${Math.round(Math.min(...REGIONS.map(regionTurnout)) * 100)}% (${REGIONS.slice().sort((x, y) => regionTurnout(x) - regionTurnout(y))[0].name}) to ${Math.round(Math.max(...REGIONS.map(regionTurnout)) * 100)}% (${REGIONS.slice().sort((x, y) => regionTurnout(y) - regionTurnout(x))[0].name}).`,
  ];
  return `<div class="modal-title">State of ${STATE_NAME}</div>
    <div class="modal-stats">
      <div><span class="lbl">Population</span>${fmtK(P.pop)} (${fmtK(P.adults)} adults)</div>
      <div><span class="lbl">Registered voters</span>${fmtK(regTotal)} (${Math.round(regTotal / P.adults * 100)}% of adults)</div>
      <div><span class="lbl">Registered Republicans</span>${P.registeredR.toLocaleString()} (${Math.round(P.registeredR / regTotal * 100)}%)</div>
      <div><span class="lbl">Registered Democrats</span>${P.registeredD.toLocaleString()} (${Math.round(P.registeredD / regTotal * 100)}%)</div>
      <div><span class="lbl">Unaffiliated</span>${P.unaffiliated.toLocaleString()} (${Math.round(P.unaffiliated / regTotal * 100)}%)</div>
      <div><span class="lbl">Expected primary turnout</span>${Math.round(TOTAL_WEIGHT()).toLocaleString()} votes (${(TOTAL_WEIGHT() / REGISTERED_R * 100).toFixed(1)}% of registered Republicans)</div>
    </div>
    <p><b>Rules:</b> ${P.primary}</p><p><b>Recent results:</b> ${P.lastResults}</p>
    <div class="panel-title">Why Turnout Matters</div><ul class="small-list">${notes.map(n => `<li>${n}</li>`).join('')}</ul>
    <div class="panel-title">The Factions</div>
    <table class="xtab"><thead><tr><th>Faction</th><th>Registered</th><th>Turnout</th><th>Expected votes</th><th>Share of votes</th></tr></thead><tbody>
      ${FKEYS.map(f => `<tr><td>${FACTIONS[f].name}<div class="muted small">${esc(FACTIONS[f].blurb)}</div></td><td>${registered[f].toFixed(0)}%</td><td>${(turnoutOf(f) * 100).toFixed(0)}%*</td><td>${Math.round(expectedVote()[f] / 100 * TOTAL_WEIGHT()).toLocaleString()}</td><td><b>${expectedVote()[f].toFixed(1)}%</b></td></tr>`).join('')}
    </tbody></table>
    <p class="muted small">* Statewide base rate. Each region adjusts it up or down.</p>
    <div class="panel-title">The Regions</div>
    <table class="xtab"><thead><tr><th>Region</th><th>Population</th><th>Registered R</th><th>Turnout</th><th>Expected votes</th><th>Share of votes</th></tr></thead><tbody>
      ${REGIONS.map(r => `<tr><td><span class="region-link" data-region="${r.id}">${r.name}</span></td><td>${r.demo.pop}</td><td>${Math.round(REGISTERED_R * r.voters / 100).toLocaleString()}</td><td>${(regionTurnout(r) * 100).toFixed(0)}%</td><td>${Math.round(regionWeight(r)).toLocaleString()}</td><td><b>${(regionWeight(r) / TOTAL_WEIGHT() * 100).toFixed(1)}%</b></td></tr>`).join('')}
    </tbody></table>
    <p class="muted small">Get-Out-the-Vote operations at campaign stops raise turnout among your supporters in a region.</p>`;
}
