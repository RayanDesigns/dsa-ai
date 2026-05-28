"use client";
import { use, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { getChallengeBySlug, MODULES } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { usePyodide } from "@/hooks/usePyodide";
import { buildHarness, parseResults, checkSafety } from "@/lib/test-runner";
import type { TestResult } from "@/lib/test-runner";
import { DifficultyBadge, XPBadge } from "@/components/ui/Badge";
import { TestResultPanel } from "@/components/editor/TestResultPanel";
import { CelebrationOverlay } from "@/components/gamification/CelebrationOverlay";
import {
  ArrowLeft, ArrowRight, Play, Loader2,
  ChevronDown, Clock, CheckCircle2, Brain
} from "lucide-react";
import toast from "react-hot-toast";

const CodeEditor = dynamic(
  () => import("@/components/editor/CodeEditor").then((m) => ({ default: m.CodeEditor })),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-xl border h-[400px] flex items-center justify-center"
        style={{ border: "1px solid var(--color-border)", background: "#1e1e1e" }}
      >
        <Loader2 className="animate-spin" size={22} style={{ color: "var(--color-accent)" }} />
      </div>
    ),
  }
);

// ─── Inline renderer: bold, italic, code, math ────────────────────────────
function renderInline(text: string, key?: string | number): React.ReactNode {
  const segments = text.split(/(\$[^$]+\$|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  if (segments.length === 1) return text;
  return (
    <span key={key}>
      {segments.map((seg, i) => {
        if (seg.startsWith("**") && seg.endsWith("**"))
          return <strong key={i} style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{seg.slice(2, -2)}</strong>;
        if (seg.startsWith("*") && seg.endsWith("*"))
          return <em key={i} style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>{seg.slice(1, -1)}</em>;
        if (seg.startsWith("`") && seg.endsWith("`"))
          return (
            <code key={i} style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              padding: "1px 6px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.4)",
              color: "#9ab0cc",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "var(--shadow-xs)",
            }}>{seg.slice(1, -1)}</code>
          );
        if (seg.startsWith("$") && seg.endsWith("$"))
          return (
            <span key={i} style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12.5px",
              padding: "1px 7px",
              borderRadius: "4px",
              background: "rgba(164,171,190,0.07)",
              color: "#c8d0e8",
              border: "1px solid rgba(164,171,190,0.14)",
              letterSpacing: "0.01em",
              fontStyle: "italic",
            }}>{seg.slice(1, -1)}</span>
          );
        return seg;
      })}
    </span>
  );
}

// ─── Markdown block renderer ───────────────────────────────────────────────
function MarkdownBlock({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const codeStr = codeLines.join("\n").trimEnd();
      const looksLikeMath = !lang && /[=≤≥∈∑∏√⁰¹²³⁴⁵⁶⁷⁸⁹]|[a-z]\[|\/\(|\|\||\.\.\./.test(codeStr);
      blocks.push(
        <div
          key={key++}
          style={{
            margin: "12px 0",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "var(--shadow-s)",
          }}
        >
          {(lang || looksLikeMath) && (
            <div style={{
              padding: "5px 14px 4px",
              background: "rgba(0,0,0,0.3)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-text-tertiary)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              {looksLikeMath ? "formula" : lang}
            </div>
          )}
          <pre style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            lineHeight: 1.7,
            padding: "12px 16px",
            background: looksLikeMath ? "rgba(164,171,190,0.04)" : "rgba(0,0,0,0.28)",
            color: looksLikeMath ? "#c8d0e8" : "#a8b8c8",
            overflowX: "auto",
            whiteSpace: "pre",
            margin: 0,
          }}>{codeStr}</pre>
        </div>
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} style={{
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.01em",
          margin: "20px 0 8px",
          paddingBottom: "6px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>{line.slice(3)}</h2>
      );
      i++; continue;
    }

    // H3
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          margin: "16px 0 6px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>{line.slice(4)}</h3>
      );
      i++; continue;
    }

    // Bullet list — collect consecutive items
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} style={{ margin: "8px 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              <span style={{
                flexShrink: 0,
                marginTop: "6px",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(164,171,190,0.45)",
              }} />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Divider
    if (line.trim() === "---") {
      blocks.push(<hr key={key++} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "14px 0" }} />);
      i++; continue;
    }

    // Empty line → spacer
    if (line.trim() === "") {
      i++; continue;
    }

    // Paragraph
    blocks.push(
      <p key={key++} style={{ fontSize: "13.5px", lineHeight: 1.72, color: "var(--color-text-secondary)", margin: "6px 0" }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {blocks}
    </div>
  );
}

export default function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const challenge = getChallengeBySlug(slug);
  const { isCompleted, addCompletedChallenge, getSolution } = useProgress();
  const { ready: pyReady, loading: pyLoading, runCode } = usePyodide();

  const savedSolution = challenge ? getSolution(challenge.id) : null;
  const [code, setCode] = useState(savedSolution ?? challenge?.starterCode ?? "");
  const solutionRestored = useRef(false);
  useEffect(() => {
    if (!solutionRestored.current && savedSolution) {
      setCode(savedSolution);
      solutionRestored.current = true;
    }
  }, [savedSolution]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState("");
  const [runError, setRunError] = useState<string | undefined>();
  const [showCelebration, setShowCelebration] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [justPassed, setJustPassed] = useState(false);
  const [xpJustEarned, setXpJustEarned] = useState(false);
  const runBtnRef = useRef<HTMLButtonElement>(null);

  if (!challenge) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh] text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Challenge not found.
      </div>
    );
  }

  const alreadyCompleted = isCompleted(challenge.id);
  const allChallenges = MODULES.flatMap((m) => m.challenges);
  const currentIdx = allChallenges.findIndex((c) => c.slug === slug);
  const prevChallenge = currentIdx > 0 ? allChallenges[currentIdx - 1] : null;
  const nextChallenge = currentIdx < allChallenges.length - 1 ? allChallenges[currentIdx + 1] : null;
  const parentModule = MODULES.find((m) => m.id === challenge.moduleId);

  const handleRun = useCallback(async () => {
    if (!pyReady) return;

    const safetyError = checkSafety(code);
    if (safetyError) {
      toast.error(safetyError);
      return;
    }

    setRunning(true);
    setResults([]);
    setRunError(undefined);
    setStdout("");
    setJustPassed(false);
    setXpJustEarned(false);

    const harness = buildHarness(code, challenge.testCases);
    const runPromise = runCode(harness);
    const timeoutPromise = new Promise<{ output: string; error?: string }>((_, reject) =>
      setTimeout(() => reject(new Error("Execution timed out (10s)")), 10_000)
    );

    try {
      const { output, error } = await Promise.race([runPromise, timeoutPromise]);

      if (error && !output) {
        setRunError(error);
        setRunning(false);
        return;
      }

      const parsed = parseResults(output, challenge.testCases);
      setResults(parsed.results);
      setStdout(parsed.stdout);
      if (error) setRunError(error);

      if (parsed.allPassed && !alreadyCompleted) {
        setJustPassed(true);
        setXpJustEarned(true);
        addCompletedChallenge(challenge.id, challenge.moduleId, challenge.xpReward, code);
        setShowCelebration(true);
      } else if (parsed.allPassed && alreadyCompleted) {
        setJustPassed(true);
      }
    } catch (err) {
      setRunError(err instanceof Error ? err.message : String(err));
    }

    setRunning(false);
  }, [pyReady, code, challenge, alreadyCompleted, addCompletedChallenge, nextChallenge, router, runCode]);

  const revealHint = (order: number) => {
    setRevealedHints((prev) => [...prev, order]);
  };

  return (
    <>
      <CelebrationOverlay
        show={showCelebration}
        xpEarned={challenge.xpReward}
        challengeTitle={challenge.title}
        nextChallenge={nextChallenge}
        onDismiss={() => setShowCelebration(false)}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 text-sm mb-6"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          <Link
            href="/"
            className="transition-colors duration-150 hover:text-[var(--color-text-secondary)]"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/module/${challenge.moduleId}`}
            className="transition-colors duration-150 hover:text-[var(--color-text-secondary)]"
            style={{ color: parentModule?.accentColor ? `${parentModule.accentColor}cc` : undefined }}
          >
            {parentModule?.title}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-text-secondary)" }}>{challenge.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left: Problem ──────────────────────────── */}
          <div className="space-y-4">
            {/* Header card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border p-5"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0f1018", boxShadow: "var(--shadow-m)" }}
            >
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <DifficultyBadge difficulty={challenge.difficulty} />
                <XPBadge xp={challenge.xpReward} />
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <Clock size={11} />
                  {challenge.estimatedMinutes} min
                </div>
                {(alreadyCompleted || justPassed) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: "#10b981" }}
                  >
                    <CheckCircle2 size={12} />
                    Solved
                  </motion.div>
                )}
              </div>
              <h1
                className="font-display font-bold mb-4"
                style={{
                  fontSize: "1.2rem",
                  letterSpacing: "-0.01em",
                  color: "var(--color-text-primary)",
                }}
              >
                {challenge.title}
              </h1>

              {/* AI context callout */}
              <div
                className="rounded-xl p-3.5"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                  boxShadow: "var(--shadow-s)",
                }}
              >
                <p
                  className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Brain size={12} />
                  Why this matters in AI
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {challenge.aiContext}
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-2xl border p-5"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0f1018", boxShadow: "var(--shadow-m)" }}
            >
              <MarkdownBlock content={challenge.description} />
            </motion.div>

            {/* Hints */}
            {challenge.hints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="rounded-2xl border overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0f1018", boxShadow: "var(--shadow-m)" }}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors duration-150"
                  style={{ color: "var(--color-text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                  onClick={() => setHintsOpen((v) => !v)}
                >
                  <span>Hints ({revealedHints.length}/{challenge.hints.length} revealed)</span>
                  <motion.span
                    animate={{ rotate: hintsOpen ? 180 : 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <ChevronDown size={15} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {hintsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {challenge.hints
                          .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
                          .map((hint: { order: number; text: string }, idx: number) => (
                            <motion.div
                              key={hint.order}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className="rounded-lg overflow-hidden"
                              style={{ border: "1px solid var(--color-border-subtle)" }}
                            >
                              {revealedHints.includes(hint.order) ? (
                                <div
                                  className="p-3 text-sm leading-relaxed"
                                  style={{ color: "var(--color-text-secondary)" }}
                                >
                                  <span
                                    className="text-xs font-mono mr-2"
                                    style={{ color: "var(--color-text-tertiary)" }}
                                  >
                                    Hint {hint.order + 1}:
                                  </span>
                                  {hint.text}
                                </div>
                              ) : (
                                <button
                                  className="w-full p-3 text-sm text-left transition-colors duration-150"
                                  style={{ color: "var(--color-text-tertiary)" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
                                  onClick={() => revealHint(hint.order)}
                                >
                                  Reveal Hint {hint.order + 1}
                                </button>
                              )}
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* ── Right: Editor + Results ──────────────────── */}
          <div className="space-y-4">
            {/* Pyodide loading banner */}
            <AnimatePresence>
              {pyLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2.5 p-3 rounded-xl text-sm"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Loader2 size={13} className="animate-spin" />
                  Loading Python runtime… (first load ~3s)
                </motion.div>
              )}
            </AnimatePresence>

            {/* Editor */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <CodeEditor value={code} onChange={setCode} height="400px" />
            </motion.div>

            {/* Run / Completion CTA */}
            <AnimatePresence mode="wait">
              {justPassed ? (
                /* ── Completion card ─────────────────────── */
                <motion.div
                  key="completion"
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: xpJustEarned
                      ? "1px solid rgba(245,158,11,0.28)"
                      : "1px solid rgba(16,185,129,0.25)",
                    background: xpJustEarned
                      ? "linear-gradient(180deg, rgba(245,158,11,0.07) 0%, rgba(11,13,20,0.95) 50%)"
                      : "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, rgba(11,13,20,0.95) 50%)",
                    boxShadow: xpJustEarned
                      ? "0 0 48px rgba(245,158,11,0.1), 0 0 0 1px rgba(245,158,11,0.08)"
                      : "0 0 32px rgba(16,185,129,0.08)",
                  }}
                >
                  {/* Header strip */}
                  <div
                    className="flex items-center justify-between px-4 py-2.5"
                    style={{
                      borderBottom: xpJustEarned
                        ? "1px solid rgba(245,158,11,0.14)"
                        : "1px solid rgba(16,185,129,0.12)",
                    }}
                  >
                    {xpJustEarned ? (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 }}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="font-display font-bold tabular-nums"
                          style={{ fontSize: "15px", color: "#f59e0b" }}
                        >
                          +{challenge.xpReward} XP
                        </span>
                        <span className="text-xs" style={{ color: "#78716c" }}>
                          earned
                        </span>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} style={{ color: "#10b981" }} />
                        <span className="text-xs font-medium" style={{ color: "#10b981" }}>
                          All tests pass
                        </span>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 }}
                      className="flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={12} style={{ color: "#10b981" }} />
                      <span className="text-[11px] font-mono" style={{ color: "#059669" }}>
                        progress saved
                      </span>
                    </motion.div>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3 space-y-2.5">
                    {xpJustEarned && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.22 }}
                        className="text-xs font-medium"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        Challenge complete
                        {nextChallenge && (
                          <span style={{ color: "#3d4460" }}>
                            {" "}· up next:{" "}
                            <span style={{ color: "#6b7689" }}>{nextChallenge.title}</span>
                          </span>
                        )}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.26, ease: [0.2, 0, 0, 1] }}
                    >
                      {nextChallenge ? (
                        <Link href={`/challenge/${nextChallenge.slug}`}>
                          <motion.div
                            whileHover={{ scale: 1.008 }}
                            whileTap={{ scale: 0.994 }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm cursor-pointer select-none"
                            style={{
                              background: "#a4abbe",
                              color: "#07070d",
                              boxShadow: "var(--shadow-m)",
                            }}
                          >
                            Continue
                            <ArrowRight size={14} />
                          </motion.div>
                        </Link>
                      ) : (
                        <Link href="/">
                          <motion.div
                            whileHover={{ scale: 1.008 }}
                            whileTap={{ scale: 0.994 }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm cursor-pointer select-none"
                            style={{
                              background: "#a4abbe",
                              color: "#07070d",
                              boxShadow: "var(--shadow-m)",
                            }}
                          >
                            Back to Curriculum
                            <ArrowRight size={14} />
                          </motion.div>
                        </Link>
                      )}
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.38 }}
                      onClick={() => { setJustPassed(false); setXpJustEarned(false); }}
                      className="w-full text-center text-xs py-1 transition-colors duration-150"
                      style={{ color: "#2d3557" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7689")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#2d3557")}
                    >
                      keep editing
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* ── Run Code button ─────────────────────── */
                <motion.button
                  key="run"
                  ref={runBtnRef}
                  onClick={handleRun}
                  disabled={!pyReady || running}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.28 }}
                  whileTap={pyReady && !running ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm disabled:opacity-35 disabled:cursor-not-allowed"
                  style={{
                    background: running ? "rgba(164,171,190,0.75)" : "#a4abbe",
                    color: "#07070d",
                    boxShadow: pyReady && !running ? "var(--shadow-m)" : "none",
                    transition: "background 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {running ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Running…
                    </>
                  ) : (
                    <>
                      <Play size={15} />
                      Run Code
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Test results */}
            <TestResultPanel
              results={results}
              running={running}
              stdout={stdout}
              runError={runError}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">
              {prevChallenge ? (
                <Link
                  href={`/challenge/${prevChallenge.slug}`}
                  className="flex items-center gap-1 text-sm transition-colors duration-150"
                  style={{ color: "var(--color-text-tertiary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
                >
                  <ArrowLeft size={13} />
                  Previous
                </Link>
              ) : (
                <div />
              )}
              {nextChallenge && (
                <Link
                  href={`/challenge/${nextChallenge.slug}`}
                  className="flex items-center gap-1 text-sm transition-colors duration-150"
                  style={{ color: "var(--color-text-tertiary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
                >
                  Next
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
