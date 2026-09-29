import { UfoState, Speed } from "../types";

/* ============ 1. PIXEL-STEP MOTION (engine/ufoMotion.ts) ============ */
// Positions are in DESIGN PIXELS on a fixed 1010x577 stage that is scaled with CSS,
// so "1 px" means the exact same thing on every device.
export const STAGE = { w: 1010, h: 577 };
export const COLUMNS_X = [96, 303, 505, 707, 914];
export const SPAWN_Y = 80; // top spawn line
export const DANGER_Y = 360; // ships stop here (ship bottom touches 440px red danger line)
export const STAGGER = [17, 0, 29, 58, 35]; // only for the very first set of 5 ships

export const STEP: Record<Speed, { px: number; ms: number }> = {
  slow: { px: 0.3, ms: 100 }, // 5 px/s    -> ~41 s to land
  normal: { px: 0.5, ms: 70 }, // ~7 px/s   -> ~29 s to land (class 3 default)
  fast: { px: 1, ms: 70 }, // ~14 px/s  -> ~14 s to land
};

// call every animation frame. acc is a ref-like {current:number}.
export function stepUfos(
  ufos: UfoState[],
  acc: { current: number },
  dtMs: number,
  speed: Speed,
): UfoState[] {
  acc.current += Math.min(dtMs, 100); // clamp: a background tab can never cause a jump
  const { px, ms } = STEP[speed];
  const steps = Math.floor(acc.current / ms);
  if (!steps) return ufos;
  acc.current -= steps * ms;
  return ufos.map((u) =>
    u.status === "flying"
      ? { ...u, y: Math.min(u.y + steps * px, DANGER_Y) }
      : u,
  );
}

// Wave has landed when every flying ship currently on screen has reached the danger line
export const waveLanded = (ufos: UfoState[]) => {
  const flying = ufos.filter((u) => u.status === "flying");
  return flying.length > 0 && flying.every((u) => u.y >= DANGER_Y);
};

// Warning cue: true when any flying ship is within 70px of the danger line
export const isNearDanger = (ufos: UfoState[]) => {
  return ufos.some((u) => u.status === "flying" && u.y >= DANGER_Y - 70);
};

// straight-up shot: the flying ship whose column overlaps the turret (within 86px)
export function ufoAbove(turretX: number, ufos: UfoState[]) {
  return ufos
    .filter((u) => u.status === "flying" && Math.abs(u.x - turretX) <= 86)
    .sort((p, q) => q.y - p.y)[0];
}

/* ============ 2. SHIPS PERSIST AFTER A HIT ============ */
// After ANY shot only the shot ship is removed. The other ships keep their exact position.
// Correct hit -> pick the NEW target from the ships already on screen, then spawn ONE replacement on top.
export function pickNextTarget(
  remaining: UfoState[],
  prevTarget: number,
): number | null {
  const count = new Map<number, number>();
  remaining
    .filter((u) => u.status === "flying")
    .forEach((u) => count.set(u.a + u.b, (count.get(u.a + u.b) ?? 0) + 1));
  const unique = [...count]
    .filter(([s, c]) => c === 1 && s !== prevTarget)
    .map(([s]) => s);
  return unique.length
    ? unique[Math.floor(Math.random() * unique.length)]
    : null;
}
