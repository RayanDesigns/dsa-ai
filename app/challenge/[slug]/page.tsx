"use client";
import { use, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getChallengeBySlug, MODULES } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { usePyodide } from "@/hooks/usePyodide";
import { buildHarness, parseResults, checkSafety } from "@/lib/test-runner";
import type { TestResult } from "@/lib/test-runner";
import { DifficultyBadge, XPBadge } from "@/components/ui/Badge";
import { TestResultPanel } from "@/components/editor/TestResultPanel";
import { XPBurst } from "@/components/gamification/XPBurst";
import {
  ArrowLeft, ArrowRight, Play, Loader2,
  ChevronDown, ChevronUp, Clock, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

const CodeEditor = dynamic(
  () => import("@/components/editor/CodeEditor").then((m) => ({ default: m.CodeEditor })),
  { ssr: false, loading: () => (
    <div className="rounded-xl border border-[var(--color-border)] bg-[#1e1e1e] h-[400px] flex items-center justify-center">
      <Loader2 className="animate-spin text-[var(--color-accent)]" size={24} />
    </div>
  )}
);

function MarkdownBlock({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-[var(--color-text-secondary)]">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) {
          return <h2 key={i} className="text-[var(--color-text-primary)] font-display font-semibold text-base mt-4 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-semibold text-[var(--color-text-primary)]">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith("```")) return null;
        if (line.trim() === "") return <br key={i} />;
        // Inline code
        const parts = line.split(/(`[^`]+`)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith("`") && part.endsWith("`") ? (
                <code key={j} className="px-1 py-0.5 rounded bg-[var(--color-bg-elevated)] text-cyan-300 text-xs font-mono">
                  {part.slice(1, -1)}
                </code>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const challenge = getChallengeBySlug(slug);
  const { isCompleted, addCompletedChallenge } = useProgress();
  const { ready: pyReady, loading: pyLoading, runCode } = usePyodide();

  const [code, setCode] = useState(challenge?.starterCode ?? "");
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState("");
  const [runError, setRunError] = useState<string | undefined>();
  const [xpBurst, setXpBurst] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[var(--color-text-secondary)]">
        Challenge not found.
      </div>
    );
  }

  const alreadyCompleted = isCompleted(challenge.id);

  // Find prev/next challenge
  const allChallenges = MODULES.flatMap((m) => m.challenges);
  const currentIdx = allChallenges.findIndex((c) => c.slug === slug);
  const prevChallenge = currentIdx > 0 ? allChallenges[currentIdx - 1] : null;
  const nextChallenge = currentIdx < allChallenges.length - 1 ? allChallenges[currentIdx + 1] : null;

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

    const startMs = Date.now();
    const harness = buildHarness(code, challenge.testCases);

    const runPromise = runCode(harness);
    const timeoutPromise = new Promise<{ output: string; error?: string }>((_, reject) =>
      setTimeout(() => reject(new Error("Execution timed out (10s)")), 10_000)
    );

    try {
      const { output, error } = await Promise.race([runPromise, timeoutPromise]);
      const totalMs = Date.now() - startMs;

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
        addCompletedChallenge(challenge.id, challenge.moduleId, challenge.xpReward);
        setXpBurst(true);
        toast.success(`+${challenge.xpReward} XP — Challenge complete!`, {
          icon: "⚡",
          duration: 3000,
        });
        setTimeout(() => {
          if (nextChallenge) router.push(`/challenge/${nextChallenge.slug}`);
        }, 2500);
      } else if (parsed.allPassed && alreadyCompleted) {
        toast.success("All tests pass ✓");
      }

      void totalMs;
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
      <XPBurst amount={challenge.xpReward} trigger={xpBurst} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-6">
          <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link
            href={`/module/${challenge.moduleId}`}
            className="hover:text-[var(--color-text-primary)] transition-colors"
          >
            {MODULES.find((m) => m.id === challenge.moduleId)?.title}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text-primary)]">{challenge.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left: Problem ─────────────────────────────── */}
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
              <div className="flex items-center gap-2 mb-2">
                <DifficultyBadge difficulty={challenge.difficulty} />
                <XPBadge xp={challenge.xpReward} />
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                  <Clock size={12} />
                  {challenge.estimatedMinutes} min
                </div>
                {alreadyCompleted && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 size={12} />
                    Solved
                  </div>
                )}
              </div>
              <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)] mb-3">
                {challenge.title}
              </h1>
              {/* AI Context callout */}
              <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 p-3">
                <p className="text-xs text-[var(--color-accent)] font-medium mb-1">Why this matters in AI</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{challenge.aiContext}</p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
              <MarkdownBlock content={challenge.description} />
            </div>

            {/* Hints */}
            {challenge.hints.length > 0 && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  onClick={() => setHintsOpen((v) => !v)}
                >
                  Hints ({revealedHints.length}/{challenge.hints.length} revealed)
                  {hintsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {hintsOpen && (
                  <div className="px-4 pb-4 space-y-2">
                    {challenge.hints
                      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
                      .map((hint: { order: number; text: string }) => (
                        <div key={hint.order} className="rounded-lg border border-[var(--color-border-subtle)] overflow-hidden">
                          {revealedHints.includes(hint.order) ? (
                            <div className="p-3 text-sm text-[var(--color-text-secondary)]">
                              <span className="text-xs text-[var(--color-text-tertiary)] mr-2">Hint {hint.order + 1}:</span>
                              {hint.text}
                            </div>
                          ) : (
                            <button
                              className="w-full p-3 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors text-left"
                              onClick={() => revealHint(hint.order)}
                            >
                              Reveal Hint {hint.order + 1}
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Editor + Results ────────────────────── */}
          <div className="space-y-4">
            {/* Pyodide loading banner */}
            {pyLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 text-sm text-[var(--color-accent)]">
                <Loader2 size={14} className="animate-spin" />
                Loading Python runtime… (first load ~3s)
              </div>
            )}

            {/* Editor */}
            <CodeEditor value={code} onChange={setCode} height="400px" />

            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={!pyReady || running}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              {running ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play size={16} />
                  Run Code
                </>
              )}
            </button>

            {/* Test results */}
            <TestResultPanel
              results={results}
              running={running}
              stdout={stdout}
              runError={runError}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              {prevChallenge ? (
                <Link
                  href={`/challenge/${prevChallenge.slug}`}
                  className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <ArrowLeft size={14} />
                  Previous
                </Link>
              ) : <div />}

              {nextChallenge && (
                <Link
                  href={`/challenge/${nextChallenge.slug}`}
                  className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Next
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
