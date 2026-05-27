// Singleton Pyodide instance — loaded once, cached for all challenge navigations
// Must only be called client-side (no SSR)

let pyodideInstance: unknown = null;
let loadingPromise: Promise<unknown> | null = null;

export async function loadPyodideOnce(): Promise<unknown> {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const { loadPyodide } = await import("pyodide");
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/",
    });
    return pyodideInstance;
  })();

  return loadingPromise;
}

export function isPyodideReady(): boolean {
  return pyodideInstance !== null;
}
