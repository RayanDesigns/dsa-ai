"use client";
import { CheckCircle2, XCircle, Terminal, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TestResult } from "@/lib/test-runner";

interface Props {
  results: TestResult[];
  running: boolean;
  stdout?: string;
  runError?: string;
}

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid #1a1d2e",
        background: "#0b0d14",
        boxShadow: "var(--shadow-s)",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center gap-2 px-4 h-[34px]"
        style={{
          background: "linear-gradient(180deg, #0f1123 0%, #0c0e1a 100%)",
          borderBottom: "1px solid #1a1d2e",
        }}
      >
        <Terminal size={11} style={{ color: "#3d4460" }} />
        <span
          className="text-[10px] font-mono tracking-[0.15em] uppercase"
          style={{ color: "#3d4460" }}
        >
          Test Output
        </span>
      </div>
      {children}
    </div>
  );
}

export function TestResultPanel({ results, running, stdout, runError }: Props) {
  /* ── Running ─────────────────────────────────────── */
  if (running) {
    return (
      <PanelShell>
        <div className="px-4 py-5 flex items-center gap-3">
          {/* Animated scan bars */}
          <div className="flex gap-[3px] items-end h-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="block w-[3px] rounded-full"
                style={{ background: "rgba(255,255,255,0.5)", originY: 1 }}
                animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          <span className="text-sm font-mono" style={{ color: "#6b7689" }}>
            Executing<span className="inline-block w-4 overflow-hidden">
              <motion.span
                animate={{ opacity: [1, 1, 1, 0] }}
                transition={{ duration: 1.2, times: [0, 0.6, 0.8, 1], repeat: Infinity }}
              >...</motion.span>
            </span>
          </span>
        </div>
      </PanelShell>
    );
  }

  /* ── Runtime error ───────────────────────────────── */
  if (runError) {
    return (
      <PanelShell>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={13} style={{ color: "#f87171" }} />
            <span className="text-xs font-semibold font-mono" style={{ color: "#f87171" }}>
              Runtime Error
            </span>
          </div>
          <pre
            className="text-xs font-mono whitespace-pre-wrap leading-relaxed pl-4"
            style={{
              color: "#fca5a5",
              borderLeft: "2px solid rgba(248,113,113,0.3)",
            }}
          >
            {runError}
          </pre>
        </motion.div>
      </PanelShell>
    );
  }

  /* ── Empty state ─────────────────────────────────── */
  if (results.length === 0) {
    return (
      <PanelShell>
        <div className="px-4 py-6 text-center">
          <p className="text-xs font-mono" style={{ color: "#2d3557" }}>
            — run your code to see results —
          </p>
        </div>
      </PanelShell>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const allPassed = passedCount === results.length;

  return (
    <PanelShell>
      {/* ── Summary bar ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          borderBottom: "1px solid #1a1d2e",
          background: allPassed
            ? "linear-gradient(90deg, rgba(16,185,129,0.06) 0%, transparent 60%)"
            : "linear-gradient(90deg, rgba(248,113,113,0.06) 0%, transparent 60%)",
        }}
      >
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 size={13} style={{ color: "#10b981" }} />
          ) : (
            <XCircle size={13} style={{ color: "#f87171" }} />
          )}
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: allPassed ? "#10b981" : "#f87171" }}
          >
            {passedCount}/{results.length} passed
          </span>
        </div>

        {/* Score pips */}
        <div className="flex items-center gap-1">
          {results.map((r) => (
            <motion.span
              key={r.id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: results.indexOf(r) * 0.05 }}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: r.passed ? "#10b981" : "#f87171",
                boxShadow: r.passed
                  ? "0 0 4px rgba(16,185,129,0.5)"
                  : "0 0 4px rgba(248,113,113,0.5)",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Test rows ────────────────────────────────── */}
      <div className="divide-y" style={{ borderColor: "#141726" }}>
        {results.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, delay: i * 0.055, ease: "easeOut" }}
            className="px-4 py-3"
          >
            <div className="flex items-start gap-2.5">
              {/* Status icon */}
              <div className="mt-0.5 shrink-0">
                {r.passed ? (
                  <CheckCircle2 size={13} style={{ color: "#10b981" }} />
                ) : (
                  <XCircle size={13} style={{ color: "#f87171" }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: r.passed ? "#6ee7b7" : "#fca5a5" }}
                  >
                    {r.description}
                  </span>
                  {r.passed && r.durationMs > 0 && (
                    <span className="text-[10px] font-mono shrink-0" style={{ color: "#2d3557" }}>
                      {r.durationMs.toFixed(1)}ms
                    </span>
                  )}
                </div>

                {/* Failure diff */}
                {!r.passed && (
                  <div
                    className="mt-2 rounded-md px-3 py-2 space-y-1"
                    style={{
                      background: "rgba(248,113,113,0.04)",
                      border: "1px solid rgba(248,113,113,0.12)",
                    }}
                  >
                    {r.error ? (
                      <p className="text-[11px] font-mono" style={{ color: "#fca5a5" }}>
                        <span style={{ color: "#3d4460" }}>error  </span>
                        {r.error}
                      </p>
                    ) : (
                      <>
                        <p className="text-[11px] font-mono">
                          <span style={{ color: "#3d4460" }}>expect </span>
                          <span style={{ color: "#6ee7b7" }}>{r.expectedOutput}</span>
                        </p>
                        <p className="text-[11px] font-mono">
                          <span style={{ color: "#3d4460" }}>got    </span>
                          <span style={{ color: "#fca5a5" }}>{r.actualOutput || "(no output)"}</span>
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Stdout ───────────────────────────────────── */}
      <AnimatePresence>
        {stdout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ borderTop: "1px solid #1a1d2e" }}
          >
            <div className="px-4 pt-3 pb-3">
              <p
                className="text-[10px] font-mono tracking-[0.15em] uppercase mb-2"
                style={{ color: "#2d3557" }}
              >
                stdout
              </p>
              <pre
                className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed pl-3"
                style={{
                  color: "#6b7689",
                  borderLeft: "2px solid #1c2033",
                }}
              >
                {stdout}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PanelShell>
  );
}
