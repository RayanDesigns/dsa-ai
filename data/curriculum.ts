import type { Module, Challenge } from "@/types";

export const MODULES: Module[] = [
  // ─── MODULE 1: Vectors & Embeddings ────────────────────────────────────────
  {
    id: "vectors-embeddings",
    slug: "vectors-embeddings",
    title: "Vectors & Embeddings",
    description: "Master the math behind semantic search and neural networks.",
    aiContext:
      "Every modern embedding model outputs a high-dimensional vector. Semantic search, RAG retrieval, and recommendation engines are all dot-product operations under the hood.",
    icon: "Layers",
    accentColor: "#7c6af7",
    order: 0,
    estimatedMinutes: 45,
    totalXP: 200,
    challenges: [
      {
        id: "dot-product",
        moduleId: "vectors-embeddings",
        slug: "dot-product",
        title: "Dot Product from Scratch",
        difficulty: "easy",
        estimatedMinutes: 10,
        xpReward: 50,
        conceptHook: "The operation every neural network does billions of times",
        aiContext:
          "The dot product is the fundamental building block of attention mechanisms, dense retrieval, and matrix multiplications across all of deep learning.",
        description: `## Dot Product

The dot product of two vectors **a** and **b** is defined as:

\`\`\`
dot(a, b) = a[0]*b[0] + a[1]*b[1] + ... + a[n]*b[n]
\`\`\`

Implement a function that computes the dot product of two equal-length lists of floats.

**Constraints:**
- Raise \`ValueError\` if the lists have different lengths
- Handle empty lists (return 0.0)
- The result should be a float`,
        starterCode: `def dot_product(a: list[float], b: list[float]) -> float:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "basic dot product",
            callExpression: "dot_product([1, 2, 3], [4, 5, 6])",
            expectedOutput: "32.0",
          },
          {
            id: "tc2",
            description: "zero vectors",
            callExpression: "dot_product([0, 0, 0], [1, 2, 3])",
            expectedOutput: "0.0",
          },
          {
            id: "tc3",
            description: "unit vectors",
            callExpression: "dot_product([1.0, 0.0], [0.0, 1.0])",
            expectedOutput: "0.0",
          },
          {
            id: "tc4",
            description: "negative values",
            callExpression: "dot_product([-1, 2], [3, -4])",
            expectedOutput: "-11.0",
          },
          {
            id: "tc5",
            description: "mismatched lengths raise ValueError",
            callExpression: "_raises(lambda: dot_product([1, 2], [1, 2, 3]), ValueError)",
            expectedOutput: "True",
          },
        ],
        hints: [
          { order: 0, text: "Use the built-in `zip()` function to pair elements from both lists." },
          { order: 1, text: "Check `len(a) != len(b)` before computing and raise ValueError." },
          { order: 2, text: "Use `sum()` with a generator: `sum(x * y for x, y in zip(a, b))`." },
        ],
      },
      {
        id: "cosine-similarity",
        moduleId: "vectors-embeddings",
        slug: "cosine-similarity",
        title: "Cosine Similarity",
        difficulty: "easy",
        estimatedMinutes: 15,
        xpReward: 50,
        conceptHook: "How OpenAI's embedding API measures meaning distance",
        aiContext:
          "Cosine similarity is the standard metric for comparing text embeddings. Every semantic search engine — from Pinecone to pgvector — uses it to rank results.",
        description: `## Cosine Similarity

Cosine similarity measures the angle between two vectors, ignoring magnitude:

\`\`\`
cosine_sim(a, b) = dot(a, b) / (||a|| * ||b||)
\`\`\`

Where \`||v||\` is the Euclidean norm (L2 norm) of vector v.

- Returns **1.0** for identical direction
- Returns **0.0** for orthogonal vectors
- Returns **-1.0** for opposite direction

**Constraints:**
- Raise \`ValueError\` if either vector is all-zeros (undefined similarity)
- Return a float between -1.0 and 1.0`,
        starterCode: `import math

def cosine_similarity(a: list[float], b: list[float]) -> float:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "identical vectors → 1.0",
            callExpression: "round(cosine_similarity([1, 2, 3], [1, 2, 3]), 5)",
            expectedOutput: "1.0",
          },
          {
            id: "tc2",
            description: "orthogonal vectors → 0.0",
            callExpression: "round(cosine_similarity([1, 0], [0, 1]), 5)",
            expectedOutput: "0.0",
          },
          {
            id: "tc3",
            description: "opposite direction → -1.0",
            callExpression: "round(cosine_similarity([1, 0], [-1, 0]), 5)",
            expectedOutput: "-1.0",
          },
          {
            id: "tc4",
            description: "scaled vector same similarity",
            callExpression: "round(cosine_similarity([1, 2], [2, 4]), 5)",
            expectedOutput: "1.0",
          },
        ],
        hints: [
          { order: 0, text: "Compute the dot product first: `sum(x*y for x,y in zip(a,b))`." },
          { order: 1, text: "The norm of a vector: `math.sqrt(sum(x**2 for x in v))`." },
          { order: 2, text: "Divide dot by (norm_a * norm_b). Check for zero norms before dividing." },
        ],
      },
      {
        id: "brute-force-knn",
        moduleId: "vectors-embeddings",
        slug: "brute-force-knn",
        title: "Brute-Force K-Nearest Neighbors",
        difficulty: "medium",
        estimatedMinutes: 20,
        xpReward: 100,
        conceptHook: "The baseline every ANN benchmark is measured against",
        aiContext:
          "KNN search is how FAISS and every vector database finds similar embeddings. The brute-force version is O(n·d) and is the correctness reference for approximate methods like HNSW.",
        description: `## Brute-Force KNN

Given a query vector and a corpus of vectors, find the **k most similar** vectors by cosine similarity.

Return the **indices** of the top-k vectors (from the corpus), sorted by descending similarity.

\`\`\`python
knn([1, 0], [[1, 0], [0, 1], [-1, 0]], k=2)
# → [0, 1]  (index 0 is most similar, index 1 is second)
\`\`\`

**Constraints:**
- If k > len(corpus), return all indices sorted by similarity
- Break ties by lower index first`,
        starterCode: `import math

def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x**2 for x in a))
    norm_b = math.sqrt(sum(x**2 for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def knn(query: list[float], corpus: list[list[float]], k: int) -> list[int]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "k=1 returns closest",
            callExpression: "knn([1, 0], [[1, 0], [0, 1], [-1, 0]], k=1)",
            expectedOutput: "[0]",
          },
          {
            id: "tc2",
            description: "k=2 returns two closest",
            callExpression: "knn([1, 0], [[1, 0], [0, 1], [-1, 0]], k=2)",
            expectedOutput: "[0, 1]",
          },
          {
            id: "tc3",
            description: "k > corpus size returns all",
            callExpression: "knn([1, 0], [[1, 0], [0, 1]], k=5)",
            expectedOutput: "[0, 1]",
          },
        ],
        hints: [
          { order: 0, text: "Compute similarity between query and each corpus vector." },
          { order: 1, text: "Use `sorted(range(len(corpus)), key=lambda i: similarity[i], reverse=True)`." },
          { order: 2, text: "Slice the sorted list: `sorted_indices[:k]`." },
        ],
      },
    ],
  },

  // ─── MODULE 2: Hash Maps for AI ────────────────────────────────────────────
  {
    id: "hash-maps-ai",
    slug: "hash-maps-ai",
    title: "Hash Maps for AI",
    description: "Build the data structures that power every search and NLP pipeline.",
    aiContext:
      "Tokenizers (BPE, WordPiece) are hash maps at their core. Inverted indexes power every search engine and retrieval system from Elasticsearch to your RAG pipeline.",
    icon: "Hash",
    accentColor: "#22d3ee",
    order: 1,
    estimatedMinutes: 45,
    totalXP: 250,
    challenges: [
      {
        id: "token-frequency",
        moduleId: "hash-maps-ai",
        slug: "token-frequency",
        title: "Token Frequency Counter",
        difficulty: "easy",
        estimatedMinutes: 10,
        xpReward: 50,
        conceptHook: "Step 0 of every NLP pipeline",
        aiContext:
          "Before BPE merges, before TF-IDF, before anything — you count token frequencies. This is how tokenizers learn which character pairs to merge and how search engines weight terms.",
        description: `## Token Frequency Counter

Given a list of string tokens, count how many times each token appears.

\`\`\`python
token_freq(["the", "cat", "sat", "the"])
# → {"the": 2, "cat": 1, "sat": 1}
\`\`\`

**Constraints:**
- Case-sensitive ("The" ≠ "the")
- Return an empty dict for an empty input
- All counts must be positive integers`,
        starterCode: `def token_freq(tokens: list[str]) -> dict[str, int]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "basic frequency count",
            callExpression: "token_freq(['the', 'cat', 'sat', 'the'])",
            expectedOutput: "{'the': 2, 'cat': 1, 'sat': 1}",
          },
          {
            id: "tc2",
            description: "empty list returns empty dict",
            callExpression: "token_freq([])",
            expectedOutput: "{}",
          },
          {
            id: "tc3",
            description: "case sensitive",
            callExpression: "token_freq(['A', 'a', 'A'])",
            expectedOutput: "{'A': 2, 'a': 1}",
          },
          {
            id: "tc4",
            description: "single token",
            callExpression: "token_freq(['hello'])",
            expectedOutput: "{'hello': 1}",
          },
        ],
        hints: [
          { order: 0, text: "Use a plain dict and check `if token in freq` before incrementing." },
          { order: 1, text: "Or use `dict.get(key, 0) + 1` to handle missing keys cleanly." },
          { order: 2, text: "`from collections import Counter; return dict(Counter(tokens))`" },
        ],
      },
      {
        id: "inverted-index",
        moduleId: "hash-maps-ai",
        slug: "inverted-index",
        title: "Inverted Index Builder",
        difficulty: "medium",
        estimatedMinutes: 20,
        xpReward: 100,
        conceptHook: "How Elasticsearch finds documents in milliseconds",
        aiContext:
          "Every search engine — Elasticsearch, Solr, Lucene — is built on an inverted index. For RAG, it's how BM25 retrieval works before the vector search stage.",
        description: `## Inverted Index

Given a list of documents (strings), build an inverted index: a mapping from each unique word to the sorted list of document indices containing it.

\`\`\`python
build_inverted_index(["cat sat", "cat runs"])
# → {"cat": [0, 1], "sat": [0], "runs": [1]}
\`\`\`

**Constraints:**
- Split documents on whitespace
- Lowercase all words
- Strip punctuation (.,!?;:) from words
- Each doc index appears at most once per word (deduplicate)
- Sort the index lists in ascending order`,
        starterCode: `import re

def build_inverted_index(docs: list[str]) -> dict[str, list[int]]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "basic index",
            callExpression: "build_inverted_index(['cat sat', 'cat runs'])",
            expectedOutput: "{'cat': [0, 1], 'sat': [0], 'runs': [1]}",
          },
          {
            id: "tc2",
            description: "word in multiple docs",
            callExpression: "build_inverted_index(['hello world', 'world peace', 'hello again'])",
            expectedOutput: "{'hello': [0, 2], 'world': [0, 1], 'peace': [1], 'again': [2]}",
          },
          {
            id: "tc3",
            description: "punctuation stripped and lowercased",
            callExpression: "build_inverted_index(['Hello, world!'])",
            expectedOutput: "{'hello': [0], 'world': [0]}",
          },
        ],
        hints: [
          { order: 0, text: "Use `re.sub(r'[.,!?;:]', '', word)` to strip punctuation." },
          { order: 1, text: "Use a defaultdict(set) to collect doc indices per word, then convert to sorted list." },
          { order: 2, text: "Iterate with `for i, doc in enumerate(docs)` to track document indices." },
        ],
      },
      {
        id: "tfidf-score",
        moduleId: "hash-maps-ai",
        slug: "tfidf-score",
        title: "TF-IDF Score",
        difficulty: "medium",
        estimatedMinutes: 15,
        xpReward: 100,
        conceptHook: "The weighting scheme that made early search engines possible",
        aiContext:
          "TF-IDF is still used in BM25 (the default Elasticsearch ranking algorithm) and as a baseline for RAG retrieval. Understanding it explains why rare terms are more informative than common ones.",
        description: `## TF-IDF

TF-IDF (Term Frequency–Inverse Document Frequency) scores how important a term is in a document relative to a corpus.

**TF** = count of term in doc / total tokens in doc
**IDF** = log(total docs / docs containing term)
**TF-IDF** = TF × IDF

\`\`\`python
tfidf("cat", ["cat", "sat"], [["cat", "sat"], ["dog", "runs"]])
# → TF = 0.5, IDF = log(2/1) ≈ 0.693, result ≈ 0.347
\`\`\`

Use natural log (\`math.log\`). Return 0.0 if term not in doc_tokens.`,
        starterCode: `import math

def tfidf(term: str, doc_tokens: list[str], all_docs: list[list[str]]) -> float:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "term not in doc → 0.0",
            callExpression: "round(tfidf('dog', ['cat', 'sat'], [['cat', 'sat'], ['dog']]), 5)",
            expectedOutput: "0.0",
          },
          {
            id: "tc2",
            description: "term in all docs → low IDF",
            callExpression: "round(tfidf('the', ['the', 'cat'], [['the', 'cat'], ['the', 'dog']]), 5)",
            expectedOutput: "0.0",
          },
          {
            id: "tc3",
            description: "rare term → high score",
            callExpression: "round(tfidf('cat', ['cat', 'sat'], [['cat', 'sat'], ['dog', 'runs'], ['bird', 'flies']]) > 0, 5)",
            expectedOutput: "True",
          },
        ],
        hints: [
          { order: 0, text: "TF: `doc_tokens.count(term) / len(doc_tokens)`." },
          { order: 1, text: "IDF: `math.log(len(all_docs) / docs_with_term)` where docs_with_term = sum(1 for d in all_docs if term in d)." },
          { order: 2, text: "If `term not in doc_tokens`, return 0.0 immediately to avoid division issues." },
        ],
      },
    ],
  },

  // ─── MODULE 3: Heaps & Top-K Search ────────────────────────────────────────
  {
    id: "heaps-topk",
    slug: "heaps-topk",
    title: "Heaps & Top-K Search",
    description: "Efficiently find the best candidates without sorting everything.",
    aiContext:
      "Beam search (used in every LLM decoder), recommendation top-K retrieval, and log-probability ranking all rely on heap-based priority queues.",
    icon: "Triangle",
    accentColor: "#f59e0b",
    order: 2,
    estimatedMinutes: 40,
    totalXP: 350,
    challenges: [
      {
        id: "min-heap",
        moduleId: "heaps-topk",
        slug: "min-heap",
        title: "Min-Heap from Scratch",
        difficulty: "medium",
        estimatedMinutes: 15,
        xpReward: 100,
        conceptHook: "The data structure inside Python's heapq",
        aiContext:
          "Min-heaps power priority queues used in Dijkstra's graph search, beam search decoding, and top-K candidate selection in recommendation systems.",
        description: `## Min-Heap

Implement a MinHeap class with these methods:
- \`push(val)\` — insert a value
- \`pop() -> int\` — remove and return the minimum value
- \`peek() -> int\` — return minimum without removing
- \`__len__\` — return current size

The heap property: every parent is ≤ its children.

**Constraints:**
- \`pop()\` and \`peek()\` on an empty heap should raise \`IndexError\`
- Use a list as the underlying storage (index 0 = root)`,
        starterCode: `class MinHeap:
    def __init__(self):
        self._data: list[int] = []

    def push(self, val: int) -> None:
        # Add val and restore heap property (bubble up)
        pass

    def pop(self) -> int:
        # Remove/return min, restore heap property (bubble down)
        pass

    def peek(self) -> int:
        # Return min without removing
        pass

    def __len__(self) -> int:
        return len(self._data)
`,
        testCases: [
          {
            id: "tc1",
            description: "pop order is ascending",
            callExpression: "(lambda h: [h.push(x) or None for x in [3,1,4,1,5]] and [h.pop() for _ in range(5)])(MinHeap())",
            expectedOutput: "[1, 1, 3, 4, 5]",
          },
          {
            id: "tc2",
            description: "peek does not mutate",
            callExpression: "(lambda h: (h.push(7), h.push(2), h.peek(), len(h)))(MinHeap())",
            expectedOutput: "(None, None, 2, 2)",
          },
          {
            id: "tc3",
            description: "pop empty raises IndexError",
            callExpression: "_raises(lambda: MinHeap().pop(), IndexError)",
            expectedOutput: "True",
          },
        ],
        hints: [
          { order: 0, text: "For a node at index i: left child = 2i+1, right child = 2i+2, parent = (i-1)//2." },
          { order: 1, text: "push: append to end, then 'bubble up' by swapping with parent while parent > child." },
          { order: 2, text: "pop: swap root with last element, remove last, then 'bubble down' by swapping with the smaller child." },
        ],
      },
      {
        id: "topk-tokens",
        moduleId: "heaps-topk",
        slug: "topk-tokens",
        title: "Top-K Frequent Tokens",
        difficulty: "easy",
        estimatedMinutes: 10,
        xpReward: 50,
        conceptHook: "How language model vocabulary is built (BPE step 1)",
        aiContext:
          "Finding the K most frequent tokens is step 1 of BPE tokenization and vocabulary selection. It's also used to find top-K candidates in retrieval and ranking systems.",
        description: `## Top-K Frequent Tokens

Given a list of string tokens and an integer k, return the k most frequent tokens.

Order of returned tokens doesn't matter. If k ≥ vocab size, return all tokens.

\`\`\`python
top_k_tokens(["a", "b", "a", "c", "b", "a"], k=2)
# → ["a", "b"]  (or ["b", "a"] — order doesn't matter)
\`\`\`

Use \`heapq\` from the standard library.`,
        starterCode: `import heapq

def top_k_tokens(tokens: list[str], k: int) -> list[str]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "top 2 most frequent",
            callExpression: "sorted(top_k_tokens(['a', 'b', 'a', 'c', 'b', 'a'], k=2))",
            expectedOutput: "['a', 'b']",
          },
          {
            id: "tc2",
            description: "k larger than vocab returns all",
            callExpression: "sorted(top_k_tokens(['x', 'y'], k=10))",
            expectedOutput: "['x', 'y']",
          },
          {
            id: "tc3",
            description: "single token",
            callExpression: "top_k_tokens(['hello', 'hello', 'hello'], k=1)",
            expectedOutput: "['hello']",
          },
        ],
        hints: [
          { order: 0, text: "Count frequencies first with a dict or Counter." },
          { order: 1, text: "`heapq.nlargest(k, freq.items(), key=lambda x: x[1])` returns top-k by value." },
          { order: 2, text: "Extract just the token names from the result tuples." },
        ],
      },
      {
        id: "beam-search",
        moduleId: "heaps-topk",
        slug: "beam-search",
        title: "Beam Search Simulation",
        difficulty: "hard",
        estimatedMinutes: 15,
        xpReward: 200,
        conceptHook: "The decoder loop that generates every GPT output token",
        aiContext:
          "Beam search keeps the top-B candidate sequences at each generation step, pruning the exponential search space. Every sequence-to-sequence model uses it for decoding.",
        description: `## Beam Search

Simulate greedy beam search over a sequence of token log-probabilities.

\`log_probs[t][v]\` = log-probability of token v at step t.

At each step, expand each beam by all possible next tokens, keeping only the top \`beam_width\` sequences by **cumulative log-probability**.

Return the token sequence of the **best** (highest cumulative log-prob) beam.

\`\`\`python
# 2 steps, 3 tokens each
beam_search([[-1, -2, -3], [-1, -0.5, -2]], beam_width=2)
# Step 0: keep beams [0] and [1] (log-probs -1, -2)
# Step 1: expand [0]→ -1+-1=-2, -1+-0.5=-1.5, -1+-2=-3
#         expand [1]→ -2+-1=-3, -2+-0.5=-2.5, -2+-2=-4
# Top 2: [0,1]=-1.5, [1,1]=-2.5
# Best: [0, 1]
\`\`\``,
        starterCode: `import heapq

def beam_search(log_probs: list[list[float]], beam_width: int) -> list[int]:
    # log_probs[step][token_id] = log probability
    # Return the token sequence of the best beam
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "beam_width=1 equals greedy",
            callExpression: "beam_search([[-1, -2, -3], [-0.5, -1, -2]], beam_width=1)",
            expectedOutput: "[0, 0]",
          },
          {
            id: "tc2",
            description: "beam search finds better path",
            callExpression: "beam_search([[-1, -0.1], [-2, -0.1]], beam_width=2)",
            expectedOutput: "[1, 1]",
          },
          {
            id: "tc3",
            description: "single step returns best token",
            callExpression: "beam_search([[-3, -1, -2]], beam_width=2)",
            expectedOutput: "[1]",
          },
        ],
        hints: [
          { order: 0, text: "Start with one beam: `[(0.0, [])]` meaning (cumulative_log_prob, token_sequence)." },
          { order: 1, text: "At each step, for every beam, try all tokens. New score = beam_score + log_probs[step][token]." },
          { order: 2, text: "Keep only the top beam_width beams using `heapq.nlargest` or sorting." },
        ],
      },
    ],
  },

  // ─── MODULE 4: Graphs & Knowledge Graphs ───────────────────────────────────
  {
    id: "graphs-knowledge",
    slug: "graphs-knowledge",
    title: "Graphs & Knowledge Graphs",
    description: "Traverse the structures powering AI reasoning and retrieval.",
    aiContext:
      "Knowledge graphs power entity resolution in RAG systems. Graph traversal is how LLM tool-calling agents explore multi-hop reasoning chains.",
    icon: "Network",
    accentColor: "#10b981",
    order: 3,
    estimatedMinutes: 45,
    totalXP: 300,
    challenges: [
      {
        id: "bfs-path",
        moduleId: "graphs-knowledge",
        slug: "bfs-path",
        title: "BFS Shortest Path",
        difficulty: "easy",
        estimatedMinutes: 15,
        xpReward: 50,
        conceptHook: "Shortest path in a knowledge graph = multi-hop reasoning",
        aiContext:
          "Multi-hop question answering traverses a knowledge graph to find how two entities are related. BFS guarantees the shortest reasoning chain.",
        description: `## BFS Shortest Path

Given an adjacency list (directed graph) and start/end nodes, return the **shortest path** from start to end as a list of node names.

Return an empty list if no path exists.

\`\`\`python
graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
bfs_path(graph, "A", "D")
# → ["A", "B", "D"] or ["A", "C", "D"] (either shortest)
\`\`\`

**Constraints:**
- Return \`[start]\` if start == end
- Handle disconnected nodes`,
        starterCode: `from collections import deque

def bfs_path(graph: dict[str, list[str]], start: str, end: str) -> list[str]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "direct edge",
            callExpression: "bfs_path({'A': ['B'], 'B': []}, 'A', 'B')",
            expectedOutput: "['A', 'B']",
          },
          {
            id: "tc2",
            description: "start equals end",
            callExpression: "bfs_path({'A': ['B'], 'B': []}, 'A', 'A')",
            expectedOutput: "['A']",
          },
          {
            id: "tc3",
            description: "unreachable returns empty",
            callExpression: "bfs_path({'A': ['B'], 'C': []}, 'A', 'C')",
            expectedOutput: "[]",
          },
          {
            id: "tc4",
            description: "multi-hop path length",
            callExpression: "len(bfs_path({'A': ['B'], 'B': ['C'], 'C': ['D'], 'D': []}, 'A', 'D'))",
            expectedOutput: "4",
          },
        ],
        hints: [
          { order: 0, text: "Use a deque as the BFS queue. Start with `deque([[start]])`." },
          { order: 1, text: "Track visited nodes in a set to avoid cycles." },
          { order: 2, text: "Store paths in the queue, not just nodes: `queue.append(path + [neighbor])`." },
        ],
      },
      {
        id: "dfs-reachability",
        moduleId: "graphs-knowledge",
        slug: "dfs-reachability",
        title: "DFS Entity Reachability",
        difficulty: "easy",
        estimatedMinutes: 10,
        xpReward: 50,
        conceptHook: "Can the RAG system connect entity A to entity B?",
        aiContext:
          "Reachability queries on knowledge graphs determine whether two concepts are related — a fundamental primitive in entity linking and knowledge graph completion.",
        description: `## DFS Reachability

Given a directed adjacency list, return \`True\` if \`target\` is reachable from \`start\` following directed edges, \`False\` otherwise.

\`\`\`python
can_reach({"A": ["B"], "B": ["C"], "C": []}, "A", "C")  # → True
can_reach({"A": ["B"], "B": [], "C": []}, "A", "C")      # → False
\`\`\``,
        starterCode: `def can_reach(graph: dict[str, list[str]], start: str, target: str) -> bool:
    # Your implementation here (DFS)
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "reachable multi-hop",
            callExpression: "can_reach({'A': ['B'], 'B': ['C'], 'C': []}, 'A', 'C')",
            expectedOutput: "True",
          },
          {
            id: "tc2",
            description: "unreachable",
            callExpression: "can_reach({'A': ['B'], 'B': [], 'C': []}, 'A', 'C')",
            expectedOutput: "False",
          },
          {
            id: "tc3",
            description: "start equals target",
            callExpression: "can_reach({'A': ['B'], 'B': []}, 'A', 'A')",
            expectedOutput: "True",
          },
          {
            id: "tc4",
            description: "handles cycles without infinite loop",
            callExpression: "can_reach({'A': ['B'], 'B': ['A'], 'C': []}, 'A', 'C')",
            expectedOutput: "False",
          },
        ],
        hints: [
          { order: 0, text: "Use a `visited` set to handle cycles." },
          { order: 1, text: "Recursively call `can_reach` on each neighbor, or use an iterative stack." },
          { order: 2, text: "Base cases: if start == target return True; if start in visited return False." },
        ],
      },
      {
        id: "pagerank-step",
        moduleId: "graphs-knowledge",
        slug: "pagerank-step",
        title: "PageRank (One Iteration)",
        difficulty: "hard",
        estimatedMinutes: 20,
        xpReward: 200,
        conceptHook: "How Google ranked pages — now used to rank knowledge graph nodes",
        aiContext:
          "PageRank (and its variants) is used to score entity importance in knowledge graphs. Modern graph neural networks often initialize node features with PageRank scores.",
        description: `## PageRank — Single Iteration

Run **one full iteration** of the PageRank algorithm from uniform initial ranks.

**Formula** (for each node v):
\`\`\`
rank[v] = (1 - d) / N + d * sum(rank[u] / out_degree[u] for u in in_neighbors[v])
\`\`\`

Where:
- \`d\` = damping factor (default 0.85)
- \`N\` = total number of nodes
- Nodes with no outgoing edges (sink nodes) distribute their rank equally to all nodes

**Constraints:**
- \`adjacency\` is a dict mapping node → list of nodes it links TO
- All nodes in the graph must appear as keys (even if no outgoing edges)
- Returned ranks should sum to 1.0 (within floating point tolerance)`,
        starterCode: `def pagerank_step(adjacency: dict[str, list[str]], damping: float = 0.85) -> dict[str, float]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "ranks sum to 1.0",
            callExpression: "round(sum(pagerank_step({'A': ['B'], 'B': ['A']}).values()), 5)",
            expectedOutput: "1.0",
          },
          {
            id: "tc2",
            description: "isolated node gets base rank",
            callExpression: "round(pagerank_step({'A': [], 'B': [], 'C': []})['A'], 5)",
            expectedOutput: "0.33333",
          },
          {
            id: "tc3",
            description: "linked node has higher rank than isolated",
            callExpression: "pagerank_step({'A': ['B'], 'B': ['C'], 'C': ['A']})['A'] > 0.0",
            expectedOutput: "True",
          },
        ],
        hints: [
          { order: 0, text: "Start with uniform ranks: `{node: 1/N for node in adjacency}`." },
          { order: 1, text: "For each node v, sum contributions from all nodes u that link to v: `rank[u] / out_degree[u]`." },
          { order: 2, text: "For sink nodes (out_degree=0), add `rank[sink] / N` to every node's new rank." },
        ],
      },
    ],
  },

  // ─── MODULE 5: Trees & Hierarchical Clustering ─────────────────────────────
  {
    id: "trees-clustering",
    slug: "trees-clustering",
    title: "Trees & Hierarchical Clustering",
    description: "Organize embeddings and power gradient boosting models.",
    aiContext:
      "Decision trees underpin gradient boosting (XGBoost/LightGBM — still top Kaggle performers). Hierarchical clustering organizes embedding spaces for semantic deduplication.",
    icon: "GitBranch",
    accentColor: "#f87171",
    order: 4,
    estimatedMinutes: 40,
    totalXP: 250,
    challenges: [
      {
        id: "bst",
        moduleId: "trees-clustering",
        slug: "bst",
        title: "Binary Search Tree",
        difficulty: "easy",
        estimatedMinutes: 10,
        xpReward: 50,
        conceptHook: "The ordered structure behind sorted embedding lookups",
        aiContext:
          "BSTs are the conceptual foundation for KD-trees used in spatial indexing. Understanding BST operations directly maps to understanding how kd-tree ANN search works.",
        description: `## Binary Search Tree

Implement a BST with:
- \`insert(val)\` — insert an integer
- \`search(val) -> bool\` — return True if val exists
- \`inorder() -> list[int]\` — return all values in sorted order (left-root-right)

BST property: left subtree values < node < right subtree values. Ignore duplicate inserts.`,
        starterCode: `class TreeNode:
    def __init__(self, val: int):
        self.val = val
        self.left: 'TreeNode | None' = None
        self.right: 'TreeNode | None' = None

class BST:
    def __init__(self):
        self.root: TreeNode | None = None

    def insert(self, val: int) -> None:
        pass

    def search(self, val: int) -> bool:
        pass

    def inorder(self) -> list[int]:
        pass
`,
        testCases: [
          {
            id: "tc1",
            description: "inorder returns sorted values",
            callExpression: "(lambda t: [t.insert(x) for x in [5,3,7,1,4]] and t.inorder())(BST())",
            expectedOutput: "[1, 3, 4, 5, 7]",
          },
          {
            id: "tc2",
            description: "search finds existing value",
            callExpression: "(lambda t: (t.insert(5), t.insert(3), t.search(3)))(BST())",
            expectedOutput: "(None, None, True)",
          },
          {
            id: "tc3",
            description: "search misses absent value",
            callExpression: "(lambda t: (t.insert(5), t.search(99)))(BST())",
            expectedOutput: "(None, False)",
          },
        ],
        hints: [
          { order: 0, text: "For insert: if val < node.val go left, else go right. Create a new TreeNode at the empty spot." },
          { order: 1, text: "For search: follow the same left/right logic recursively." },
          { order: 2, text: "For inorder: recursively collect `inorder(left) + [val] + inorder(right)`." },
        ],
      },
      {
        id: "agglomerative-step",
        moduleId: "trees-clustering",
        slug: "agglomerative-step",
        title: "Agglomerative Clustering Step",
        difficulty: "medium",
        estimatedMinutes: 20,
        xpReward: 100,
        conceptHook: "Building a dendrogram from sentence embeddings",
        aiContext:
          "Agglomerative clustering is used to deduplicate training datasets and build hierarchical topic trees from document embeddings. One merge step at a time.",
        description: `## Agglomerative Clustering — One Step

Given a list of clusters (each a list of point indices) and a pairwise distance matrix, perform **one merge step** using **single-linkage** (minimum pairwise distance).

Find the two clusters with the smallest minimum pairwise distance, merge them, and return the new cluster list.

\`\`\`python
clusters = [[0, 1], [2], [3]]
dist = [[0,1,5,8],[1,0,3,7],[5,3,0,2],[8,7,2,0]]
agglomerative_step(clusters, dist)
# → [[0,1], [2,3]]  (clusters [2] and [3] merged, min dist = 2)
\`\`\``,
        starterCode: `def agglomerative_step(
    clusters: list[list[int]],
    dist_matrix: list[list[float]]
) -> list[list[int]]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "merges closest pair",
            callExpression: "[sorted(c) for c in agglomerative_step([[0,1],[2],[3]], [[0,1,5,8],[1,0,3,7],[5,3,0,2],[8,7,2,0]])]",
            expectedOutput: "[[0, 1], [2, 3]]",
          },
          {
            id: "tc2",
            description: "two clusters merge to one",
            callExpression: "[sorted(c) for c in agglomerative_step([[0],[1]], [[0,2],[2,0]])]",
            expectedOutput: "[[0, 1]]",
          },
          {
            id: "tc3",
            description: "result has one fewer cluster",
            callExpression: "len(agglomerative_step([[0],[1],[2]], [[0,1,2],[1,0,3],[2,3,0]]))",
            expectedOutput: "2",
          },
        ],
        hints: [
          { order: 0, text: "For each pair of clusters (i, j), compute the min distance: `min(dist[a][b] for a in ci for b in cj)`." },
          { order: 1, text: "Find the pair (i, j) with the overall minimum distance." },
          { order: 2, text: "Build a new cluster list: keep all clusters except i and j, add `clusters[i] + clusters[j]`." },
        ],
      },
      {
        id: "tree-path-encoding",
        moduleId: "trees-clustering",
        slug: "tree-path-encoding",
        title: "Tree Path Encoding",
        difficulty: "medium",
        estimatedMinutes: 10,
        xpReward: 100,
        conceptHook: "How decision tree paths become feature encodings in gradient boosting",
        aiContext:
          "XGBoost uses the leaf index of each tree as a feature for a downstream model — a technique called 'feature transformation'. Tracing the path to a leaf is the core operation.",
        description: `## Tree Path Encoding

Given a decision tree (nested dict) and a feature dict, traverse the tree and return the **leaf label**.

Tree format:
\`\`\`python
{
  "feature": "age",
  "threshold": 30,
  "left": {...},   # feature value <= threshold
  "right": {...},  # feature value > threshold
  "leaf": None     # only present at leaf nodes
}
\`\`\`

At leaf nodes, \`"leaf"\` holds the label string; other keys may be absent.

Return the leaf label string.`,
        starterCode: `def path_to_leaf(tree: dict, x: dict[str, float]) -> str:
    # Traverse tree based on x's feature values
    # Return the leaf label
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "single-level tree goes left",
            callExpression: "path_to_leaf({'feature':'age','threshold':30,'left':{'leaf':'young'},'right':{'leaf':'old'}}, {'age':25})",
            expectedOutput: "'young'",
          },
          {
            id: "tc2",
            description: "single-level tree goes right",
            callExpression: "path_to_leaf({'feature':'age','threshold':30,'left':{'leaf':'young'},'right':{'leaf':'old'}}, {'age':35})",
            expectedOutput: "'old'",
          },
          {
            id: "tc3",
            description: "multi-level tree",
            callExpression: "path_to_leaf({'feature':'age','threshold':30,'left':{'feature':'income','threshold':50,'left':{'leaf':'low'},'right':{'leaf':'mid'}},'right':{'leaf':'old'}}, {'age':25,'income':60})",
            expectedOutput: "'mid'",
          },
        ],
        hints: [
          { order: 0, text: "Check if `'leaf'` is a key in tree and its value is not None — if so, return it." },
          { order: 1, text: "Otherwise, compare `x[tree['feature']]` to `tree['threshold']`." },
          { order: 2, text: "Recurse: if `x[feature] <= threshold` go left, else go right." },
        ],
      },
    ],
  },

  // ─── MODULE 6: Sliding Window & Context Windows ─────────────────────────────
  {
    id: "sliding-window-context",
    slug: "sliding-window-context",
    title: "Sliding Window & Context Windows",
    description: "Process sequences efficiently — from tokens to attention windows.",
    aiContext:
      "Every LLM has a context window. Chunking strategies for RAG are sliding window problems. Tokenization uses a sliding window to find BPE merge candidates.",
    icon: "ScanLine",
    accentColor: "#a78bfa",
    order: 5,
    estimatedMinutes: 40,
    totalXP: 350,
    challenges: [
      {
        id: "fixed-chunker",
        moduleId: "sliding-window-context",
        slug: "fixed-chunker",
        title: "Fixed-Size Chunker",
        difficulty: "easy",
        estimatedMinutes: 10,
        xpReward: 50,
        conceptHook: "How LangChain splits documents for embedding",
        aiContext:
          "RAG systems split long documents into overlapping chunks before embedding. The overlap ensures context isn't lost at chunk boundaries — a direct application of sliding window.",
        description: `## Fixed-Size Chunker

Split a list of tokens into overlapping fixed-size chunks.

Parameters:
- \`chunk_size\`: number of tokens per chunk
- \`overlap\`: number of tokens shared between consecutive chunks

\`\`\`python
chunk_tokens(["a","b","c","d","e"], chunk_size=3, overlap=1)
# → [["a","b","c"], ["c","d","e"]]
\`\`\`

**Constraints:**
- Raise \`ValueError\` if overlap >= chunk_size
- Include a final chunk even if it's smaller than chunk_size
- Step between chunks = chunk_size - overlap`,
        starterCode: `def chunk_tokens(tokens: list[str], chunk_size: int, overlap: int) -> list[list[str]]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "basic overlap chunking",
            callExpression: "chunk_tokens(['a','b','c','d','e'], chunk_size=3, overlap=1)",
            expectedOutput: "[['a', 'b', 'c'], ['c', 'd', 'e']]",
          },
          {
            id: "tc2",
            description: "no overlap",
            callExpression: "chunk_tokens(['a','b','c','d'], chunk_size=2, overlap=0)",
            expectedOutput: "[['a', 'b'], ['c', 'd']]",
          },
          {
            id: "tc3",
            description: "remainder chunk included",
            callExpression: "chunk_tokens(['a','b','c','d','e'], chunk_size=3, overlap=0)",
            expectedOutput: "[['a', 'b', 'c'], ['d', 'e']]",
          },
          {
            id: "tc4",
            description: "single token list",
            callExpression: "chunk_tokens(['a'], chunk_size=3, overlap=1)",
            expectedOutput: "[['a']]",
          },
        ],
        hints: [
          { order: 0, text: "Step = chunk_size - overlap. Use `range(0, len(tokens), step)` for start indices." },
          { order: 1, text: "Each chunk: `tokens[i : i + chunk_size]`." },
          { order: 2, text: "Filter out empty chunks with `if chunk` when appending." },
        ],
      },
      {
        id: "kadane-window",
        moduleId: "sliding-window-context",
        slug: "kadane-window",
        title: "Maximum Sum Subarray (Kadane's)",
        difficulty: "medium",
        estimatedMinutes: 15,
        xpReward: 100,
        conceptHook: "Find the most information-dense window in a score sequence",
        aiContext:
          "Kadane's algorithm finds the contiguous window with maximum value sum. In NLP it's used to find the most relevant passage span within a longer document for extractive QA.",
        description: `## Kadane's Algorithm

Find the contiguous subarray with the **maximum sum** and return \`(start_index, end_index, sum)\`.

\`\`\`python
max_dense_window([−2, 1, −3, 4, −1, 2, 1, −5, 4])
# → (3, 6, 6)   # subarray [4,−1,2,1] sums to 6
\`\`\`

**Constraints:**
- If all values are negative, return the single maximum element
- end_index is **inclusive**
- Return the first occurrence in case of ties`,
        starterCode: `def max_dense_window(scores: list[float]) -> tuple[int, int, float]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "classic Kadane example",
            callExpression: "max_dense_window([-2, 1, -3, 4, -1, 2, 1, -5, 4])",
            expectedOutput: "(3, 6, 6)",
          },
          {
            id: "tc2",
            description: "all negative returns max element",
            callExpression: "max_dense_window([-3, -1, -2])",
            expectedOutput: "(1, 1, -1)",
          },
          {
            id: "tc3",
            description: "single element",
            callExpression: "max_dense_window([42])",
            expectedOutput: "(0, 0, 42)",
          },
        ],
        hints: [
          { order: 0, text: "Track `current_sum`, `current_start`, `best_sum`, `best_start`, `best_end`." },
          { order: 1, text: "At each index: if current_sum + scores[i] < scores[i], start a new window at i." },
          { order: 2, text: "Update best whenever current_sum > best_sum." },
        ],
      },
      {
        id: "bpe-merge-step",
        moduleId: "sliding-window-context",
        slug: "bpe-merge-step",
        title: "BPE Merge Step",
        difficulty: "hard",
        estimatedMinutes: 15,
        xpReward: 200,
        conceptHook: "One iteration of the algorithm that created GPT's tokenizer",
        aiContext:
          "Byte-Pair Encoding is the tokenization algorithm used by GPT-2, GPT-3, GPT-4, LLaMA, and most modern LLMs. Each merge step finds the most frequent adjacent symbol pair and merges them.",
        description: `## BPE Merge Step

Given a vocabulary (list of token sequences), perform **one BPE merge step**:

1. Find the most frequent adjacent pair across all sequences
2. Merge all occurrences of that pair into a single symbol
3. Return \`(pair, new_vocab)\`

\`\`\`python
vocab = [["l","o","w"], ["l","o","w","e","r"], ["n","e","w"]]
bpe_merge_step(vocab)
# Most frequent pair: ("l","o") appears 2 times
# → (("l","o"), [["lo","w"], ["lo","w","e","r"], ["n","e","w"]])
\`\`\`

Return \`(None, vocab)\` if no pairs exist.`,
        starterCode: `def bpe_merge_step(
    vocab: list[list[str]]
) -> tuple[tuple[str, str] | None, list[list[str]]]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "merges most frequent pair",
            callExpression: "bpe_merge_step([['l','o','w'],['l','o','w','e','r'],['n','e','w']])[0]",
            expectedOutput: "('l', 'o')",
          },
          {
            id: "tc2",
            description: "result vocab has merged tokens",
            callExpression: "bpe_merge_step([['l','o','w'],['l','o','w','e','r'],['n','e','w']])[1]",
            expectedOutput: "[['lo', 'w'], ['lo', 'w', 'e', 'r'], ['n', 'e', 'w']]",
          },
          {
            id: "tc3",
            description: "single token sequences → no pairs",
            callExpression: "bpe_merge_step([['a'],['b']])[0]",
            expectedOutput: "None",
          },
        ],
        hints: [
          { order: 0, text: "Count adjacent pairs using a dict: for each sequence, zip(seq, seq[1:])." },
          { order: 1, text: "Find the pair with `max(pair_counts, key=pair_counts.get)`." },
          { order: 2, text: "Merge: iterate each sequence and join consecutive tokens that match the best pair." },
        ],
      },
    ],
  },

  // ─── MODULE 7: Sorting & Approximate Nearest Neighbor ─────────────────────
  {
    id: "sorting-ann",
    slug: "sorting-ann",
    title: "Sorting & Approximate Nearest Neighbor",
    description: "Speed up vector search from O(n) to sub-linear.",
    aiContext:
      "ANN indexes (FAISS, HNSW) trade exact search for speed. Understanding when to sort vs. partition is core to building fast vector search systems.",
    icon: "Zap",
    accentColor: "#fbbf24",
    order: 6,
    estimatedMinutes: 40,
    totalXP: 400,
    challenges: [
      {
        id: "quickselect",
        moduleId: "sorting-ann",
        slug: "quickselect",
        title: "Quickselect (Top-K without Full Sort)",
        difficulty: "medium",
        estimatedMinutes: 15,
        xpReward: 100,
        conceptHook: "O(n) nearest-neighbor candidate selection",
        aiContext:
          "Finding top-K nearest neighbors without sorting the entire corpus saves massive time at scale. Quickselect is the basis of partial_sort used in FAISS candidate pre-filtering.",
        description: `## Quickselect

Return the **k smallest elements** from a list in **any order** (no need to sort them).

Use the Quickselect algorithm (partition-based) for average O(n) time.

\`\`\`python
quickselect_k_smallest([3, 1, 4, 1, 5, 9, 2], k=3)
# → [1, 1, 2]  (any order — just the 3 smallest values)
\`\`\`

**Constraints:**
- If k >= len(arr), return a copy of the whole array
- You may modify a copy of the input`,
        starterCode: `def quickselect_k_smallest(arr: list[float], k: int) -> list[float]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "returns k smallest values",
            callExpression: "sorted(quickselect_k_smallest([3,1,4,1,5,9,2], k=3))",
            expectedOutput: "[1, 1, 2]",
          },
          {
            id: "tc2",
            description: "k=1 returns minimum",
            callExpression: "quickselect_k_smallest([5,3,8,1,9], k=1)",
            expectedOutput: "[1]",
          },
          {
            id: "tc3",
            description: "k >= len returns all",
            callExpression: "sorted(quickselect_k_smallest([3,1,2], k=10))",
            expectedOutput: "[1, 2, 3]",
          },
          {
            id: "tc4",
            description: "all equal elements",
            callExpression: "sorted(quickselect_k_smallest([5,5,5,5], k=2))",
            expectedOutput: "[5, 5]",
          },
        ],
        hints: [
          { order: 0, text: "Choose a pivot, partition the array into [smaller, equal, larger]." },
          { order: 1, text: "If k <= len(smaller): recurse on smaller. If k <= len(smaller)+len(equal): return smaller+equal[:k-len(smaller)]." },
          { order: 2, text: "Otherwise: return smaller + equal + quickselect(larger, k - len(smaller) - len(equal))." },
        ],
      },
      {
        id: "lsh-buckets",
        moduleId: "sorting-ann",
        slug: "lsh-buckets",
        title: "LSH Bucket Assignment",
        difficulty: "medium",
        estimatedMinutes: 15,
        xpReward: 100,
        conceptHook: "How FAISS groups vectors before exact search",
        aiContext:
          "Locality-Sensitive Hashing is the foundation of FAISS's IVF (Inverted File Index). Random projection hashing maps similar vectors to the same bucket with high probability.",
        description: `## LSH Random Projection

Assign each vector to a bucket using random projection hashing:

1. Generate \`num_planes\` random hyperplanes (use \`random\` seeded by \`seed\`)
2. For each vector, compute a binary code: bit[i] = 1 if dot(vector, plane_i) >= 0, else 0
3. Convert the binary code to an integer bucket ID

\`\`\`python
lsh_buckets([[1,0],[0,1],[-1,0]], num_planes=2, seed=42)
# → [some_int, some_int, some_int]  (same vector → same bucket)
\`\`\`

Use \`random.gauss(0, 1)\` for each plane component. Same seed must produce same buckets.`,
        starterCode: `import random

def lsh_buckets(vectors: list[list[float]], num_planes: int, seed: int = 42) -> list[int]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "same vector always same bucket",
            callExpression: "lsh_buckets([[1,0],[1,0]], num_planes=3, seed=42)[0] == lsh_buckets([[1,0],[1,0]], num_planes=3, seed=42)[1]",
            expectedOutput: "True",
          },
          {
            id: "tc2",
            description: "returns one bucket id per vector",
            callExpression: "len(lsh_buckets([[1,0],[0,1],[1,1]], num_planes=4, seed=7))",
            expectedOutput: "3",
          },
          {
            id: "tc3",
            description: "deterministic with same seed",
            callExpression: "lsh_buckets([[1,2,3]], num_planes=3, seed=99) == lsh_buckets([[1,2,3]], num_planes=3, seed=99)",
            expectedOutput: "True",
          },
        ],
        hints: [
          { order: 0, text: "Generate planes: `random.seed(seed)`, then `[[random.gauss(0,1) for _ in range(dim)] for _ in range(num_planes)]`." },
          { order: 1, text: "For each vector, compute bits: `[1 if sum(v*p for v,p in zip(vec,plane)) >= 0 else 0 for plane in planes]`." },
          { order: 2, text: "Convert bits to int: `sum(bit << i for i, bit in enumerate(bits))`." },
        ],
      },
      {
        id: "kway-merge",
        moduleId: "sorting-ann",
        slug: "kway-merge",
        title: "K-Way Merge",
        difficulty: "hard",
        estimatedMinutes: 10,
        xpReward: 200,
        conceptHook: "Sorting embedding corpora larger than RAM",
        aiContext:
          "FAISS builds its indexes by externally sorting embedding shards. K-way merge combines pre-sorted chunks efficiently using a heap — the same pattern used in merge sort and external sort.",
        description: `## K-Way Merge

Given \`k\` already-sorted lists of numbers, merge them into a single sorted list.

Use a **min-heap** for O(n log k) time complexity.

\`\`\`python
kway_merge([[1, 4, 7], [2, 5, 8], [3, 6, 9]])
# → [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\`

**Constraints:**
- Empty chunks should be ignored
- Result length should equal the sum of all chunk lengths`,
        starterCode: `import heapq

def kway_merge(sorted_chunks: list[list[float]]) -> list[float]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "three sorted lists",
            callExpression: "kway_merge([[1,4,7],[2,5,8],[3,6,9]])",
            expectedOutput: "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
          },
          {
            id: "tc2",
            description: "k=1 passthrough",
            callExpression: "kway_merge([[5,3,1]])",
            expectedOutput: "[5, 3, 1]",
          },
          {
            id: "tc3",
            description: "empty chunks ignored",
            callExpression: "kway_merge([[], [1,3], [], [2,4]])",
            expectedOutput: "[1, 2, 3, 4]",
          },
          {
            id: "tc4",
            description: "output length equals total",
            callExpression: "len(kway_merge([[1,2],[3,4],[5]]))",
            expectedOutput: "5",
          },
        ],
        hints: [
          { order: 0, text: "Initialize the heap with the first element from each non-empty chunk: `(val, chunk_idx, element_idx)`." },
          { order: 1, text: "Pop the min element, add to result, then push the next element from the same chunk." },
          { order: 2, text: "Use `heapq.heappush` and `heapq.heappop`." },
        ],
      },
    ],
  },

  // ─── MODULE 8: Dynamic Programming ─────────────────────────────────────────
  {
    id: "dynamic-programming",
    slug: "dynamic-programming",
    title: "Dynamic Programming for Fuzzy Matching",
    description: "Power deduplication, spell correction, and sequence alignment.",
    aiContext:
      "Edit distance powers fuzzy deduplication of training data, spell-correction in chatbots, and code diff in AI code review tools. LCS underlies diff algorithms.",
    icon: "GitMerge",
    accentColor: "#34d399",
    order: 7,
    estimatedMinutes: 35,
    totalXP: 400,
    challenges: [
      {
        id: "edit-distance",
        moduleId: "dynamic-programming",
        slug: "edit-distance",
        title: "Edit Distance (Levenshtein)",
        difficulty: "medium",
        estimatedMinutes: 15,
        xpReward: 100,
        conceptHook: "How spell-checkers and training-data dedup work",
        aiContext:
          "Levenshtein distance is used by MinHash-LSH deduplication pipelines (like those used to clean Common Crawl for LLM pretraining) and by fuzzy string matching in chatbot intent detection.",
        description: `## Edit Distance

Compute the minimum number of single-character edits (insert, delete, substitute) to transform \`s1\` into \`s2\`.

\`\`\`python
edit_distance("kitten", "sitting")  # → 3
edit_distance("", "abc")            # → 3
edit_distance("abc", "abc")         # → 0
\`\`\`

Use dynamic programming with a 2D table for O(m·n) time.`,
        starterCode: `def edit_distance(s1: str, s2: str) -> int:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "kitten→sitting classic",
            callExpression: "edit_distance('kitten', 'sitting')",
            expectedOutput: "3",
          },
          {
            id: "tc2",
            description: "identical strings",
            callExpression: "edit_distance('abc', 'abc')",
            expectedOutput: "0",
          },
          {
            id: "tc3",
            description: "empty string to abc",
            callExpression: "edit_distance('', 'abc')",
            expectedOutput: "3",
          },
          {
            id: "tc4",
            description: "single char difference",
            callExpression: "edit_distance('cat', 'cut')",
            expectedOutput: "1",
          },
        ],
        hints: [
          { order: 0, text: "Create a (m+1) × (n+1) table where dp[i][j] = edit distance between s1[:i] and s2[:j]." },
          { order: 1, text: "Base cases: dp[i][0] = i, dp[0][j] = j." },
          { order: 2, text: "If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1], else min(dp[i-1][j-1]+1, dp[i-1][j]+1, dp[i][j-1]+1)." },
        ],
      },
      {
        id: "lcs-length",
        moduleId: "dynamic-programming",
        slug: "lcs-length",
        title: "Longest Common Subsequence",
        difficulty: "medium",
        estimatedMinutes: 10,
        xpReward: 100,
        conceptHook: "The core of git diff — and semantic similarity for short texts",
        aiContext:
          "LCS is the foundation of text diff tools (diff, git). In NLP, LCS similarity is used for plagiarism detection and measuring how much two generated summaries agree.",
        description: `## Longest Common Subsequence

Return the **length** of the longest common subsequence of \`s1\` and \`s2\`.

A subsequence preserves relative order but need not be contiguous.

\`\`\`python
lcs_length("ABCBDAB", "BDCAB")  # → 4  (BCAB or BDAB)
lcs_length("abc", "abc")        # → 3
lcs_length("abc", "xyz")        # → 0
\`\`\``,
        starterCode: `def lcs_length(s1: str, s2: str) -> int:
    # Your implementation here (DP table)
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "classic LCS",
            callExpression: "lcs_length('ABCBDAB', 'BDCAB')",
            expectedOutput: "4",
          },
          {
            id: "tc2",
            description: "identical strings",
            callExpression: "lcs_length('abc', 'abc')",
            expectedOutput: "3",
          },
          {
            id: "tc3",
            description: "no common chars",
            callExpression: "lcs_length('abc', 'xyz')",
            expectedOutput: "0",
          },
          {
            id: "tc4",
            description: "empty string",
            callExpression: "lcs_length('abc', '')",
            expectedOutput: "0",
          },
        ],
        hints: [
          { order: 0, text: "Build a (m+1)×(n+1) table. dp[i][j] = LCS length for s1[:i] and s2[:j]." },
          { order: 1, text: "If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1." },
          { order: 2, text: "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])." },
        ],
      },
      {
        id: "fuzzy-dedup",
        moduleId: "dynamic-programming",
        slug: "fuzzy-dedup",
        title: "Fuzzy Deduplication Pipeline",
        difficulty: "hard",
        estimatedMinutes: 10,
        xpReward: 200,
        conceptHook: "Step 1 of cleaning the Common Crawl dataset for LLM pretraining",
        aiContext:
          "Deduplicating training data is critical for LLM quality — duplicated text wastes compute and causes memorization. Fuzzy dedup using edit distance is how SlimPajama and RedPajama cleaned their datasets.",
        description: `## Fuzzy Deduplication

Remove near-duplicate documents from a list.

Process documents in order. For each document, if its edit distance to **any already-accepted document** is ≤ \`threshold\`, discard it. Otherwise, accept it.

\`\`\`python
deduplicate(["hello world", "hello wrold", "goodbye"], threshold=2)
# → ["hello world", "goodbye"]  ("hello wrold" is near-duplicate)
\`\`\`

**Constraints:**
- Return accepted documents in their original order
- threshold=0 means exact match only`,
        starterCode: `def edit_distance(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[:]
        dp[0] = i
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[j] = prev[j-1]
            else:
                dp[j] = 1 + min(prev[j-1], prev[j], dp[j-1])
    return dp[n]

def deduplicate(docs: list[str], threshold: int) -> list[str]:
    # Your implementation here
    pass
`,
        testCases: [
          {
            id: "tc1",
            description: "near-duplicate removed",
            callExpression: "deduplicate(['hello world', 'hello wrold', 'goodbye'], threshold=2)",
            expectedOutput: "['hello world', 'goodbye']",
          },
          {
            id: "tc2",
            description: "no duplicates → all kept",
            callExpression: "deduplicate(['cat', 'dog', 'bird'], threshold=1)",
            expectedOutput: "['cat', 'dog', 'bird']",
          },
          {
            id: "tc3",
            description: "threshold=0 exact match only",
            callExpression: "deduplicate(['abc', 'abc', 'abd'], threshold=0)",
            expectedOutput: "['abc', 'abd']",
          },
          {
            id: "tc4",
            description: "order preserved",
            callExpression: "deduplicate(['a', 'b', 'c'], threshold=0)",
            expectedOutput: "['a', 'b', 'c']",
          },
        ],
        hints: [
          { order: 0, text: "Maintain an `accepted: list[str]` as you iterate." },
          { order: 1, text: "For each doc, check `any(edit_distance(doc, acc) <= threshold for acc in accepted)`." },
          { order: 2, text: "If no near-duplicate found, append to accepted; otherwise skip." },
        ],
      },
    ],
  },
];

export function getChallengeBySlug(slug: string): Challenge | undefined {
  for (const module of MODULES) {
    const challenge = module.challenges.find((c) => c.slug === slug);
    if (challenge) return challenge;
  }
  return undefined;
}

export function getModuleBySlug(slug: string): Module | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getAllChallenges(): Challenge[] {
  return MODULES.flatMap((m) => m.challenges);
}
