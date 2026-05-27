import type { Module } from "@/types";

export function isModuleUnlocked(
  moduleIndex: number,
  completedIds: string[],
  modules: Module[]
): boolean {
  if (moduleIndex === 0) return true;
  const prev = modules[moduleIndex - 1];
  return prev.challenges.every((c) => completedIds.includes(c.id));
}

export const XP_LEVELS = [0, 250, 600, 1100, 1800, 2550];
export const MAX_XP = 2550;

export function getLevel(xp: number): number {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i]) return i;
  }
  return 0;
}

export function getLevelProgress(xp: number): { level: number; current: number; next: number; pct: number } {
  const level = getLevel(xp);
  const current = XP_LEVELS[level] ?? 0;
  const next = XP_LEVELS[level + 1] ?? MAX_XP;
  const pct = Math.min(((xp - current) / (next - current)) * 100, 100);
  return { level, current, next, pct };
}
