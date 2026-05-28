"use client";
import { useEffect, useRef, useState } from "react";
import { loadPyodideOnce } from "@/lib/pyodide-loader";

interface PyodideHook {
  ready: boolean;
  loading: boolean;
  runCode: (harness: string) => Promise<{ output: string; error?: string }>;
}

export function usePyodide(): PyodideHook {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const pyRef = useRef<unknown>(null);

  useEffect(() => {
    loadPyodideOnce()
      .then((py) => {
        pyRef.current = py;
        setReady(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Pyodide load failed:", err);
        setLoading(false);
      });
  }, []);

  const runCode = async (harness: string): Promise<{ output: string; error?: string }> => {
    if (!pyRef.current) return { output: "", error: "Pyodide not loaded" };

    const py = pyRef.current as {
      runPythonAsync: (code: string) => Promise<unknown>;
      setStdout: (opts: { batched: (s: string) => void }) => void;
    };

    const outputChunks: string[] = [];

    try {
      py.setStdout({ batched: (s) => outputChunks.push(s + "\n") });
      await py.runPythonAsync(harness);
      return { output: outputChunks.join("") };
    } catch (err) {
      return {
        output: outputChunks.join(""),
        error: err instanceof Error ? err.message : String(err),
      };
    }
  };

  return { ready, loading, runCode };
}
