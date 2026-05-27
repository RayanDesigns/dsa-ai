// Singleton Pyodide instance — loaded once, cached for all challenge navigations
// Must only be called client-side (no SSR)
// Loads from CDN via script tag to avoid Turbopack dynamic-import analysis issues

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<unknown>;
  }
}

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/";

let pyodideInstance: unknown = null;
let loadingPromise: Promise<unknown> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export async function loadPyodideOnce(): Promise<unknown> {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    await injectScript(`${PYODIDE_CDN}pyodide.js`);
    pyodideInstance = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    return pyodideInstance;
  })();

  return loadingPromise;
}

export function isPyodideReady(): boolean {
  return pyodideInstance !== null;
}
