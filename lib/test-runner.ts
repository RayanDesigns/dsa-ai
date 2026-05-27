import type { TestCase } from "@/types";

export interface TestResult {
  id: string;
  description: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  error?: string;
  durationMs: number;
}

export interface RunResult {
  stdout: string;
  results: TestResult[];
  allPassed: boolean;
  totalMs: number;
  runError?: string;
}

const BLOCKED_IMPORTS = ["subprocess", "socket", "requests", "urllib", "http.client"];

export function checkSafety(code: string): string | null {
  for (const mod of BLOCKED_IMPORTS) {
    if (code.includes(`import ${mod}`) || code.includes(`from ${mod}`)) {
      return `Blocked import: "${mod}" is not allowed in the sandbox.`;
    }
  }
  return null;
}

export function buildHarness(userCode: string, testCases: TestCase[]): string {
  const testBlocks = testCases
    .map(
      (tc) => `
try:
    import time as _t_${tc.id}
    _start_${tc.id} = _t_${tc.id}.time()
    _actual_${tc.id} = repr(${tc.callExpression})
    _ms_${tc.id} = (_t_${tc.id}.time() - _start_${tc.id}) * 1000
    print('__TEST__${tc.id}__OK__' + _actual_${tc.id} + '__MS__' + str(round(_ms_${tc.id}, 2)))
except Exception as _e_${tc.id}:
    print('__TEST__${tc.id}__ERR__' + str(_e_${tc.id}))
`
    )
    .join("\n");

  return `
import sys as _sys
import io as _io

_stdout_buf = _io.StringIO()
_sys.stdout = _stdout_buf

${userCode}

_sys.stdout = _sys.__stdout__
_captured = _stdout_buf.getvalue()
if _captured:
    print(_captured, end='')

def _raises(fn, exc_type):
    try:
        fn()
        return False
    except exc_type:
        return True
    except Exception:
        return False

${testBlocks}
`;
}

export function parseResults(raw: string, testCases: TestCase[]): Omit<RunResult, "totalMs"> {
  const lines = raw.split("\n");
  const results: TestResult[] = [];
  const stdoutLines: string[] = [];

  for (const line of lines) {
    const okMatch = line.match(/^__TEST__(.+?)__OK__(.+?)__MS__(.+)$/);
    const errMatch = line.match(/^__TEST__(.+?)__ERR__(.+)$/);

    if (okMatch) {
      const [, id, actual, ms] = okMatch;
      const tc = testCases.find((t) => t.id === id);
      if (!tc) continue;

      const expectedNorm = tc.expectedOutput.trim();
      const actualNorm = actual.trim();
      const passed = actualNorm === expectedNorm;

      results.push({
        id,
        description: tc.description,
        passed,
        actualOutput: actualNorm,
        expectedOutput: expectedNorm,
        durationMs: parseFloat(ms),
      });
    } else if (errMatch) {
      const [, id, error] = errMatch;
      const tc = testCases.find((t) => t.id === id);
      if (!tc) continue;

      results.push({
        id,
        description: tc.description,
        passed: false,
        actualOutput: "",
        expectedOutput: tc.expectedOutput.trim(),
        error,
        durationMs: 0,
      });
    } else if (!line.startsWith("__TEST__")) {
      stdoutLines.push(line);
    }
  }

  const stdout = stdoutLines.join("\n").trim();
  const allPassed = results.length === testCases.length && results.every((r) => r.passed);

  return { stdout, results, allPassed };
}
