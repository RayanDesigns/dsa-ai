import type { Session } from "@/types";
import { getAllChallenges } from "@/data/curriculum";

export function createSession(): Session {
  return {
    id: Math.random().toString(36).slice(2),
    startedAt: Date.now(),
    endedAt: 0,
    completedChallengeIds: [],
    xpEarned: 0,
  };
}

export function closeSession(session: Session): Session {
  return { ...session, endedAt: Date.now() };
}

export function getSessionDurationMin(session: Session): number {
  const end = session.endedAt || Date.now();
  return Math.round((end - session.startedAt) / 60000);
}

export function getSessionChallengeDetails(session: Session) {
  const all = getAllChallenges();
  return session.completedChallengeIds
    .map((id) => all.find((c) => c.id === id))
    .filter(Boolean);
}
