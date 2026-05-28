"use client";

import Link from "next/link";
import { useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { PathMap } from "@/components/curriculum/PathMap";
import { useProgress } from "@/hooks/useProgress";
import { MODULES } from "@/data/curriculum";
import { MAX_XP } from "@/lib/xp";
import {
  ArrowRight, Zap, Layers, Hash, Triangle, Network,
  GitBranch, ScanLine, GitMerge, Cpu,
} from "lucide-react";
import { motion } from "framer-motion";

const ICONS: Record<string, React.ElementType> = {
  Layers, Hash, Triangle, Network, GitBranch, ScanLine, Zap, GitMerge, Cpu,
};

const MODULE_COLORS = [
  "#7c6af7", "#22d3ee", "#f59e0b", "#10b981",
  "#9585ff", "#22d3ee", "#f87171", "#f59e0b",
];

// ─── Reusable fade-in wrapper ──────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Challenge card mockup ─────────────────────────────────────────────────
function ChallengeCardMockup() {
  return (
    <div style={{ position: "relative" }}>
      {/* Glow behind card */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-40px",
          background: "radial-gradient(ellipse at center, rgba(124,106,247,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 0 0 1px rgba(124,106,247,0.12), 0 32px 80px rgba(0,0,0,0.7)",
          position: "relative",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "var(--color-bg-elevated)",
            borderBottom: "1px solid var(--color-border-subtle)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-text-tertiary)",
            }}
          >
            <span>Module 1</span>
            <span>&nbsp;/&nbsp;</span>
            <span style={{ color: "var(--color-text-secondary)" }}>Vectors &amp; Embeddings</span>
            <span>&nbsp;/&nbsp;</span>
            <span style={{ color: "var(--color-text-secondary)" }}>Ch 1.2</span>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: "100px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--color-xp)",
            }}
          >
            ⚡ +75 XP
          </div>
        </div>

        {/* Title block */}
        <div style={{ padding: "16px 16px 0" }}>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "4px",
            }}
          >
            Cosine Similarity Search
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-text-secondary)",
              lineHeight: 1.5,
              marginBottom: "14px",
            }}
          >
            Core to every embedding-based retrieval system — semantic search, RAG pipelines,
            recommendation engines.
          </p>
        </div>

        {/* Code block */}
        <div
          style={{
            background: "#080a11",
            borderTop: "1px solid var(--color-border-subtle)",
            borderBottom: "1px solid var(--color-border-subtle)",
            fontFamily: "var(--font-mono)",
            fontSize: "12.5px",
            lineHeight: 1.75,
            padding: "14px 0",
          }}
        >
          {[
            [<><span style={{ color: "#c792ea" }}>import</span> numpy <span style={{ color: "#c792ea" }}>as</span> np</>, "1"],
            [<>&nbsp;</>, "2"],
            [<><span style={{ color: "#c792ea" }}>def</span> <span style={{ color: "#22d3ee" }}>cosine_similarity</span>(<span style={{ color: "#f78c6c" }}>a</span>: np.ndarray, <span style={{ color: "#f78c6c" }}>b</span>: np.ndarray) -&gt; <span style={{ color: "#9585ff" }}>float</span>:</>, "3"],
            [<>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#445060", fontStyle: "italic" }}># Embedding retrieval: find nearest neighbor</span></>, "4"],
            [<>&nbsp;&nbsp;&nbsp;&nbsp;dot = np.<span style={{ color: "#22d3ee" }}>dot</span>(<span style={{ color: "#f78c6c" }}>a</span>, <span style={{ color: "#f78c6c" }}>b</span>)</>, "5"],
            [<>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#c792ea" }}>return</span> dot / (np.<span style={{ color: "#22d3ee" }}>linalg</span>.<span style={{ color: "#22d3ee" }}>norm</span>(<span style={{ color: "#f78c6c" }}>a</span>) * np.<span style={{ color: "#22d3ee" }}>linalg</span>.<span style={{ color: "#22d3ee" }}>norm</span>(<span style={{ color: "#f78c6c" }}>b</span>))</>, "6"],
          ].map(([code, ln], i) => (
            <div key={i} style={{ display: "flex", padding: "0 14px" }}>
              <span
                style={{
                  color: "var(--color-text-tertiary)",
                  width: "20px",
                  textAlign: "right",
                  marginRight: "14px",
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                {ln}
              </span>
              <span style={{ flex: 1 }}>{code}</span>
            </div>
          ))}
        </div>

        {/* Run bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "var(--color-bg-elevated)",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-text-tertiary)" }}>
            ⌘ Enter to run
          </span>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              background: "var(--color-accent)",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ▶ Run Tests
          </button>
        </div>

        {/* Test results */}
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            ["identical vectors → ", "1.0"],
            ["orthogonal vectors → ", "0.0"],
            ["nearest neighbor search: ", "correct"],
            ["10 k embeddings searched in ", "18 ms"],
          ].map(([label, val], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "9px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
              <div
                style={{
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(16,185,129,0.15)",
                  color: "var(--color-success)",
                  fontSize: "9px",
                }}
              >
                ✓
              </div>
              <span style={{ color: "var(--color-text-secondary)" }}>
                {label}<em style={{ fontStyle: "normal", color: "var(--color-text-primary)" }}>{val}</em>
              </span>
            </div>
          ))}
        </div>

        {/* XP banner */}
        <div
          style={{
            margin: "4px 16px 14px",
            padding: "9px 14px",
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.18)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--color-xp)",
          }}
        >
          ⚡ All tests passed — +75 XP earned
        </div>
      </motion.div>
    </div>
  );
}

// ─── Landing page ──────────────────────────────────────────────────────────
function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const curriculumRef = useRef<HTMLElement>(null);

  function scrollToCurriculum() {
    curriculumRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ background: "var(--color-bg)" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "100px 48px 80px",
          position: "relative",
          overflow: "hidden",
          backgroundImage: `
            radial-gradient(circle at 70% 40%, rgba(124,106,247,0.10) 0%, transparent 55%),
            radial-gradient(circle at 20% 80%, rgba(34,211,238,0.05) 0%, transparent 50%)
          `,
        }}
      >
        {/* Dot grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 520px",
            gap: "72px",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Left: headline */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 14px",
                background: "rgba(124,106,247,0.1)",
                border: "1px solid rgba(124,106,247,0.3)",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--color-accent)",
                marginBottom: "28px",
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "6px",
                  height: "6px",
                  background: "var(--color-accent)",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
              Python in the browser · No installs · XP-gated progression
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 5vw, 4.25rem)",
                fontWeight: 800,
                lineHeight: 1.03,
                letterSpacing: "-0.035em",
                marginBottom: "24px",
              }}
            >
              The algorithms<br />
              powering{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, var(--color-accent) 0%, var(--color-cyan) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI.
              </span>
              <br />
              Finally, a course<br />
              that shows you why.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              style={{
                fontSize: "18px",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                maxWidth: "480px",
                marginBottom: "40px",
              }}
            >
              Not &ldquo;implement a hash map&rdquo; —{" "}
              <strong style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                &ldquo;build the token lookup table that powers a tokenizer.&rdquo;
              </strong>{" "}
              Every algorithm is taught through the AI system where it actually lives.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "52px" }}
            >
              <button
                onClick={signInWithGoogle}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 600,
                  background: "var(--color-accent)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 24px rgba(124,106,247,0.35)",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 36px rgba(124,106,247,0.5)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-accent)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(124,106,247,0.35)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                Start Learning Free &nbsp;→
              </button>
              <button
                onClick={scrollToCurriculum}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 600,
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-bg-card)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                }}
              >
                Browse Curriculum
              </button>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              {[
                { val: "8", label: "modules" },
                { val: "24", label: "challenges" },
                { val: "2,500", label: "total XP" },
                { val: "< 6h", label: "to complete" },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    paddingRight: i < 3 ? "28px" : 0,
                    marginRight: i < 3 ? "28px" : 0,
                    borderRight: i < 3 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "26px",
                      fontWeight: 800,
                      color: "var(--color-text-primary)",
                      lineHeight: 1,
                    }}
                  >
                    {m.val}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    {m.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: challenge card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChallengeCardMockup />
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-bg-secondary)",
          borderTop: "1px solid var(--color-border-subtle)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {[
            { n: "8", label: "focused modules", color: "var(--color-accent)" },
            { n: "24", label: "coding challenges", color: "var(--color-text-primary)" },
            { n: "2,500", label: "total XP to earn", color: "var(--color-xp)" },
            { n: "< 6 hrs", label: "to complete the course", color: "var(--color-cyan)" },
          ].map((s, i) => (
            <FadeIn
              key={i}
              delay={i * 0.07}
            >
              <div
                style={{
                  padding: "36px 48px",
                  borderRight: i < 3 ? "1px solid var(--color-border-subtle)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "42px",
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: "6px",
                    color: s.color,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── REFRAME ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <FadeIn>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "16px",
              }}
            >
              <span style={{ width: "14px", height: "2px", background: "var(--color-accent)", display: "inline-block" }} />
              The difference
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                marginBottom: "14px",
              }}
            >
              Not textbook DSA.<br />AI engineering DSA.
            </h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: "540px" }}>
              Every algorithm is grounded in where it actually lives — in production AI systems you can name.
            </p>
          </FadeIn>

          <div style={{ marginTop: "56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Traditional */}
            <FadeIn delay={0.1}>
              <div
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  padding: "32px",
                  height: "100%",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "24px",
                    background: "rgba(52,61,79,0.5)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  Traditional DSA course
                </span>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    "\"Implement a hash map from scratch\"",
                    "\"Sort this array of integers\"",
                    "\"Traverse a binary tree in-order\"",
                    "\"Find the shortest path in a graph\"",
                    "\"Compute edit distance between strings\"",
                  ].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", lineHeight: 1.55, color: "var(--color-text-tertiary)" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          marginTop: "1px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--color-text-tertiary)",
                          color: "#09090e",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        ✕
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* DSA for AI */}
            <FadeIn delay={0.18}>
              <div
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid rgba(124,106,247,0.25)",
                  borderRadius: "16px",
                  padding: "32px",
                  height: "100%",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "24px",
                    background: "rgba(124,106,247,0.12)",
                    border: "1px solid rgba(124,106,247,0.3)",
                    color: "var(--color-accent)",
                  }}
                >
                  DSA for AI
                </span>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    "Build the token lookup table that powers a tokenizer",
                    "Implement quickselect to rank beam search candidates",
                    "Build a decision tree that classifies embeddings",
                    "Run BFS on a knowledge graph for multi-hop reasoning",
                    "Use edit distance for fuzzy matching in RAG retrieval",
                  ].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", lineHeight: 1.55, color: "var(--color-text-primary)" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          marginTop: "1px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--color-accent)",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ───────────────────────────────────────────────────── */}
      <section
        ref={curriculumRef}
        id="curriculum"
        style={{ padding: "100px 48px", background: "var(--color-bg-secondary)" }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <FadeIn>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "16px",
              }}
            >
              <span style={{ width: "14px", height: "2px", background: "var(--color-accent)", display: "inline-block" }} />
              Curriculum
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                marginBottom: "14px",
              }}
            >
              8 modules. Zero filler.
            </h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: "540px" }}>
              Sequential, XP-gated. Each module unlocks the next. Complete the course in one focused sitting.
            </p>
          </FadeIn>

          <div
            style={{
              marginTop: "56px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "14px",
            }}
          >
            {MODULES.map((mod, i) => {
              const Icon = ICONS[mod.icon] ?? Layers;
              const color = MODULE_COLORS[i] ?? "var(--color-accent)";
              return (
                <FadeIn key={mod.id} delay={0.05 + (i % 4) * 0.07}>
                  <div
                    style={{
                      background: "var(--color-bg-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "14px",
                      padding: "22px",
                      cursor: "default",
                      transition: "background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                      position: "relative",
                      overflow: "hidden",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "var(--color-bg-card-hover)";
                      el.style.borderColor = "rgba(124,106,247,0.4)";
                      el.style.transform = "translateY(-3px)";
                      el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.5)";
                      const bar = el.querySelector(".mod-bar") as HTMLElement | null;
                      if (bar) bar.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "var(--color-bg-card)";
                      el.style.borderColor = "var(--color-border)";
                      el.style.transform = "";
                      el.style.boxShadow = "";
                      const bar = el.querySelector(".mod-bar") as HTMLElement | null;
                      if (bar) bar.style.opacity = "0";
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      className="mod-bar"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "linear-gradient(90deg, var(--color-accent), var(--color-cyan))",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "var(--color-text-tertiary)",
                        marginBottom: "14px",
                      }}
                    >
                      {String(mod.order + 1).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "14px",
                        background: `${color}1a`,
                        color,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.3,
                        marginBottom: "8px",
                      }}
                    >
                      {mod.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.55,
                        marginBottom: "18px",
                      }}
                    >
                      {mod.description}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid var(--color-border-subtle)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                      }}
                    >
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {mod.challenges.length} challenges
                      </span>
                      <span style={{ color: "var(--color-text-tertiary)" }}>
                        {mod.estimatedMinutes} min
                      </span>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <FadeIn>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "16px",
              }}
            >
              <span style={{ width: "14px", height: "2px", background: "var(--color-accent)", display: "inline-block" }} />
              How it works
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                marginBottom: "14px",
              }}
            >
              Write code.<br />See it run. Earn XP.
            </h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: "540px" }}>
              No installs, no environment setup — open a tab and start coding immediately.
            </p>
          </FadeIn>

          <div style={{ marginTop: "64px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {[
              {
                n: "01",
                title: "Read the AI framing",
                desc: "Each challenge opens with the real AI system it connects to. You understand why the algorithm matters before you write a single line.",
              },
              {
                n: "02",
                title: "Write Python in the browser",
                desc: (
                  <>
                    A full Python runtime (<code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "1px 6px", color: "var(--color-cyan)" }}>Pyodide WASM</code>) runs directly in your tab. No notebooks, no terminal — just a code editor and instant feedback.
                  </>
                ),
              },
              {
                n: "03",
                title: "Pass tests. Earn XP. Unlock next.",
                desc: "Tests run in milliseconds. Pass all tests to earn XP and unlock the next challenge. Your mastery is tracked across all 8 modules.",
              },
            ].map((step, i) => (
              <FadeIn key={i} delay={0.05 + i * 0.1}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "80px",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "var(--color-border)",
                      marginBottom: "20px",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.n}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "var(--color-text-primary)",
                      marginBottom: "12px",
                    }}
                  >
                    {step.title}
                  </div>
                  <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            height: "500px",
            background: "radial-gradient(ellipse, rgba(124,106,247,0.11) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "620px", margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.07,
                letterSpacing: "-0.025em",
                marginBottom: "18px",
              }}
            >
              Start building.<br />
              <span
                style={{
                  background: "linear-gradient(120deg, var(--color-accent) 0%, var(--color-cyan) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                In under 6 hours.
              </span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "40px" }}>
              24 real coding challenges. Python in your browser. Algorithms that actually matter for AI engineering.
            </p>
          </FadeIn>
          <FadeIn delay={0.14}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
              <button
                onClick={signInWithGoogle}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 600,
                  background: "var(--color-accent)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 24px rgba(124,106,247,0.35)",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 36px rgba(124,106,247,0.5)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-accent)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(124,106,247,0.35)";
                  (e.currentTarget as HTMLElement).style.transform = "";
                }}
              >
                Start Learning Free &nbsp;→
              </button>
              <button
                onClick={scrollToCurriculum}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  fontWeight: 600,
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-bg-card)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                }}
              >
                Browse Curriculum
              </button>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--color-text-tertiary)" }}>
              No account required to try. Sign in with Google to save progress.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "var(--color-bg-secondary)",
          borderTop: "1px solid var(--color-border-subtle)",
          padding: "28px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              background: "var(--color-accent)",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: 800,
              color: "#fff",
              fontFamily: "var(--font-mono)",
            }}
          >
            Σ
          </div>
          DSA for AI
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
          A focused, challenge-driven course for AI engineers. &copy; 2026
        </p>
      </footer>
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
