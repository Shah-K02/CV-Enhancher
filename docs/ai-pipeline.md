# AI Pipeline Documentation

## CV Enhancer — AI Engineering Design

**Version:** 1.0  
**Last Updated:** July 2026

---

## Overview

The AI pipeline is designed around three principles:

1. **Modularity** — Each AI component is a standalone class with a single responsibility
2. **Testability** — `MOCK_AI_MODE=true` runs the entire pipeline without any API calls
3. **Replaceability** — The vector store, LLM provider, and embedding model are all abstracted behind interfaces

---

## Component 1: Text Extraction

**File:** `backend/app/ai/text_extractor.py`

### PDF Extraction (PyMuPDF)
- Opens the PDF with `fitz.open()`
- Iterates every page and calls `page.get_text("text")`
- Joins page content with newlines
- Post-processes: collapses multiple blank lines, strips leading/trailing whitespace

### DOCX Extraction (python-docx)
- Opens with `Document(file_path)`
- Iterates `document.paragraphs` and joins text
- Also iterates tables: for each row, joins cell text
- This captures CVs that use table-based layouts

### Why PyMuPDF over pdfplumber?
PyMuPDF (fitz) is significantly faster (~3x) and handles complex PDF layouts including multi-column CVs better than pdfplumber. It also has built-in support for encrypted PDFs.

---

## Component 2: Embedding & Chunking

**File:** `backend/app/ai/embedder.py`

### Chunking Strategy
Uses LangChain's `RecursiveCharacterTextSplitter`:
- `chunk_size=500` characters
- `chunk_overlap=50` characters (5% overlap preserves context at boundaries)
- Splits on: `\n\n` → `\n` → ` ` → `""` (hierarchical)

**Why 500 characters?** 
The embedding model (`text-embedding-3-small`) has a context window of 8,191 tokens. 500 characters is approximately 100-125 tokens — small enough to be semantically focused, large enough to contain meaningful content from a single bullet point or paragraph.

### Embedding Model
- **Model:** `text-embedding-3-small` (OpenAI)
- **Dimensions:** 1,536
- **Why this model?** 
  - Best price/quality ratio in the OpenAI embedding family
  - 5x cheaper than `text-embedding-ada-002` with better performance on retrieval benchmarks (MTEB)
  - `text-embedding-3-large` (3,072 dims) offers marginal improvement but 6x cost increase — not justified for CV text

### Mock Mode
In mock mode, each chunk is assigned a random 1,536-dimensional vector sampled from `N(0, 0.1)`. The vector store still builds a valid FAISS index, and similarity search still works — just not semantically meaningful. This allows full end-to-end testing of the pipeline without an API key.

---

## Component 3: Vector Store (FAISS)

**File:** `backend/app/ai/vector_store.py`

### Index Structure
```
faiss_indexes/
└── {user_id}/
    ├── {cv_id}.faiss      # The FAISS FlatL2 index (binary)
    └── {cv_id}.chunks.pkl  # Pickled list of text chunks (for retrieval)
```

### Index Type: FlatL2
Uses `faiss.IndexFlatL2` — an exact nearest-neighbour search using L2 (Euclidean) distance. 

**Why FlatL2 over IVF/HNSW?**
A typical CV has 50-200 chunks. At this scale, approximate nearest neighbour algorithms (IVF, HNSW) offer no performance benefit and add complexity. FlatL2 is exact, simple, and fast for small indexes.

### Lifecycle
1. **Build**: called after text extraction on CV upload (background task)
2. **Search**: called on every chat message
3. **Delete**: called when user deletes a CV

---

## Component 4: CV Analyser

**File:** `backend/app/ai/analyser.py`

### Prompt Design

```
System:
You are an expert CV reviewer and career coach. Analyse the following CV and return a structured evaluation.

Your analysis MUST cover these 6 sections:
1. Structure & Formatting (is the CV well-organised and easy to scan?)
2. ATS Compatibility (would this pass automated screening systems?)
3. Keywords & Skills (are relevant technical and soft skills present?)
4. Experience Descriptions (are achievements quantified? Do bullets start with action verbs?)
5. Achievements (are there measurable outcomes and impact?)
6. Grammar & Clarity (is the writing clear, concise, and error-free?)

For each section:
- Provide a score from 0-100
- List 2-4 specific feedback observations
- List 2-4 actionable improvement suggestions

Return your analysis as valid JSON matching this schema: {schema}

CV Text:
{cv_text}
```

### Structured Output
Uses OpenAI's `response_format={"type": "json_object"}` parameter combined with Pydantic model validation to guarantee a parseable response. If parsing fails, a `ValueError` is raised and the API returns a 500 with a user-friendly message.

### Model Selection
- **GPT-4o** for CV analysis — requires deep reading and structured reasoning
- **GPT-4o-mini** for chat — high-frequency, cost-sensitive

---

## Component 5: Job Description Matcher

**File:** `backend/app/ai/jd_matcher.py`

### Algorithm
1. CV text + JD text sent to GPT-4o in a single prompt
2. Model is instructed to:
   - Identify keywords in the JD (technical skills, tools, methodologies, soft skills)
   - Score which of those keywords appear (verbatim or semantically) in the CV
   - Compute an overall match score
   - List missing keywords by priority (most impactful first)
   - Generate specific, actionable recommendations

### Why LLM-based matching vs. keyword counting?
Keyword counting (e.g., TF-IDF matching) misses semantic equivalence: a JD asking for "REST API experience" wouldn't match a CV that says "built HTTP microservices". The LLM understands that these are equivalent, giving a more accurate and useful match score.

---

## Component 6: RAG Chatbot

**File:** `backend/app/ai/chatbot.py`

### RAG Architecture

```
Query
  │
  ├─→ Embed query (text-embedding-3-small)
  │
  ├─→ FAISS similarity search → top-5 CV chunks
  │
  ├─→ Build context prompt:
  │   ┌──────────────────────────────────────────┐
  │   │ SYSTEM: Career coach. Use ONLY context.   │
  │   │ CONTEXT: [chunk 1] [chunk 2] ... [chunk 5]│
  │   │ HISTORY: [last 6 messages]                │
  │   │ USER: [current message]                   │
  │   └──────────────────────────────────────────┘
  │
  └─→ GPT-4o-mini → response
```

### Context Window Management
- Maximum 5 retrieved chunks (~2,500 chars of context)
- Maximum 6 messages of history (3 turns)
- This keeps the prompt under 4,000 tokens, leaving room for the model's response

### Grounding Instruction
The system prompt explicitly instructs the model to **only use information from the provided CV context** — preventing hallucination of achievements or experience that isn't in the CV. If the answer isn't in the context, the model is instructed to say so.

---

## Mock Mode Design

When `MOCK_AI_MODE=true`:

| Component | Mock Behaviour |
|-----------|---------------|
| `Embedder` | Returns random 1536-dim vectors (FAISS index still builds correctly) |
| `Analyser` | Returns a realistic pre-defined `CVAnalysisResponse` with scores in the 50-80 range |
| `JDMatcher` | Returns a pre-defined `JDMatchResponse` with match score 58%, realistic keywords |
| `Chatbot` | Pattern-matches the question and returns one of ~8 pre-written career coaching responses |

This means the **entire application is demonstrable with zero API costs** — every feature works end-to-end.

---

## Performance Characteristics

| Operation | Expected Latency | Notes |
|-----------|-----------------|-------|
| Text extraction (PDF) | < 1s | PyMuPDF is very fast |
| Embedding generation | 1-3s | Depends on chunk count; run in background |
| CV analysis (GPT-4o) | 8-20s | Complex prompt; stream if needed |
| JD matching (GPT-4o) | 8-20s | Similar to analysis |
| Chat (GPT-4o-mini) | 2-8s | Smaller model, shorter prompt |
| FAISS search | < 10ms | Exact search on ~200 vectors is instant |

---

## Future Enhancements

| Enhancement | Complexity | Impact |
|------------|-----------|--------|
| Streaming responses (SSE) | Medium | High — improves perceived latency |
| ChromaDB for persistent vector store | Low | High — eliminates filesystem management |
| CV auto-rewriting | High | Very high — most requested feature |
| Fine-tuned analysis model | Very High | High — domain-specific accuracy |
| Multi-modal CV analysis (parse layout) | High | Medium — handles visual CVs |
