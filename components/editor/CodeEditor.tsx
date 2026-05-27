"use client";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  value: string;
  onChange: (val: string) => void;
  height?: string;
}

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  language: "python",
  theme: "vs-dark",
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  fontLigatures: true,
  minimap: { enabled: false },
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  padding: { top: 16, bottom: 16 },
  automaticLayout: true,
  tabSize: 4,
  insertSpaces: true,
  wordWrap: "on",
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  scrollbar: {
    vertical: "auto",
    horizontal: "auto",
  },
};

export function CodeEditor({ value, onChange, height = "400px" }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[#1e1e1e]">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--color-border)] bg-[#252526]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-[var(--color-text-tertiary)] font-mono">solution.py</span>
      </div>
      <MonacoEditor
        height={height}
        defaultLanguage="python"
        value={value}
        onChange={(val) => onChange(val ?? "")}
        options={editorOptions}
        theme="vs-dark"
      />
    </div>
  );
}
