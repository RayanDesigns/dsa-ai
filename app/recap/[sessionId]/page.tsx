"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProgressStore } from "@/store/progress";
import { getAllChallenges, MODULES } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { ArrowRight, CheckCircle2, Zap, Clock, Home } from "lucide-react";

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return value;
}

export default function RecapPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId: paramId } = use(params);
  const { progress } = useProgressStore();
  const { getFirstIncompleteChallenge } = useProgress();

  const session = progress?.sessions.find((s) => s.id === paramId);
  const allChallenges = getAllChallenges();

  const completedThisSession = session
    ? session.completedChallengeIds.map((id) => allChallenges.find((c) => c.id === id)).filter(Boolean)
    : [];

  const xpEarned = session?.xpEarned ?? 0;
  const xpDisplay = useCountUp(xpEarned);

  const durationMin =
    session && session.endedAt
      ? Math.max(1, Math.round((session.endedAt - session.startedAt) / 60000))
      : 0;

  const next = getFirstIncompleteChallenge();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Trophy animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-6xl"
      >
        🏆
      </motion.div>

      <div>
        <h1 className="font-display text-4xl font-bold text-[var(--color-text-primary)] mb-2">
          Session Complete!
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Great work. Your progress is saved.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Zap className="text-amber-400 mx-auto mb-2" size={20} />
          <div className="text-2xl font-bold font-mono text-amber-400">{xpDisplay}</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">XP earned</div>
        </div>
        <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-4">
          <CheckCircle2 className="text-[var(--color-accent)] mx-auto mb-2" size={20} />
          <div className="text-2xl font-bold font-mono text-[var(--color-accent)]">
            {completedThisSession.length}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">Challenges</div>
        </div>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
          <Clock className="text-cyan-400 mx-auto mb-2" size={20} />
          <div className="text-2xl font-bold font-mono text-cyan-400">{durationMin}</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">Minutes</div>
        </div>
      </div>

      {/* Completed challenges */}
      {completedThisSession.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 text-left space-y-2">
          <h2 className="font-display font-semibold text-[var(--color-text-primary)] text-sm mb-3">
            Completed this session
          </h2>
          {completedThisSession.map((c) => c && (
            <div key={c.id} className="flex items-center gap-3 text-sm">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span className="text-[var(--color-text-secondary)] flex-1">{c.title}</span>
              <span className="text-amber-400 text-xs font-mono">+{c.xpReward} XP</span>
            </div>
          ))}
        </div>
      )}

      {/* Total XP */}
      {progress && (
        <div className="text-sm text-[var(--color-text-secondary)]">
          Total XP:{" "}
          <span className="text-amber-400 font-mono font-bold">{progress.totalXP}</span>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {next && (
          <Link
            href={`/challenge/${next.challenge.slug}`}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium transition-colors"
          >
            Continue Learning
            <ArrowRight size={16} />
          </Link>
        )}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40 transition-colors"
        >
          <Home size={16} />
          Learning Path
        </Link>
      </div>
    </div>
  );
}
