# DSA for AI Engineering

A focused, challenge-driven course that teaches data structures and algorithms through the lens of AI engineering — in under 6 hours.

Every algorithm is explained in terms of where it actually appears in AI systems: embedding search, token processing, beam search, RAG pipelines, knowledge graphs, and more. You write real Python code that runs in the browser — no installs, no setup.

## What it is

- **8 modules, 24 challenges** — sequentially unlocked, XP-gated progression
- **Python in the browser** — Pyodide WASM runtime, real execution, instant feedback
- **AI-first framing** — not "implement a hash map" but "build the token lookup table that powers a tokenizer"
- **2,500 XP total** — earn XP per challenge, track mastery across modules

## Curriculum

| # | Module | Focus | Time |
|---|--------|-------|------|
| 1 | Vectors & Embeddings | Dot product, cosine similarity, brute-force KNN | 45 min |
| 2 | Hash Maps for AI | Token frequency, inverted index, TF-IDF | 45 min |
| 3 | Heaps & Top-K Search | Min-heap, top-K tokens, beam search | 40 min |
| 4 | Graphs & Knowledge Graphs | BFS, DFS, PageRank | 45 min |
| 5 | Trees & Hierarchical Clustering | BST, decision trees, hierarchical clustering | 40 min |
| 6 | Sliding Window & Chunking | Fixed chunker, sliding window, context windowing | 40 min |
| 7 | Sorting & Approximate Nearest Neighbor | Quickselect, merge sort, LSH buckets | 40 min |
| 8 | Dynamic Programming | Edit distance, sequence alignment, optimal chunking | 35 min |

## Stack

- **Next.js 16** (App Router)
- **Pyodide** — Python WASM runtime for in-browser code execution
- **Firebase Auth** — Google sign-in, progress persistence
- **Framer Motion** — animations
- **Tailwind v4** — styling via `@theme` tokens

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires a Firebase project with Google Auth enabled. Copy `.env.local.example` to `.env.local` and fill in your Firebase config.
