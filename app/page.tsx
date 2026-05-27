"use client";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PathMap } from "@/components/curriculum/PathMap";
import { useProgress } from "@/hooks/useProgress";
import { MODULES } from "@/data/curriculum";
import { MAX_XP } from "@/lib/xp";
import { ArrowRight, Zap, Clock, Code2 } from "lucide-react";

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium">
          <Zap size={14} />
          DSA for AI Engineering
        </div>

        <div>
          <h1 className="font-display text-5xl font-bold text-[var(--color-text-primary)] leading-tight mb-4">
            Master the algorithms
            <br />
            <span className="text-[var(--color-accent)]">behind every AI system</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-lg mx-auto">
            8 modules. 24 challenges. Real Python execution.
            Every algorithm explained through the lens of AI engineering.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Clock size={15} className="text-[var(--color-accent)]" />
            <span>≤ 6 hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Code2 size={15} className="text-[var(--color-accent)]" />
            <span>Python in browser</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={15} className="text-amber-400" />
            <span>{MAX_XP} XP total</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <GoogleSignInButton />
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Progress saved across devices
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-8 max-w-lg mx-auto">
          {MODULES.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 text-center"
            >
              <div className="text-xs text-[var(--color-text-secondary)] leading-tight">{m.title}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)]">+ 4 more modules</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { getFirstIncompleteChallenge, progress } = useProgress();
  const next = getFirstIncompleteChallenge();
  const totalCompleted = progress?.completedChallenges.length ?? 0;
  const totalChallenges = MODULES.reduce((sum, m) => sum + m.challenges.length, 0);
  const overallPct = Math.round((totalCompleted / totalChallenges) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
            Your Learning Path
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {totalCompleted}/{totalChallenges} challenges · {overallPct}% complete
          </p>
        </div>

        {next && (
          <Link
            href={`/challenge/${next.challenge.slug}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium text-sm transition-colors shrink-0"
          >
            Continue
            <ArrowRight size={16} />
          </Link>
        )}
        {!next && totalCompleted > 0 && (
          <div className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium text-sm border border-emerald-500/30">
            Path Complete! 🎉
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--color-text-secondary)]">Overall progress</span>
          <span className="text-[var(--color-text-primary)] font-medium">{overallPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-cyan-400 transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--color-text-tertiary)] mt-1.5">
          <span>{progress?.totalXP ?? 0} XP earned</span>
          <span>{MAX_XP} XP total</span>
        </div>
      </div>

      <PathMap />
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <Dashboard /> : <LandingPage />;
}
