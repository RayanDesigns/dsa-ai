"use client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
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
      <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <Loader2 size={18} className="animate-spin text-[var(--color-accent)]" />
        <span className="text-sm text-[var(--color-text-secondary)]">Running tests…</span>
      </div>
    );
  }

  if (runError) {
    return (
      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10">
        <p className="text-sm font-medium text-red-400 mb-1">Runtime Error</p>
        <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">{runError}</pre>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] text-sm text-[var(--color-text-tertiary)]">
        Run your code to see test results
      </div>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const allPassed = passedCount === results.length;

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl border ${
          allPassed
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-red-500/30 bg-red-500/10"
        }`}
      >
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 size={16} className="text-emerald-400" />
          ) : (
            <XCircle size={16} className="text-red-400" />
          )}
          <span className={`text-sm font-medium ${allPassed ? "text-emerald-400" : "text-red-400"}`}>
            {passedCount}/{results.length} tests passed
          </span>
        </div>
        {allPassed && (
          <span className="text-xs text-emerald-400 font-mono">All tests passed ✓</span>
        )}
      </div>

      {/* Individual results */}
      <div className="space-y-2">
        {results.map((r) => (
          <div
            key={r.id}
            className={`p-3 rounded-lg border text-sm ${
              r.passed
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
            }`}
          >
            <div className="flex items-start gap-2">
              {r.passed ? (
                <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <XCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${r.passed ? "text-emerald-400" : "text-red-400"}`}>
                  {r.description}
                </p>
                {!r.passed && (
                  <div className="mt-2 space-y-1 text-xs font-mono">
                    {r.error ? (
                      <div className="text-red-300">
                        <span className="text-[var(--color-text-tertiary)]">Error: </span>
                        {r.error}
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-[var(--color-text-tertiary)]">Expected: </span>
                          <span className="text-emerald-300">{r.expectedOutput}</span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-tertiary)]">Got:      </span>
                          <span className="text-red-300">{r.actualOutput}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {r.passed && r.durationMs > 0 && (
                  <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)] font-mono">
                    {r.durationMs.toFixed(1)}ms
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stdout */}
      {stdout && (
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <p className="text-xs text-[var(--color-text-tertiary)] mb-1 font-mono">stdout</p>
          <pre className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap">{stdout}</pre>
        </div>
      )}
    </div>
  );
}
