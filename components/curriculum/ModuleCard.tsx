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
  index?: number;
}

export function ModuleCard({ module, completedCount, isUnlocked, isCurrent, index = 0 }: Props) {
  const Icon = ICONS[module.icon] ?? Layers;
  const total = module.challenges.length;
  const pct = total > 0 ? (completedCount / total) * 100 : 0;
  const isComplete = completedCount >= total;

  const accentRgb = hexToRgb(module.accentColor);

  const cardContent = (
    <div
      className={`
        relative rounded-2xl border p-5 overflow-hidden
        animate-fade-in-up
        ${!isUnlocked
          ? "border-[var(--color-border-subtle)] opacity-35 cursor-not-allowed"
          : isCurrent
          ? "cursor-pointer card-hover"
          : isComplete
          ? "border-emerald-500/30 bg-[var(--color-bg-elevated)] cursor-pointer card-hover"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] cursor-pointer card-hover"
        }
      `}
      style={{
        animationDelay: `${index * 55}ms`,
        ...(isUnlocked && !isCurrent && !isComplete ? {
          backgroundColor: "#13161f",
        } : {}),
        ...(isCurrent ? {
          border: `1px solid ${module.accentColor}60`,
          background: `linear-gradient(135deg, ${accentRgb ? `rgba(${accentRgb},0.06)` : "rgba(124,106,247,0.06)"} 0%, #13161f 60%)`,
          boxShadow: `0 0 0 1px ${module.accentColor}30, 0 8px 32px ${module.accentColor}14`,
        } : {}),
        ...(isComplete ? {
          boxShadow: "0 4px 20px rgba(16,185,129,0.08)",
        } : {}),
      }}
      onMouseEnter={(e) => {
        if (!isUnlocked) return;
        const el = e.currentTarget as HTMLElement;
        if (isCurrent) {
          el.style.boxShadow = `0 0 0 1px ${module.accentColor}50, 0 12px 40px ${module.accentColor}22`;
        } else if (isComplete) {
          el.style.boxShadow = "0 8px 32px rgba(16,185,129,0.14)";
          el.style.borderColor = "rgba(16,185,129,0.45)";
        } else {
          el.style.boxShadow = `0 8px 32px ${module.accentColor}12`;
          el.style.borderColor = `${module.accentColor}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isUnlocked) return;
        const el = e.currentTarget as HTMLElement;
        if (isCurrent) {
          el.style.boxShadow = `0 0 0 1px ${module.accentColor}30, 0 8px 32px ${module.accentColor}14`;
        } else if (isComplete) {
          el.style.boxShadow = "0 4px 20px rgba(16,185,129,0.08)";
          el.style.borderColor = "rgba(16,185,129,0.3)";
        } else {
          el.style.boxShadow = "";
          el.style.borderColor = "";
        }
      }}
    >
      {/* Subtle top gradient line for current */}
      {isCurrent && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${module.accentColor}80, transparent)` }}
        />
      )}

      {/* Status icon */}
      <div className="absolute top-4 right-4">
        {!isUnlocked ? (
          <Lock size={14} style={{ color: "var(--color-text-tertiary)" }} />
        ) : isComplete ? (
          <CheckCircle2 size={17} className="animate-check-pop text-emerald-400" style={{ color: "#10b981" }} />
        ) : null}
      </div>

      {/* Module icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{
          backgroundColor: `${module.accentColor}18`,
          color: module.accentColor,
          boxShadow: isCurrent ? `0 0 16px ${module.accentColor}25` : undefined,
        }}
      >
        <Icon size={20} />
      </div>

      {/* Title + description */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            M{module.order + 1}
          </span>
          {isCurrent && !isComplete && (
            <span
              className="badge-current text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide"
              style={{
                background: `${module.accentColor}20`,
                color: module.accentColor,
                border: `1px solid ${module.accentColor}30`,
              }}
            >
              ACTIVE
            </span>
          )}
          {isComplete && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>
              DONE
            </span>
          )}
        </div>
        <h3
          className="font-display font-semibold leading-snug mb-1"
          style={{ color: "var(--color-text-primary)", fontSize: "15px" }}
        >
          {module.title}
        </h3>
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {module.description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between" style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
          <span>{completedCount}/{total} challenges</span>
          <span>{module.estimatedMinutes} min</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--color-border)" }}
        >
          <div
            className={pct > 0 && pct < 100 ? "h-full rounded-full shimmer" : "h-full rounded-full"}
            style={{
              width: `${pct}%`,
              background: isComplete
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : `linear-gradient(90deg, ${module.accentColor}, ${lightenHex(module.accentColor)})`,
              transition: "width 0.8s cubic-bezier(0.34, 1.1, 0.64, 1)",
              boxShadow: pct > 0 ? `0 0 8px ${module.accentColor}50` : undefined,
            }}
          />
        </div>
      </div>

      {/* XP */}
      <div
        className="mt-3 flex items-center gap-1 text-[11px] font-mono font-medium"
        style={{ color: "#f59e0b" }}
      >
        <span style={{ opacity: 0.7 }}>⚡</span>
        {module.totalXP} XP
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

function hexToRgb(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : null;
}

function lightenHex(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = Math.min(255, parseInt(result[1], 16) + 40);
  const g = Math.min(255, parseInt(result[2], 16) + 40);
  const b = Math.min(255, parseInt(result[3], 16) + 40);
  return `rgb(${r},${g},${b})`;
}
