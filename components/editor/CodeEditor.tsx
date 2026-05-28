"use client";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import type { editor } from "monaco-editor";
import type * as MonacoType from "monaco-editor";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const THEME_ID = "dsa-dark";

function applyTheme(monaco: typeof MonacoType) {
  monaco.editor.defineTheme(THEME_ID, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword",              foreground: "7c6af7", fontStyle: "bold" },
      { token: "keyword.python",       foreground: "7c6af7", fontStyle: "bold" },
      { token: "string",               foreground: "67e8f9" },
      { token: "string.python",        foreground: "67e8f9" },
      { token: "string.escape",        foreground: "22d3ee" },
      { token: "number",               foreground: "f59e0b" },
      { token: "number.float",         foreground: "f59e0b" },
      { token: "comment",              foreground: "2d3850", fontStyle: "italic" },
      { token: "comment.python",       foreground: "2d3850", fontStyle: "italic" },
      { token: "type",                 foreground: "c084fc" },
      { token: "type.python",          foreground: "c084fc" },
      { token: "identifier",           foreground: "eceef4" },
      { token: "operator",             foreground: "6b7689" },
      { token: "delimiter",            foreground: "4a5568" },
      { token: "delimiter.bracket",    foreground: "4a556880" },
      { token: "metatag",              foreground: "f59e0b" },
      { token: "tag",                  foreground: "7c6af7" },
      { token: "attribute.name",       foreground: "c084fc" },
      { token: "attribute.value",      foreground: "67e8f9" },
    ],
    colors: {
      "editor.background":                    "#0b0d14",
      "editor.foreground":                    "#eceef4",
      "editor.lineHighlightBackground":       "#ffffff06",
      "editor.lineHighlightBorder":           "#ffffff0c",
      "editor.selectionBackground":           "#ffffff1a",
      "editor.inactiveSelectionBackground":   "#ffffff0d",
      "editorLineNumber.foreground":          "#232b3e",
      "editorLineNumber.activeForeground":    "#7a7a9a",
      "editorCursor.foreground":              "#ffffff",
      "editorCursor.background":              "#0b0d14",
      "editorWhitespace.foreground":          "#181e2e",
      "editorIndentGuide.background1":        "#181e2e",
      "editorIndentGuide.activeBackground1":  "#ffffff18",
      "editor.findMatchBackground":           "#ffffff22",
      "editor.findMatchHighlightBackground":  "#ffffff12",
      "editorBracketMatch.background":        "#ffffff12",
      "editorBracketMatch.border":            "#ffffff35",
      "scrollbar.shadow":                     "#00000080",
      "scrollbarSlider.background":           "#1c203350",
      "scrollbarSlider.hoverBackground":      "#ffffff18",
      "scrollbarSlider.activeBackground":     "#ffffff2a",
      "editorWidget.background":              "#0e1020",
      "editorSuggestWidget.background":       "#0e1020",
      "editorSuggestWidget.border":           "#1c2033",
      "editorSuggestWidget.selectedBackground":"#ffffff12",
      "editorHoverWidget.background":         "#0e1020",
      "editorHoverWidget.border":             "#1c2033",
      "input.background":                     "#13161f",
      "input.border":                         "#1c2033",
      "focusBorder":                          "#ffffff40",
    },
  });
}

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  language: "python",
  fontSize: 13.5,
  fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  fontLigatures: true,
  minimap: { enabled: false },
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  padding: { top: 18, bottom: 18 },
  automaticLayout: true,
  tabSize: 4,
  insertSpaces: true,
  detectIndentation: false,
  wordWrap: "on",
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  renderLineHighlight: "all",
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  smoothScrolling: true,
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 6,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  scrollbar: {
    vertical: "auto",
    horizontal: "auto",
    verticalScrollbarSize: 4,
    horizontalScrollbarSize: 4,
  },
};

function PythonLogo() {
  return (
    <svg width="15" height="15" viewBox="0 0 256 255" aria-hidden="true">
      <defs>
        <linearGradient id="cc-py-a" x1="12.959%" x2="79.639%" y1="12.039%" y2="78.201%">
          <stop offset="0%" stopColor="#d0d0d8" />
          <stop offset="100%" stopColor="#888898" />
        </linearGradient>
        <linearGradient id="cc-py-b" x1="19.128%" x2="90.742%" y1="20.579%" y2="88.429%">
          <stop offset="0%" stopColor="#888898" />
          <stop offset="100%" stopColor="#606070" />
        </linearGradient>
      </defs>
      <path fill="url(#cc-py-a)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.413 36.204 63.096 36.204 63.096h21.6v-30.356s-1.165-36.206 35.632-36.206h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"/>
      <path fill="url(#cc-py-b)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.204-63.096-36.204-63.096h-21.6v30.355s1.165 36.206-35.632 36.206h-61.362s-34.475-.557-34.475 33.32v56.015s-5.235 33.899 62.503 33.899zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"/>
    </svg>
  );
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  height?: string;
}

export function CodeEditor({ value, onChange, height = "400px" }: Props) {
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });
  const [lineCount, setLineCount] = useState(value.split("\n").length || 1);

  const handleMount = useCallback((editorInstance: editor.IStandaloneCodeEditor) => {
    editorInstance.onDidChangeCursorPosition((e) => {
      setCursor({ ln: e.position.lineNumber, col: e.position.column });
    });
    const model = editorInstance.getModel();
    if (model) {
      setLineCount(model.getLineCount());
      model.onDidChangeContent(() => setLineCount(model.getLineCount()));
    }
  }, []);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid #1a1d2e",
        background: "#0b0d14",
        boxShadow: "var(--shadow-m)",
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 h-[38px] shrink-0"
        style={{
          background: "linear-gradient(180deg, #0f1123 0%, #0c0e1a 100%)",
          borderBottom: "1px solid #1a1d2e",
        }}
      >
        {/* Traffic lights + file tab */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-[5px]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] cursor-default opacity-80 hover:opacity-100 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] cursor-default opacity-80 hover:opacity-100 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] cursor-default opacity-80 hover:opacity-100 transition-opacity" />
          </div>

          <div className="w-px h-3.5 bg-[#1c2033]" />

          {/* File tab */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-md"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <PythonLogo />
            <span className="text-xs font-mono" style={{ color: "#8b8fa8" }}>
              solution
            </span>
            <span className="text-xs font-mono" style={{ color: "#3d4460" }}>
              .py
            </span>
          </div>
        </div>

        {/* Runtime badge */}
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#ffffff", boxShadow: "0 0 5px rgba(255,255,255,0.4)" }}
            />
            <span
              className="text-[10px] font-mono font-medium tracking-wider"
              style={{ color: "#9090a8" }}
            >
              Pyodide · py3.13
            </span>
          </div>
        </div>
      </div>

      {/* ── Monaco editor ──────────────────────────────── */}
      <MonacoEditor
        height={height}
        defaultLanguage="python"
        value={value}
        onChange={(val) => onChange(val ?? "")}
        options={editorOptions}
        theme={THEME_ID}
        beforeMount={applyTheme}
        onMount={handleMount}
      />

      {/* ── Status bar ─────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 h-[26px] shrink-0"
        style={{
          background: "linear-gradient(180deg, #0c0e1a 0%, #0f1123 100%)",
          borderTop: "1px solid #1a1d2e",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "#2d3557" }}>
            Python
          </span>
          <span className="text-[10px] font-mono" style={{ color: "#1e2438" }}>│</span>
          <span className="text-[10px] font-mono" style={{ color: "#2d3557" }}>
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        </div>
        <span className="text-[10px] font-mono tabular-nums" style={{ color: "#2d3557" }}>
          Ln {cursor.ln}&nbsp;&nbsp;Col {cursor.col}
        </span>
      </div>
    </div>
  );
}
