"use client";
import { useProgressStore } from "@/store/progress";
import { MODULES } from "@/data/curriculum";
import { isModuleUnlocked } from "@/lib/xp";

export function useProgress() {
  const { progress, addCompletedChallenge } = useProgressStore();

  const isCompleted = (challengeId: string) =>
    progress?.completedChallenges.includes(challengeId) ?? false;

  const isModuleComplete = (moduleId: string) => {
    if (!progress) return false;
    const mp = progress.moduleProgress[moduleId];
    return mp ? mp.completedCount >= mp.totalCount : false;
  };

  const canAccessModule = (moduleIndex: number) =>
    isModuleUnlocked(moduleIndex, progress?.completedChallenges ?? [], MODULES);

  const getFirstIncompleteChallenge = () => {
    for (let mi = 0; mi < MODULES.length; mi++) {
      if (!canAccessModule(mi)) break;
      const m = MODULES[mi];
      for (const c of m.challenges) {
        if (!isCompleted(c.id)) return { module: m, challenge: c };
      }
    }
    return null;
  };

  return {
    progress,
    isCompleted,
    isModuleComplete,
    canAccessModule,
    getFirstIncompleteChallenge,
    addCompletedChallenge,
  };
}
