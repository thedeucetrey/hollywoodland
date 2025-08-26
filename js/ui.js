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
