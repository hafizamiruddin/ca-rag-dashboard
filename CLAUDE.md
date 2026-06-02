# CLAUDE.md — Project context for Claude Code

## What this is
A starter package for building a **research results dashboard** website for an undergraduate Final Year Project on **Context-Aware Retrieval-Augmented Generation (CA-RAG) for Document Question Answering** (Project 17002R, IIUM, BCS).

The experiments are done. Your job is **only to build the website** that presents the results and analysis. You are not running any ML — all numbers are static and pre-computed in `data/`.

## Read these first, in order
1. `BUILD_BRIEF.md` — the full spec: tech stack, every section, the design direction, and an acceptance checklist. **This is the source of truth.**
2. `data/results.json` — the 12 experimental configurations with TriviaQA + SQuAD BERTScore.
3. `data/findings.json`, `data/dimension-analysis.json`, `data/predictions-sample.json`, `data/project-meta.json`, `data/methodology.json` — supporting content.

## Hard rules
- **Never invent or alter numbers.** Every metric on the site must come from a file in `data/`. If you need a derived figure (e.g. a mean), compute it from those files in code.
- The user will provide a **YouTube demo link later**. Expose one constant `YOUTUBE_ID` and a placeholder fallback — do not hardcode a real video.
- Keep the design **custom and refined** (dark research-console aesthetic, distinctive fonts). No generic UI-kit look, no Inter/Roboto, no purple-on-white gradients. See BUILD_BRIEF §4.
- Static site only. No backend, no database, no auth.

## Suggested workflow
1. Scaffold a Vite + React app at the project root (keep `data/` and the `.md` files; put app code in `src/`).
2. Copy `data/*.json` into `src/data/` (or import via relative path) so it bundles.
3. Build section by section in the order listed in BUILD_BRIEF §3.
4. Wire the toggles/filters, then do the design pass (fonts, colours, motion).
5. Verify against the acceptance checklist. Run `npm run build`.
6. Write/refresh `HOW_TO_RUN.md`.

## Tone of the content you write
Plain, confident, academic-but-readable. When you paraphrase the abstract or findings, rewrite in your own words and keep it concise. The audience is FYP evaluators and expo visitors.
