"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress } from "@/types";
import { saveProgress } from "@/lib/firestore";

interface ProgressState {
  progress: UserProgress | null;
  sessionId: string | null;
  setProgress: (p: UserProgress) => void;
  addCompletedChallenge: (challengeId: string, moduleId: string, xp: number, solutionCode: string) => void;
  startSession: (id: string) => void;
  clearProgress: () => void;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedSave(uid: string, progress: UserProgress) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => saveProgress(uid, progress).catch(console.warn), 500);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: null,
      sessionId: null,

      setProgress: (p) => set({ progress: p }),

      addCompletedChallenge: (challengeId, moduleId, xp, solutionCode) => {
        const { progress } = get();
        if (!progress) return;
        if (progress.completedChallenges.includes(challengeId)) return;

        const moduleProg = { ...progress.moduleProgress[moduleId] };
        moduleProg.completedCount += 1;
        moduleProg.earnedXP += xp;
        if (moduleProg.completedCount >= moduleProg.totalCount) {
          moduleProg.completedAt = Date.now();
        }

        const updated: UserProgress = {
          ...progress,
          totalXP: progress.totalXP + xp,
          completedChallenges: [...progress.completedChallenges, challengeId],
          moduleProgress: { ...progress.moduleProgress, [moduleId]: moduleProg },
          solutions: { ...(progress.solutions ?? {}), [challengeId]: solutionCode },
          lastActiveAt: Date.now(),
        };

        set({ progress: updated });
        debouncedSave(progress.uid, updated);
      },

      startSession: (id) => set({ sessionId: id }),

      clearProgress: () => set({ progress: null, sessionId: null }),
    }),
    {
      name: "dsa-ai-progress",
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
