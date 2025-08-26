import { World, Studio, pitchProject } from "./sim.js";
import { renderMarket, renderStudio, logLine } from "./ui.js";

// --- load/save simple state ---
const STORAGE_KEY = "hl.studio";
function saveStudio(studio) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(studio));
}
function loadStudio() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? Object.assign(new Studio({ id: "local", name: "Studio" }), JSON.parse(raw)) : null;
}

// --- init ---
const world = new World();
let studio = loadStudio();

const newStudioBtn = document.getElementById("newStudioBtn");
const pitchBtn = document.getElementById("pitchBtn");
const studioCard = document.getElementById("studioCard");

function updateUI() {
  renderMarket(world.tick, world.market);
  renderStudio(studio);
  pitchBtn.disabled = !studio;
}
updateUI();

// create studio
newStudioBtn.addEventListener("click", () => {
  const name = prompt("Studio name?", "Silver Oak Pictures");
  if (!name) return;
  studio = new Studio({ id: crypto.randomUUID(), name });
  saveStudio(studio);
  logLine(`🎬 Created studio: ${name}`);
  updateUI();
});

// pitch project
pitchBtn.addEventListener("click", () => {
  const result = pitchProject(world, studio);
  if (!result.ok) { logLine(`⚠️ ${result.msg}`); return; }
  saveStudio(studio);
  if (result.success) {
    logLine(`✅ GREENLIT: "${result.title}" (${result.genre}) | Cost $${result.cost.toLocaleString()} → Revenue $${result.revenue.toLocaleString()}`);
  } else {
    logLine(`❌ PASSED: "${result.title}" (${result.genre}) | Burned $${result.cost.toLocaleString()}`);
  }
  updateUI();
});

// simulation loop (client-only for now)
setInterval(() => {
  world.step();
  updateUI();
}, 2000);

// expose for debugging in console
window.world = world;
window.getStudio = () => studio;
