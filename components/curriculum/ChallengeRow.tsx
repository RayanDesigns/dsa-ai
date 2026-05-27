"use client";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, Lock } from "lucide-react";
import type { Challenge } from "@/types";
import { DifficultyBadge, XPBadge } from "@/components/ui/Badge";

interface Props {
  challenge: Challenge;
  isCompleted: boolean;
  isLocked: boolean;
}

export function ChallengeRow({ challenge, isCompleted, isLocked }: Props) {
  const inner = (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 ${
        isLocked
          ? "border-[var(--color-border-subtle)] opacity-40 cursor-not-allowed"
          : isCompleted
          ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 cursor-pointer"
          : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg-card-hover)] cursor-pointer"
      }`}
    >
      {/* Status icon */}
      <div className="shrink-0">
        {isLocked ? (
          <Lock size={18} className="text-[var(--color-text-tertiary)]" />
        ) : isCompleted ? (
          <CheckCircle2 size={18} className="text-emerald-400" />
        ) : (
          <Circle size={18} className="text-[var(--color-text-tertiary)]" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--color-text-primary)] truncate">{challenge.title}</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-1">
          {challenge.conceptHook}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 shrink-0">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <XPBadge xp={challenge.xpReward} />
        <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
          <Clock size={11} />
          {challenge.estimatedMinutes}m
        </div>
      </div>
    </div>
  );

  if (isLocked) return inner;

  return (
    <Link href={`/challenge/${challenge.slug}`} className="block">
      {inner}
    </Link>
  );
}
