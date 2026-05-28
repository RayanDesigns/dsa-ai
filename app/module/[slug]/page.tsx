"use client";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
      <div
        className="flex items-center justify-center min-h-[60vh] text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
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
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm transition-colors duration-150"
          style={{ color: "var(--color-text-tertiary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
        >
          <ArrowLeft size={13} />
          Learning Path
        </Link>
      </motion.div>

      {/* Module hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 overflow-hidden relative"
        style={{
          border: `1px solid ${module.accentColor}30`,
          background: `linear-gradient(160deg, ${module.accentColor}08 0%, #0f1018 55%)`,
          boxShadow: "var(--shadow-m)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${module.accentColor}70 50%, transparent 100%)`,
          }}
        />

        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${module.accentColor}14`,
              color: module.accentColor,
              boxShadow: "var(--shadow-xs)",
              border: `1px solid ${module.accentColor}22`,
            }}
          >
            <Icon size={22} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Module {module.order + 1}
              </span>
            </div>
            <h1
              className="font-display font-bold mb-2"
              style={{
                fontSize: "1.4rem",
                letterSpacing: "-0.015em",
                color: "var(--color-text-primary)",
              }}
            >
              {module.title}
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {module.aiContext}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center gap-6 mt-5 pt-4 text-sm"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="flex items-center gap-1.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <Clock size={13} />
            {module.estimatedMinutes} min
          </div>
          <div
            className="flex items-center gap-1 text-sm font-mono"
            style={{ color: "#f59e0b" }}
          >
            <span style={{ opacity: 0.7 }}>⚡</span>
            {module.totalXP} XP
          </div>
          <div style={{ color: "var(--color-text-secondary)" }}>
            {completedCount}/{total} completed
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(0,0,0,0.3)", boxShadow: "var(--shadow-inset)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${module.accentColor} 0%, ${module.accentColor}cc 100%)`,
                boxShadow: `0 0 8px ${module.accentColor}50`,
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.34, 1.1, 0.64, 1] }}
            />
          </div>
        </div>
      </motion.div>

      {/* Challenge list */}
      <div
        className="space-y-2 rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "var(--shadow-s)" }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display font-semibold mb-3"
          style={{ color: "var(--color-text-primary)", fontSize: "15px" }}
        >
          Challenges
        </motion.h2>
        {module.challenges.map((challenge, idx) => {
          const prevCompleted = idx === 0 || isCompleted(module.challenges[idx - 1].id);
          const isLocked = !isUnlocked || (idx > 0 && !prevCompleted);

          return (
            <ChallengeRow
              key={challenge.id}
              challenge={challenge}
              isCompleted={isCompleted(challenge.id)}
              isLocked={isLocked}
              index={idx}
            />
          );
        })}
      </div>

      {/* Start CTA */}
      {isUnlocked && completedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href={`/challenge/${module.challenges[0].slug}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: "#a4abbe",
              color: "#07070d",
              boxShadow: "var(--shadow-m)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLElement).style.background = "#b8c0d4";
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-l)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.background = "#a4abbe";
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-m)";
            }}
          >
            Start Module
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      )}

      {/* Module navigation */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        {prevModule ? (
          <Link
            href={`/module/${prevModule.slug}`}
            className="flex items-center gap-1 text-sm transition-colors duration-150"
            style={{ color: "var(--color-text-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
          >
            <ArrowLeft size={13} />
            {prevModule.title}
          </Link>
        ) : (
          <div />
        )}
        {nextModule && (
          <Link
            href={`/module/${nextModule.slug}`}
            className="flex items-center gap-1 text-sm transition-colors duration-150"
            style={{ color: "var(--color-text-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
          >
            {nextModule.title}
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}
