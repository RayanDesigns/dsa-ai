"use client";
import { motion } from "framer-motion";
import { getLevelProgress } from "@/lib/xp";

export function XPBar({ xp }: { xp: number }) {
  const { level, pct, next } = getLevelProgress(xp);

  return (
    <div className="flex items-center gap-2.5">
      {/* Level badge */}
      <div
        className="relative flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0.1) 100%)",
          border: "1px solid rgba(245,158,11,0.35)",
          boxShadow: "0 0 12px rgba(245,158,11,0.2)",
        }}
      >
        <span
          className="text-[10px] font-bold font-display leading-none"
          style={{ color: "#f59e0b" }}
        >
          {level}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-1.5 w-28 rounded-full overflow-hidden" style={{ background: "#1c2033" }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full shimmer"
          style={{
            background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 60%, #fde68a 100%)",
            boxShadow: "0 0 8px rgba(245,158,11,0.5)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.1, 0.64, 1] }}
        />
      </div>

      {/* XP count */}
      <span
        className="text-[11px] font-mono whitespace-nowrap tabular-nums"
        style={{ color: "#6b7689" }}
      >
        {xp}<span style={{ color: "#343d4f" }}>/{next}</span>
      </span>
    </div>
  );
}
