import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { UserProgress, Session, ModuleProgress } from "@/types";
import { MODULES } from "@/data/curriculum";

export async function getProgress(uid: string): Promise<UserProgress | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProgress;
}

export function createDefaultProgress(uid: string): UserProgress {
  const moduleProgress: Record<string, ModuleProgress> = {};
  for (const m of MODULES) {
    moduleProgress[m.id] = {
      moduleId: m.id,
      completedCount: 0,
      totalCount: m.challenges.length,
      earnedXP: 0,
    };
  }
  return {
    uid,
    totalXP: 0,
    completedChallenges: [],
    moduleProgress,
    solutions: {},
    sessions: [],
    lastActiveAt: Date.now(),
    streakDays: 0,
  };
}

export async function saveProgress(uid: string, progress: UserProgress): Promise<void> {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { ...progress, lastActiveAt: Date.now() }, { merge: true });
}

export async function markChallengeComplete(
  uid: string,
  challengeId: string,
  moduleId: string,
  xpReward: number,
  progress: UserProgress
): Promise<UserProgress> {
  if (progress.completedChallenges.includes(challengeId)) return progress;

  const updatedChallenges = [...progress.completedChallenges, challengeId];
  const moduleProg = { ...progress.moduleProgress[moduleId] };
  moduleProg.completedCount += 1;
  moduleProg.earnedXP += xpReward;

  if (moduleProg.completedCount >= moduleProg.totalCount) {
    moduleProg.completedAt = Date.now();
  }

  const updated: UserProgress = {
    ...progress,
    totalXP: progress.totalXP + xpReward,
    completedChallenges: updatedChallenges,
    moduleProgress: {
      ...progress.moduleProgress,
      [moduleId]: moduleProg,
    },
  };

  await saveProgress(uid, updated);
  return updated;
}
