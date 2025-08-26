// Player profile model + persistence
const STORAGE_KEY = "hl.player";

export const CAREERS = ["Producer", "Director", "Writer", "Agent", "Executive"];

export function defaultPlayer() {
  return {
    id: crypto.randomUUID(),
    name: "New Player",
    career: "Producer",
    fame: 0,
    rep: 10,
    funds: 250_000,  // personal bankroll (separate from studio cash)
    energy: 100,
    stress: 10,
    skills: {
      negotiation: 40,
      taste: 45,
      vision: 35,
      logistics: 40,
      pr: 30
    },
    perks: [],
    flaws: []
  };
}

export function loadPlayer() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
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

// Simple prompt-based editor (can be replaced with a modal later)
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
