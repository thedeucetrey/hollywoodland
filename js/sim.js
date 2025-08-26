// Simulation core (client-only right now). Later we can move this to a server.

export const GENRES = ["ACTION","DRAMA","COMEDY","HORROR","SCIFI","ROMANCE","THRILLER","ANIMATION"];

export class World {
  constructor() {
    this.tick = 0;
    this.market = Object.fromEntries(GENRES.map(g => [g, 1.0]));
  }
  step() {
    this.tick++;
    for (const g of GENRES) {
      const delta = (Math.random() - 0.5) * 0.08; // gentle random walk
      this.market[g] = Math.max(0.5, Math.min(1.6, this.market[g] + delta));
    }
  }
}

export class Studio {
  constructor({ id, name, funds = 500_000 }) {
    this.id = id;
    this.name = name;
    this.funds = funds;
    this.projects = [];
  }
}

/**
 * Pitch a project. Player skills matter:
 * - negotiation: reduces cost (max ~20% reduction at 100)
 * - taste: increases success chance (+/- ~15% across 0–100)
 * The market demand of the chosen genre affects both cost & success.
 */
export function pitchProject(world, studio, player) {
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const demand = world.market[genre];

  // Cost base + market factor
  const baseCost = 50_000;
  const marketCost = baseCost * demand;

  // Player negotiation reduces cost up to ~20%
  const negotiation = clamp01((player?.skills?.negotiation ?? 40) / 100);
  const costReduction = 0.2 * negotiation; // 0–0.2
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

function generateTitle(genre) {
  const a = ["Silver", "Shadow", "Neon", "Golden", "Hidden", "Last", "Crimson"];
  const b = ["Dream", "City", "Echo", "Voyage", "Secret", "Frontier", "Promise"];
  return `${a[Math.floor(Math.random()*a.length)]} ${b[Math.floor(Math.random()*b.length)]} (${genre})`;
}

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

