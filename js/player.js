// Player profile model + persistence

const STORAGE_KEY = "hl.player";

export const CAREERS = ["Producer", "Director", "Writer", "Agent", "Executive"];

// Default starting profile
export function defaultPlayer() {
  return {
    id: crypto.randomUUID(),
    name: "New Player",
    career: "Producer",      // one of CAREERS
    fame: 0,                 // public awareness 0–100
    rep: 10,                 // industry reputation 0–100
    funds: 250_000,          // personal bankroll (separate from studio cash)
    energy: 100,             // 0–100 (soft stamina for actions later)
    stress: 10,              // 0–100 (goes up with failures/crunch)
    skills: {                // core knobs that affect outcomes
      negotiation: 40,       // affects deal terms, budgets, packages
      taste: 45,             // affects greenlight quality/box office correlation
      vision: 35,            // elevates prestige/awards potential
      logistics: 40,         // schedules, overages, crew relations
      pr: 30                 // press, hype, damage control
    },
    perks: [],               // e.g., ["Festival Darling", "Data-Driven"]
    flaws: []                // e.g., ["Hot-Headed"]
  };
}

export function loadPlayer() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    // ensure shape (migrate lightly if needed)
    return {
      ...defaultPlayer(),
      ...p,
      skills: { ...defaultPlayer().skills, ...(p.skills || {}) }
    };
  } catch {
    return null;
  }
}

export function savePlayer(player) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}

// Simple editor: returns a new/updated player object
export function editPlayerDialog(player) {
  const name = prompt("Your name:", player.name);
  if (!name) return null;
  const career = prompt(`Career (${CAREERS.join(", ")}):`, player.career);
  if (!career) return null;

  const clamp = (v, a=0, b=100) => Math.max(a, Math.min(b, Number(v)));
  const askNum = (label, val) => {
    const s = prompt(`${label} (0–100):`, String(val));
    if (s === null) return val;
    return clamp(s);
  };

  const skills = { ...player.skills };
  skills.negotiation = askNum("Negotiation", skills.negotiation);
  skills.taste       = askNum("Taste",       skills.taste);
  skills.vision      = askNum("Vision",      skills.vision);
  skills.logistics   = askNum("Logistics",   skills.logistics);
  skills.pr          = askNum("PR",          skills.pr);

  return {
    ...player,
    name,
    career: CAREERS.includes(career) ? career : player.career,
    skills
  };
}
