"use client";
import { use } from "react";
import Link from "next/link";
import {
  Layers, Hash, Triangle, Network, GitBranch,
  ScanLine, Zap, GitMerge, ArrowLeft, ArrowRight, Clock
} from "lucide-react";
import { getModuleBySlug, MODULES } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { ChallengeRow } from "@/components/curriculum/ChallengeRow";

const ICONS: Record<string, React.ElementType> = {
  Layers, Hash, Triangle, Network, GitBranch,
  ScanLine, Zap, GitMerge,
};

export default function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const module = getModuleBySlug(slug);
  const { isCompleted, canAccessModule, progress } = useProgress();

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[var(--color-text-secondary)]">
        Module not found.
      </div>
    );
  }

  const Icon = ICONS[module.icon] ?? Layers;
  const moduleIdx = MODULES.findIndex((m) => m.id === module.id);
  const isUnlocked = canAccessModule(moduleIdx);
  const mp = progress?.moduleProgress[module.id];
  const completedCount = mp?.completedCount ?? 0;
  const total = module.challenges.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const prevModule = moduleIdx > 0 ? MODULES[moduleIdx - 1] : null;
  const nextModule = moduleIdx < MODULES.length - 1 ? MODULES[moduleIdx + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1">
          <ArrowLeft size={14} />
          Learning Path
        </Link>
      </div>

      {/* Module hero */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${module.accentColor}20`, color: module.accentColor }}
          >
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[var(--color-text-tertiary)] font-mono">Module {module.order + 1}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              {module.title}
            </h1>
            <p className="text-[var(--color-text-secondary)]">{module.aiContext}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-5 pt-4 border-t border-[var(--color-border-subtle)] text-sm">
          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <Clock size={14} />
            {module.estimatedMinutes} min
          </div>
          <div className="text-amber-400 flex items-center gap-1">
            ⚡ {module.totalXP} XP
          </div>
          <div className="text-[var(--color-text-secondary)]">
            {completedCount}/{total} completed
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: module.accentColor }}
            />
          </div>
        </div>
      </div>

      {/* Challenge list */}
      <div className="space-y-2">
        <h2 className="font-display font-semibold text-[var(--color-text-primary)]">
          Challenges
        </h2>
        {module.challenges.map((challenge, idx) => {
          const prevCompleted = idx === 0 || isCompleted(module.challenges[idx - 1].id);
          const isLocked = !isUnlocked || (idx > 0 && !prevCompleted);

          return (
            <ChallengeRow
              key={challenge.id}
              challenge={challenge}
              isCompleted={isCompleted(challenge.id)}
              isLocked={isLocked}
            />
          );
        })}
      </div>

      {/* Start CTA */}
      {isUnlocked && completedCount === 0 && (
        <Link
          href={`/challenge/${module.challenges[0].slug}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium transition-colors"
        >
          Start Module
          <ArrowRight size={16} />
        </Link>
      )}

      {/* Module navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
        {prevModule ? (
          <Link
            href={`/module/${prevModule.slug}`}
            className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft size={14} />
            {prevModule.title}
          </Link>
        ) : <div />}

        {nextModule && (
          <Link
            href={`/module/${nextModule.slug}`}
            className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {nextModule.title}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
