"use client";
import Link from "next/link";
import {
  Layers, Hash, Triangle, Network, GitBranch,
  ScanLine, Zap, GitMerge, Lock, CheckCircle2
} from "lucide-react";
import type { Module } from "@/types";

const ICONS: Record<string, React.ElementType> = {
  Layers, Hash, Triangle, Network, GitBranch,
  ScanLine, Zap, GitMerge,
};

interface Props {
  module: Module;
  completedCount: number;
  isUnlocked: boolean;
  isCurrent: boolean;
}

export function ModuleCard({ module, completedCount, isUnlocked, isCurrent }: Props) {
  const Icon = ICONS[module.icon] ?? Layers;
  const total = module.challenges.length;
  const pct = total > 0 ? (completedCount / total) * 100 : 0;
  const isComplete = completedCount >= total;

  const cardContent = (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-200 ${
        !isUnlocked
          ? "border-[var(--color-border-subtle)] opacity-40 cursor-not-allowed"
          : isCurrent
          ? "border-[var(--color-accent)] bg-[var(--color-bg-card)] shadow-lg shadow-[var(--color-accent)]/10 cursor-pointer hover:shadow-[var(--color-accent)]/20"
          : isComplete
          ? "border-emerald-500/40 bg-[var(--color-bg-card)] cursor-pointer hover:border-emerald-500/60"
          : "border-[var(--color-border)] bg-[var(--color-bg-card)] cursor-pointer hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-card-hover)]"
      }`}
    >
      {/* Status icon */}
      <div className="absolute top-4 right-4">
        {!isUnlocked ? (
          <Lock size={16} className="text-[var(--color-text-tertiary)]" />
        ) : isComplete ? (
          <CheckCircle2 size={18} className="text-emerald-400" />
        ) : null}
      </div>

      {/* Module icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${module.accentColor}20`, color: module.accentColor }}
      >
        <Icon size={20} />
      </div>

      {/* Title + description */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-[var(--color-text-tertiary)] font-mono">
            Module {module.order + 1}
          </span>
          {isCurrent && !isComplete && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-medium">
              Current
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold text-[var(--color-text-primary)] leading-tight">
          {module.title}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
          {module.description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
          <span>{completedCount}/{total} challenges</span>
          <span>{module.estimatedMinutes} min</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: isComplete ? "#10b981" : module.accentColor,
            }}
          />
        </div>
      </div>

      {/* XP */}
      <div className="mt-3 text-xs text-amber-400 font-mono">
        ⚡ {module.totalXP} XP
      </div>
    </div>
  );

  if (!isUnlocked) return cardContent;

  return (
    <Link href={`/module/${module.slug}`} className="block">
      {cardContent}
    </Link>
  );
}
