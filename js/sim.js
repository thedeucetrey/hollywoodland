 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/js/sim.js b/js/sim.js
index 728135886c8bf5adc8746f2b0b5a540b54f168a4..bfafd074f670e495437af033e15ccf1de9fb8cca 100644
--- a/js/sim.js
+++ b/js/sim.js
@@ -45,33 +45,53 @@ export function pitchProject(world, studio, player) {
   const cost = Math.round(marketCost * (1 - costReduction));
 
   if (studio.funds < cost) {
     return { ok: false, msg: `Not enough funds. Need $${cost.toLocaleString()}` };
   }
   studio.funds -= cost;
 
   // Success chance: baseline + market factor + player taste
   const baseSuccess = 0.45 + (demand - 1.0) * 0.35;
   const taste = clamp01((player?.skills?.taste ?? 45) / 100);
   const tasteBoost = (taste - 0.5) * 0.3; // -0.15..+0.15
   const successChance = clamp01(baseSuccess + tasteBoost);
 
   const success = Math.random() < successChance;
   const title = generateTitle(genre);
 
   // Revenue: success yields 1.2x–3.4x cost, lightly scaled by demand
   const revenue = success ? Math.round(cost * (1.2 + Math.random() * 2.2) * (0.9 + demand * 0.2)) : 0;
   if (success) studio.funds += revenue;
 
   const result = { ok: true, success, genre, cost, revenue, title, successChance: Number(successChance.toFixed(2)) };
   studio.projects.push(result);
   return result;
 }
 
+export function commitCrime(player) {
+  const energyCost = 10;
+  if (player.energy < energyCost) {
+    return { ok: false, msg: `Not enough energy. Need ${energyCost}` };
+  }
+  player.energy -= energyCost;
+  const logistics = clamp01((player?.skills?.logistics ?? 40) / 100);
+  const successChance = clamp01(0.3 + logistics * 0.5);
+  const success = Math.random() < successChance;
+  let reward = 0;
+  if (success) {
+    reward = Math.round(500 + Math.random() * 2500);
+    player.funds = (player.funds ?? 0) + reward;
+    player.rep = Math.min(100, (player.rep ?? 0) + 1);
+  } else {
+    player.stress = Math.min(100, (player.stress ?? 0) + 5);
+  }
+  return { ok: true, success, reward, successChance: Number(successChance.toFixed(2)) };
+}
+
 function generateTitle(genre) {
   const a = ["Silver", "Shadow", "Neon", "Golden", "Hidden", "Last", "Crimson"];
   const b = ["Dream", "City", "Echo", "Voyage", "Secret", "Frontier", "Promise"];
   return `${a[Math.floor(Math.random()*a.length)]} ${b[Math.floor(Math.random()*b.length)]} (${genre})`;
 }
 
 function clamp01(x) { return Math.max(0, Math.min(1, x)); }
 
 
EOF
)
