"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PathMap } from "@/components/curriculum/PathMap";
import { useProgress } from "@/hooks/useProgress";
import { MODULES } from "@/data/curriculum";
import { MAX_XP } from "@/lib/xp";
import {
  ArrowRight, Zap, Clock, Code2,
  Layers, Hash, Triangle, Network, GitBranch,
  ScanLine, GitMerge, Cpu,
} from "lucide-react";
import { motion } from "framer-motion";

const ICONS: Record<string, React.ElementType> = {
  Layers, Hash, Triangle, Network, GitBranch, ScanLine, Zap, GitMerge,
};

// ─── Module tile (Linear-style card) ──────────────────────────────────────
function ModuleTile({
  module,
  index,
}: {
  module: (typeof MODULES)[number];
  index: number;
}) {
  const Icon = ICONS[module.icon] ?? Layers;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.55 + index * 0.05, ease: [0.25, 1, 0.5, 1] }}
      className="group p-4 rounded-xl"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.025)",
        transition: "border-color 0.18s ease, background 0.18s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${module.accentColor}40`;
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
      }}
    >
      {/* Icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center mb-3"
        style={{
          background: `${module.accentColor}18`,
          color: module.accentColor,
        }}
      >
        <Icon size={13} />
      </div>
      {/* Label */}
      <p
        className="font-mono mb-1"
        style={{ fontSize: "9px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}
      >
        M{module.order + 1}
      </p>
      <h3
        className="font-semibold leading-snug"
        style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.88)" }}
      >
        {module.title}
      </h3>
      <p
        className="mt-1"
        style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}
      >
        {module.challenges.length} challenges
      </p>
    </motion.div>
  );
}

// ─── Landing (logged out) ──────────────────────────────────────────────────
function LandingPage() {
  return (
    <div style={{ background: "#09090e", minHeight: "100vh" }}>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "92vh", padding: "0 24px" }}
      >
        {/* Grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Spotlight — top-center radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "600px",
            background: "radial-gradient(ellipse at 50% 0%, rgba(124,106,247,0.14) 0%, rgba(124,106,247,0.04) 45%, transparent 70%)",
          }}
        />

        {/* Fade-out vignette at bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "200px",
            background: "linear-gradient(to bottom, transparent, #09090e)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl w-full" style={{ gap: "28px" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.01em",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#7c6af7" }}
            />
            8 modules · 24 challenges · ~6 hours
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.07 }}
            className="font-display font-bold leading-[1.02]"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.6rem)",
              letterSpacing: "-0.04em",
              color: "#ffffff",
            }}
          >
            Master the algorithms<br />
            <span style={{ color: "rgba(255,255,255,0.38)" }}>every AI engineer needs.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            style={{
              fontSize: "16px",
              lineHeight: "1.65",
              color: "rgba(255,255,255,0.44)",
              maxWidth: "420px",
            }}
          >
            Real Python execution, zero setup. Every data structure and
            algorithm explained through the lens of AI engineering.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-col items-center gap-2.5"
          >
            <GoogleSignInButton />
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.01em" }}>
              Progress saved · Free to start
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-8"
            style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.3)" }}
          >
            <span className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: "rgba(124,106,247,0.65)" }} />
              ≤ 6 hours
            </span>
            <span
              className="block h-3.5 w-px"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            <span className="flex items-center gap-1.5">
              <Code2 size={12} style={{ color: "rgba(124,106,247,0.65)" }} />
              Python in browser
            </span>
            <span
              className="block h-3.5 w-px"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            <span className="flex items-center gap-1.5">
              <Zap size={12} style={{ color: "rgba(245,158,11,0.65)" }} />
              {MAX_XP} XP total
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* ── Modules section ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6" style={{ padding: "80px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <p
            className="font-mono uppercase mb-3"
            style={{ fontSize: "10px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)" }}
          >
            Curriculum
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Eight modules. Every algorithm that matters.
          </h2>
        </motion.div>

        <div className="grid grid-cols-4 gap-3" style={{ gridTemplateRows: "auto auto" }}>
          {MODULES.map((m, i) => (
            <ModuleTile key={m.id} module={m} index={i} />
          ))}
        </div>
      </section>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      {/* ── Feature strip ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto" style={{ padding: "72px 24px" }}>
        <div className="grid grid-cols-3 gap-px" style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}>
          {[
            {
              Icon: Code2,
              title: "Python runs here",
              desc: "Pyodide WASM runtime. No installs, no servers. Your code executes instantly in the browser.",
              color: "#7c6af7",
            },
            {
              Icon: Cpu,
              title: "Every algo in AI context",
              desc: "Hash tables power embedding lookups. Trees structure RAG. You'll understand the why, not just the how.",
              color: "#22d3ee",
            },
            {
              Icon: Zap,
              title: "XP-gated progression",
              desc: "Complete challenges to unlock the next module. Mastery gates advancement — no skipping ahead.",
              color: "#f59e0b",
            },
          ].map(({ Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="p-8"
              style={{ background: "rgba(255,255,255,0.015)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${color}14`, color }}
              >
                <Icon size={16} />
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ fontSize: "14px", color: "rgba(255,255,255,0.88)", letterSpacing: "-0.01em" }}
              >
                {title}
              </h3>
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.38)" }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      <div className="flex items-center justify-center" style={{ padding: "28px 24px" }}>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
          DSA for AI Engineering
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard (logged in) ─────────────────────────────────────────────────
function Dashboard() {
  const { getFirstIncompleteChallenge, progress } = useProgress();
  const next = getFirstIncompleteChallenge();
  const totalCompleted = progress?.completedChallenges.length ?? 0;
  const totalChallenges = MODULES.reduce((sum, m) => sum + m.challenges.length, 0);
  const overallPct = Math.round((totalCompleted / totalChallenges) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: "1.75rem",
              letterSpacing: "-0.025em",
              color: "var(--color-text-primary)",
            }}
          >
            Your Learning Path
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {totalCompleted}/{totalChallenges} challenges completed
          </p>
        </div>

        {next && (
          <Link
            href={`/challenge/${next.challenge.slug}`}
            className="animate-pulse-ring flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c6af7 0%, #9585ff 100%)",
              boxShadow: "0 4px 20px rgba(124,106,247,0.35)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(124,106,247,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(124,106,247,0.35)";
            }}
          >
            Continue
            <ArrowRight size={15} />
          </Link>
        )}
        {!next && totalCompleted > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-5 py-2.5 rounded-xl font-medium text-sm"
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            Path Complete! 🎉
          </motion.div>
        )}
      </motion.div>

      {/* Progress overview */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="rounded-2xl border p-5"
        style={{
          border: "1px solid var(--color-border)",
          background: "linear-gradient(135deg, rgba(19,22,31,0.9) 0%, rgba(13,16,24,0.9) 100%)",
        }}
      >
        <div className="flex justify-between text-sm mb-2.5">
          <span style={{ color: "var(--color-text-secondary)" }}>Overall progress</span>
          <span
            className="font-semibold font-mono"
            style={{ color: "var(--color-text-primary)" }}
          >
            {overallPct}%
          </span>
        </div>
        <div
          className="h-2.5 rounded-full overflow-hidden shimmer"
          style={{ background: "var(--color-border)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--color-accent) 0%, #22d3ee 100%)",
              boxShadow: "0 0 12px rgba(124,106,247,0.4)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: [0.34, 1.1, 0.64, 1] }}
          />
        </div>
        <div
          className="flex justify-between mt-2"
          style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}
        >
          <span>{progress?.totalXP ?? 0} XP earned</span>
          <span>{MAX_XP} XP total</span>
        </div>
      </motion.div>

      {/* Module grid */}
      <PathMap />
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────
export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{
            borderColor: "rgba(124,106,247,0.3)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  return user ? <Dashboard /> : <LandingPage />;
}
