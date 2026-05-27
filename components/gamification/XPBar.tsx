"use client";
import { motion } from "framer-motion";
import { getLevelProgress } from "@/lib/xp";

export function XPBar({ xp }: { xp: number }) {
  const { level, pct, next, current } = getLevelProgress(xp);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-nowrap">
        Lv.{level}
      </span>
      <div className="relative h-2 w-32 rounded-full bg-[var(--color-border)] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-xp)] to-amber-300"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-nowrap">
        {xp}/{next} XP
      </span>
    </div>
  );
}
