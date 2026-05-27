export type Difficulty = "easy" | "medium" | "hard";

export interface TestCase {
  id: string;
  description: string;
  callExpression: string;
  expectedOutput: string;
}

export interface Hint {
  order: number;
  text: string;
}

export interface Challenge {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpReward: number;
  aiContext: string;
  conceptHook: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  hints: Hint[];
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  aiContext: string;
  icon: string;
  accentColor: string;
  order: number;
  challenges: Challenge[];
  totalXP: number;
  estimatedMinutes: number;
}

export interface ModuleProgress {
  moduleId: string;
  completedCount: number;
  totalCount: number;
  earnedXP: number;
  completedAt?: number;
}

export interface Session {
  id: string;
  startedAt: number;
  endedAt: number;
  completedChallengeIds: string[];
  xpEarned: number;
}

export interface UserProgress {
  uid: string;
  totalXP: number;
  completedChallenges: string[];
  moduleProgress: Record<string, ModuleProgress>;
  sessions: Session[];
  lastActiveAt: number;
  streakDays: number;
}
