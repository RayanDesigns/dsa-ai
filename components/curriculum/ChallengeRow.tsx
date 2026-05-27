"use client";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, Lock } from "lucide-react";
import type { Challenge } from "@/types";
import { DifficultyBadge, XPBadge } from "@/components/ui/Badge";

interface Props {
  challenge: Challenge;
  isCompleted: boolean;
  isLocked: boolean;
  index?: number;
}

export function ChallengeRow({ challenge, isCompleted, isLocked, index = 0 }: Props) {
  const inner = (
    <div
      className={`
        challenge-row-active animate-fade-in-up
        flex items-center gap-4 px-4 py-3.5 rounded-xl border
        transition-all duration-200
        ${isLocked
          ? "border-[var(--color-border-subtle)] opacity-35 cursor-not-allowed"
          : isCompleted
          ? "border-emerald-500/20 cursor-pointer hover:border-emerald-500/35"
          : "border-[var(--color-border)] cursor-pointer hover:border-[var(--color-accent)]/35 hover:bg-[var(--color-bg-elevated)]"
        }
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        background: isCompleted ? "rgba(16,185,129,0.04)" : "rgba(19,22,31,0.8)",
      }}
    >
      {/* Status icon */}
      <div className="shrink-0 w-5 flex items-center justify-center">
        {isLocked ? (
          <Lock size={15} style={{ color: "var(--color-text-tertiary)" }} />
        ) : isCompleted ? (
          <CheckCircle2 size={17} style={{ color: "#10b981" }} />
        ) : (
          <Circle size={16} style={{ color: "var(--color-text-tertiary)", strokeWidth: 1.5 }} />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="font-medium truncate leading-snug"
          style={{
            color: isCompleted ? "#eceef4" : "var(--color-text-primary)",
            fontSize: "14px",
          }}
        >
          {challenge.title}
        </p>
        <p
          className="text-xs mt-0.5 line-clamp-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {challenge.conceptHook}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 shrink-0">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <XPBadge xp={challenge.xpReward} />
        <div
          className="hidden sm:flex items-center gap-1 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
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
