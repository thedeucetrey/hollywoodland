export function renderMarket(tick, market) {
  document.getElementById("tick").textContent = `Tick: ${tick}`;
  const grid = document.getElementById("marketGrid");
  grid.innerHTML = "";
  Object.entries(market).forEach(([g, v]) => {
    const card = el("div", "card genre");
    const name = el("div", "", g);
    const val = el("div", "", v.toFixed(2));
    card.append(name, val);
    grid.append(card);
  });
}

export function renderStudio(studio) {
  const card = document.getElementById("studioCard");
  if (!studio) { card.classList.add("hidden"); return; }
  card.classList.remove("hidden");
  card.innerHTML = `
    <div><strong>${studio.name}</strong></div>
    <div>Funds: $${studio.funds.toLocaleString()}</div>
    <div>Projects: ${studio.projects.length}</div>
  `;
}

export function renderPlayer(player) {
  const body = document.getElementById("playerBody");
  if (!player) { body.innerHTML = "<em>No player profile yet.</em>"; return; }

  const skill = (k, v) => `<div class="kv"><span>${k}</span><span class="monos">${v}</span></div>`;
  const perks = (player.perks ?? []).map(p => `<span class="badge">${p}</span>`).join("");
  const flaws = (player.flaws ?? []).map(p => `<span class="badge">${p}</span>`).join("");

  body.innerHTML = `
    <div><strong>${player.name}</strong> — ${player.career}</div>
    <div class="statgrid" style="margin-top:6px">
      <div class="kv"><span>Fame</span><span class="monos">${player.fame}</span></div>
      <div class="kv"><span>Reputation</span><span class="monos">${player.rep}</span></div>
      <div class="kv"><span>Funds</span><span class="monos">$${(player.funds ?? 0).toLocaleString()}</span></div>
      <div class="kv"><span>Energy</span><span class="monos">${player.energy}</span></div>
      <div class="kv"><span>Stress</span><span class="monos">${player.stress}</span></div>
    </div>

    <h3 style="margin:10px 0 6px">Skills</h3>
    <div class="statgrid">
      ${skill("Negotiation", player.skills.negotiation)}
      ${skill("Taste",       player.skills.taste)}
      ${skill("Vision",      player.skills.vision)}
      ${skill("Logistics",   player.skills.logistics)}
      ${skill("PR",          player.skills.pr)}
    </div>

    <div style="margin-top:10px">
      <div><strong>Perks</strong></div>
      <div class="badges">${perks || "<em>None</em>"}</div>
    </div>
    <div style="margin-top:6px">
      <div><strong>Flaws</strong></div>
      <div class="badges">${flaws || "<em>None</em>"}</div>
    </div>
  `;
}

export function logLine(text) {
  const log = document.getElementById("log");
  log.textContent = `${text}\n` + log.textContent;
}

function el(tag, className = "", text = "") {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text) n.textContent = text;
  return n;
}
