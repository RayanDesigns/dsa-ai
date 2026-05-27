"use client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TestResult } from "@/lib/test-runner";

interface Props {
  results: TestResult[];
  running: boolean;
  stdout?: string;
  runError?: string;
}

export function TestResultPanel({ results, running, stdout, runError }: Props) {
  if (running) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/5">
        <Loader2 size={16} className="animate-spin" style={{ color: "var(--color-accent)" }} />
        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Running tests…
        </span>
        <span className="ml-auto flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-accent)" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, delay: i * 0.22, repeat: Infinity }}
            />
          ))}
        </span>
      </div>
    );
  }

  if (runError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl border border-red-500/30 bg-red-500/8"
      >
        <p className="text-sm font-semibold text-red-400 mb-1.5 flex items-center gap-1.5">
          <XCircle size={14} />
          Runtime Error
        </p>
        <pre className="text-xs text-red-300/90 font-mono whitespace-pre-wrap leading-relaxed">{runError}</pre>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        className="p-4 rounded-xl border text-sm text-center"
        style={{
          border: "1px solid var(--color-border-subtle)",
          background: "rgba(19,22,31,0.5)",
          color: "var(--color-text-tertiary)",
        }}
      >
        Run your code to see test results
      </div>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const allPassed = passedCount === results.length;

  return (
    <div className="space-y-2.5">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between p-3 rounded-xl border"
        style={{
          border: allPassed ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(248,113,113,0.35)",
          background: allPassed ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 size={15} style={{ color: "#10b981" }} />
          ) : (
            <XCircle size={15} style={{ color: "#f87171" }} />
          )}
          <span
            className="text-sm font-semibold"
            style={{ color: allPassed ? "#10b981" : "#f87171" }}
          >
            {passedCount}/{results.length} tests passed
          </span>
        </div>
        {allPassed && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-mono"
            style={{ color: "#10b981" }}
          >
            All tests passed ✓
          </motion.span>
        )}
      </motion.div>

      {/* Individual results */}
      <AnimatePresence>
        <div className="space-y-1.5">
          {results.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8, x: -4 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.28, delay: i * 0.06, ease: "easeOut" }}
              className="p-3 rounded-lg border text-sm"
              style={{
                border: r.passed
                  ? "1px solid rgba(16,185,129,0.2)"
                  : "1px solid rgba(248,113,113,0.2)",
                background: r.passed
                  ? "rgba(16,185,129,0.04)"
                  : "rgba(248,113,113,0.04)",
              }}
            >
              <div className="flex items-start gap-2">
                {r.passed ? (
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#10b981" }}
                  />
                ) : (
                  <XCircle
                    size={14}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#f87171" }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium leading-snug"
                    style={{ color: r.passed ? "#10b981" : "#f87171" }}
                  >
                    {r.description}
                  </p>
                  {!r.passed && (
                    <div className="mt-2 space-y-1 text-xs font-mono">
                      {r.error ? (
                        <div style={{ color: "#fca5a5" }}>
                          <span style={{ color: "var(--color-text-tertiary)" }}>Error: </span>
                          {r.error}
                        </div>
                      ) : (
                        <>
                          <div>
                            <span style={{ color: "var(--color-text-tertiary)" }}>Expected: </span>
                            <span style={{ color: "#6ee7b7" }}>{r.expectedOutput}</span>
                          </div>
                          <div>
                            <span style={{ color: "var(--color-text-tertiary)" }}>Got:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
                            <span style={{ color: "#fca5a5" }}>{r.actualOutput}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {r.passed && r.durationMs > 0 && (
                    <p className="mt-0.5 text-xs font-mono" style={{ color: "var(--color-text-tertiary)" }}>
                      {r.durationMs.toFixed(1)}ms
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Stdout */}
      {stdout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: results.length * 0.06 + 0.1 }}
          className="p-3 rounded-lg border"
          style={{
            border: "1px solid var(--color-border)",
            background: "rgba(19,22,31,0.8)",
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5"
             style={{ color: "var(--color-text-tertiary)" }}>
            stdout
          </p>
          <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed"
               style={{ color: "var(--color-text-secondary)" }}>
            {stdout}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
