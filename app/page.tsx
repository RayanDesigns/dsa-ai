"use client";

import Link from "next/link";
import Image from "next/image";
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


// ─── Hero backdrop: concentric rings + horizon glow (from Figma source) ─────
function HeroOrb() {
  // Three concentric discs lit from the top, fading downward — matches the
  // source's Ellipse 4/5/7 stack (radii 534 / 381 / 286, #888 → transparent).
  const rings = [
    { d: 1068 },
    { d: 762 },
    { d: 573 },
  ];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Faint starfield */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(1px 1px at 20% 22%, rgba(255,255,255,0.35), transparent), radial-gradient(1px 1px at 68% 14%, rgba(255,255,255,0.25), transparent), radial-gradient(1px 1px at 82% 30%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 38% 40%, rgba(255,255,255,0.18), transparent), radial-gradient(1px 1px at 12% 46%, rgba(255,255,255,0.22), transparent), radial-gradient(1px 1px at 90% 50%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 55% 26%, rgba(255,255,255,0.22), transparent)",
          opacity: 0.55,
          mixBlendMode: "plus-lighter",
        }}
      />

      {/* Concentric rings, centered where the product mockup rises */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "560px",
          transform: "translateX(-50%)",
          mixBlendMode: "plus-lighter",
        }}
      >
        {rings.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: `${r.d}px`,
              height: `${r.d}px`,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background:
                "linear-gradient(to bottom, rgba(150,158,180,0.55) 0%, rgba(150,158,180,0) 50%)",
              opacity: 0.16,
            }}
          />
        ))}
      </div>

      {/* Blurred white horizon bar where the dashboard top sits */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "600px",
          transform: "translateX(-50%)",
          width: "620px",
          height: "60px",
          background: "#ffffff",
          borderRadius: "50%",
          filter: "blur(60px)",
          opacity: 0.22,
          mixBlendMode: "plus-lighter",
        }}
      />

      {/* Soft ambient pool behind the headline */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "820px",
          height: "440px",
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(150,158,180,0.08) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "140px 24px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glowing orb / horizon backdrop */}
        <HeroOrb />

        <div
          style={{
            maxWidth: "880px",
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              marginBottom: "32px",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "5px",
                height: "5px",
                background: "var(--color-text-secondary)",
                borderRadius: "50%",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            Python in the browser · No installs · XP-gated progression
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 5.2vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              marginBottom: "26px",
            }}
          >
            The smarter way to learn{" "}
            <br className="hero-br" />
            the algorithms behind{" "}
            <span
              style={{
                background: "linear-gradient(118deg, #d0d4e4 0%, #707080 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            style={{
              fontSize: "17px",
              lineHeight: 1.72,
              color: "var(--color-text-secondary)",
              maxWidth: "540px",
              margin: "0 auto 40px",
            }}
          >
            Not &ldquo;implement a hash map&rdquo; —{" "}
            <strong style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
              build the token lookup table that powers a tokenizer.
            </strong>{" "}
            24 challenges grounded in the AI systems where they live.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "26px",
            }}
          >
            <button onClick={signInWithGoogle} className="btn-light">
              Start for free &nbsp;→
            </button>
            <button onClick={scrollToCurriculum} className="btn-ghost">
              Browse Curriculum
            </button>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
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
                  gap: "3px",
                  alignItems: "center",
                  paddingRight: i < 3 ? "28px" : 0,
                  marginRight: i < 3 ? "28px" : 0,
                  borderRight: i < 3 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "var(--color-text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {m.val}
                </span>
                <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Product mockup — rises into the glow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: "1000px",
            width: "100%",
            margin: "64px auto 0",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Show the top ~half, fade the cut edge into the next section */}
          <div
            style={{
              width: "100%",
              aspectRatio: "2000 / 700",
              overflow: "hidden",
              maskImage:
                "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
            }}
          >
            <Image
              src="/hero-dashboard.png"
              alt="DSA for AI challenge workspace — problem statement beside an in-browser Python editor"
              width={2000}
              height={1440}
              priority
              sizes="(max-width: 1040px) 100vw, 1000px"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── THE DIFFERENCE ───────────────────────────────────────────────── */}
      <section id="difference" style={{ padding: "120px 48px", background: "var(--color-bg-secondary)" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <FadeIn>
            <p className="eyebrow">The difference</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
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
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: "520px", marginBottom: "52px" }}>
              Every algorithm is grounded in where it actually lives — in production AI systems you can name.
            </p>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Left: Traditional — visually suppressed */}
            <FadeIn delay={0.1}>
              <div
                style={{
                  background: "rgba(14,16,24,0.6)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: "16px",
                  padding: "32px",
                  height: "100%",
                  opacity: 0.75,
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
                    background: "rgba(28,32,51,0.8)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  Conventional DSA course
                </span>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    "\"Implement a hash map from scratch\"",
                    "\"Sort this array of integers\"",
                    "\"Traverse a binary tree in-order\"",
                    "\"Find the shortest path in a graph\"",
                    "\"Compute edit distance between strings\"",
                  ].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "13.5px",
                        lineHeight: 1.55,
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          marginTop: "3px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: "rgba(52,61,79,0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "8px",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Right: DSA for AI — elevated */}
            <FadeIn delay={0.18}>
              <div
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "32px",
                  height: "100%",
                  boxShadow: "var(--shadow-m)",
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
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  DSA for AI Engineering
                </span>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    "Build the token lookup table that powers a tokenizer",
                    "Implement quickselect to rank beam search candidates",
                    "Build a decision tree that classifies embeddings",
                    "Run BFS on a knowledge graph for multi-hop reasoning",
                    "Use edit distance for fuzzy matching in RAG retrieval",
                  ].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "13.5px",
                        lineHeight: 1.55,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          marginTop: "3px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "8px",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        ✓
                      </span>
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
        style={{ padding: "120px 48px" }}
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <FadeIn>
            <p className="eyebrow">Curriculum</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
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
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: "500px", marginBottom: "52px" }}>
              Sequential, XP-gated. Each module unlocks the next.
            </p>
          </FadeIn>

          {/* Module list */}
          <FadeIn delay={0.1}>
            <div
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "var(--shadow-s)",
              }}
            >
              {MODULES.map((mod, i) => {
                const Icon = ICONS[mod.icon] ?? Layers;
                const color = MODULE_COLORS[i] ?? "var(--color-accent)";
                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="mod-row"
                    style={{
                      borderBottom: i < MODULES.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
                      borderLeft: `2px solid ${color}`,
                    }}
                  >
                    {/* Number */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 600,
                        color,
                        width: "20px",
                        flexShrink: 0,
                        opacity: 0.85,
                      }}
                    >
                      {String(mod.order + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `${color}18`,
                        color,
                      }}
                    >
                      <Icon size={15} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--color-text-primary)",
                          marginBottom: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {mod.title}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.5,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {mod.description}
                      </div>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flexShrink: 0,
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
                  </motion.div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" style={{ padding: "120px 48px", background: "var(--color-bg-secondary)" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <FadeIn>
            <p className="eyebrow">How it works</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                marginBottom: "14px",
              }}
            >
              Write code. See it run.<br />Earn XP.
            </h2>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: "520px" }}>
              No installs, no environment setup — open a tab and start coding immediately.
            </p>
          </FadeIn>

          {/* Steps */}
          <div style={{ marginTop: "72px", position: "relative" }}>
            {/* Horizontal connector line */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "19px",
                left: "calc(16.67% + 19px)",
                right: "calc(16.67% + 19px)",
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--color-border) 15%, var(--color-border) 85%, transparent)",
                pointerEvents: "none",
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
              {[
                {
                  title: "Read the AI framing",
                  desc: "Each challenge opens with the real AI system it connects to. You understand why the algorithm matters before writing a line.",
                },
                {
                  title: "Write Python in the browser",
                  desc: (
                    <>
                      A full Python runtime ({" "}
                      <code
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          background: "rgba(19,22,31,0.9)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "4px",
                          padding: "1px 6px",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        Pyodide WASM
                      </code>
                      {" "}) runs in your tab. No notebooks, no terminal.
                    </>
                  ),
                },
                {
                  title: "Pass tests. Earn XP. Unlock next.",
                  desc: "Tests run in milliseconds. Pass all tests to earn XP and unlock the next challenge. Mastery tracked across all 8 modules.",
                },
              ].map((step, i) => (
                <FadeIn key={i} delay={0.08 + i * 0.1}>
                  <div>
                    {/* Step circle */}
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                        marginBottom: "28px",
                        position: "relative",
                        zIndex: 1,
                        boxShadow: "var(--shadow-s)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "19px",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        marginBottom: "10px",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.title}
                    </div>
                    <p style={{ fontSize: "14.5px", color: "var(--color-text-secondary)", lineHeight: 1.72 }}>
                      {step.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "140px 48px",
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
            width: "800px",
            height: "480px",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "560px", margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.07,
                letterSpacing: "-0.025em",
                marginBottom: "20px",
              }}
            >
              Start building.{" "}
              <span
                style={{
                  background: "linear-gradient(118deg, #d0d4e4 0%, #707080 100%)",
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
            <p style={{ fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: "44px" }}>
              24 real coding challenges. Python in your browser. Algorithms that actually matter for AI engineering.
            </p>
          </FadeIn>
          <FadeIn delay={0.14}>
            <button onClick={signInWithGoogle} className="btn-primary" style={{ fontSize: "16px", padding: "15px 32px" }}>
              Start Learning Free &nbsp;→
            </button>
          </FadeIn>
          <FadeIn delay={0.22}>
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
          <span className="logo-mark" aria-hidden>
            <span className="logo-mark-outer" />
            <span className="logo-mark-inner" />
          </span>
          DSA AI
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
            className="btn-primary animate-pulse-ring shrink-0"
            style={{ fontSize: "14px", padding: "10px 20px" }}
          >
            Continue
            <ArrowRight size={14} />
          </Link>
        )}
        {!next && totalCompleted > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-5 py-2.5 rounded-xl font-medium text-sm"
            style={{
              background: "rgba(16,185,129,0.08)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            Path Complete!
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
          background: "var(--color-bg-card)",
          boxShadow: "var(--shadow-s)",
        }}
      >
        <div className="flex justify-between text-sm mb-3">
          <span style={{ color: "var(--color-text-secondary)" }}>Overall progress</span>
          <span
            className="font-semibold font-mono"
            style={{ color: "var(--color-text-primary)" }}
          >
            {overallPct}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "var(--color-border)" }}
        >
          <motion.div
            className="h-full rounded-full shimmer"
            style={{
              background: "linear-gradient(90deg, #a4abbe 0%, #606070 100%)",
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
          className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{
            borderColor: "var(--color-border)",
            borderTopColor: "var(--color-accent)",
          }}
        />
      </div>
    );
  }

  return user ? <Dashboard /> : <LandingPage />;
}
