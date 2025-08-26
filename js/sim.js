// Simulation core (client-only for now). Later we’ll move this to a server.
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
    this.id = id; this.name = name; this.funds = funds;
    this.projects = [];
  }
}

export function pitchProject(world, studio) {
  // Super-simple: cost depends on “demand”; success chance scales with demand.
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const demand = world.market[genre];
  const cost = Math.round(50_000 * demand);
  if (studio.funds < cost) {
    return { ok: false, msg: `Not enough funds. Need $${cost.toLocaleString()}` };
  }
  studio.funds -= cost;
  const success = Math.random() < (0.45 + (demand - 1.0) * 0.35); // ~25–65%
  const title = generateTitle(genre);
  const revenue = success ? Math.round(cost * (1.2 + Math.random() * 2.2)) : 0;
  if (success) studio.funds += revenue;
  const result = { ok: true, success, genre, cost, revenue, title };
  studio.projects.push(result);
  return result;
}

function generateTitle(genre) {
  const a = ["Silver", "Shadow", "Neon", "Golden", "Hidden", "Last", "Crimson"];
  const b = ["Dream", "City", "Echo", "Voyage", "Secret", "Frontier", "Promise"];
  return `${a[Math.floor(Math.random()*a.length)]} ${b[Math.floor(Math.random()*b.length)]} (${genre})`;
}
