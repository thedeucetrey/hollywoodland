 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/app.js b/js/app.js
index 3949ad212e28c6e2868517033a57f057cd67ce4b..2523b8b177cac4caa0fc18908dd6b429b7149058 100644
--- a/js/app.js
+++ b/js/app.js
@@ -1,70 +1,75 @@
 import { World, Studio, pitchProject } from "./sim.js";
 import { renderMarket, renderStudio, renderPlayer, logLine } from "./ui.js";
 import { defaultPlayer, loadPlayer, savePlayer, editPlayerDialog } from "./player.js";
 
 // ------- Simple studio persistence (localStorage) -------
 const STUDIO_KEY = "hl.studio";
 function saveStudio(studio) { localStorage.setItem(STUDIO_KEY, JSON.stringify(studio)); }
 function loadStudio() {
   const raw = localStorage.getItem(STUDIO_KEY);
   if (!raw) return null;
   try {
     const s = JSON.parse(raw);
     // naive shape keep
     return Object.assign(new Studio({ id: s.id, name: s.name, funds: s.funds }), s);
   } catch {
     return null;
   }
 }
 
 // ------- Init -------
 const world = new World();
 let studio = loadStudio();
 let player = loadPlayer() || defaultPlayer();
+if (studio && player.studioId !== studio.id) {
+  player.studioId = studio.id;
+}
 savePlayer(player); // ensure saved at least once
 
 // ------- DOM refs -------
 const newStudioBtn  = document.getElementById("newStudioBtn");
 const pitchBtn      = document.getElementById("pitchBtn");
 const editPlayerBtn = document.getElementById("editPlayerBtn");
 
 // ------- UI update -------
 function updateUI() {
   renderMarket(world.tick, world.market);
   renderStudio(studio);
   renderPlayer(player);
   pitchBtn.disabled = !studio;
 }
 updateUI();
 
 // ------- Actions -------
 newStudioBtn.addEventListener("click", () => {
   const name = prompt("Studio name?", "Silver Oak Pictures");
   if (!name) return;
   studio = new Studio({ id: crypto.randomUUID(), name, funds: 500_000 });
   saveStudio(studio);
+  player.studioId = studio.id;
+  savePlayer(player);
   logLine(`🎬 Created studio: ${name}`);
   updateUI();
 });
 
 pitchBtn.addEventListener("click", () => {
   const result = pitchProject(world, studio, player);
   if (!result.ok) { logLine(`⚠️ ${result.msg}`); return; }
   saveStudio(studio);
   if (result.success) {
     logLine(`✅ GREENLIT (${(result.successChance*100)|0}%): "${result.title}" ${result.genre} | Cost $${result.cost.toLocaleString()} → Revenue $${result.revenue.toLocaleString()}`);
     // light progression: success nudges fame/rep upward
     player.fame = Math.min(100, player.fame + 1);
     player.rep  = Math.min(100, player.rep + 1);
   } else {
     logLine(`❌ PASSED (${(result.successChance*100)|0}%): "${result.title}" ${result.genre} | Burned $${result.cost.toLocaleString()}`);
     // failures add a bit of stress
     player.stress = Math.min(100, player.stress + 2);
   }
   savePlayer(player);
   updateUI();
 });
 
 editPlayerBtn.addEventListener("click", () => {
   const edited = editPlayerDialog(player);
   if (!edited) return;
 
EOF
)
