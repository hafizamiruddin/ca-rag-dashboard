# CA-RAG Results Dashboard — Starter Package

This folder is a ready-to-build package for a website that showcases your FYP results on
**Context-Aware Retrieval-Augmented Generation (CA-RAG) for Document Question Answering**.

You hand this folder to **Claude Code**, and it builds the dashboard for you.

---

## How to use it (with Claude Code)

1. **Download this whole folder** and unzip it somewhere on your computer.

2. Open a terminal in the folder and start Claude Code:
   ```bash
   cd ca-rag-dashboard
   claude
   ```

3. Give it this prompt:
   > Read CLAUDE.md and BUILD_BRIEF.md, then build the dashboard website exactly as specified. Use the data in the data/ folder. When done, run the dev server and tell me how to view it.

4. Claude Code will scaffold a Vite + React app, build all the sections, wire up the
   interactive charts and the prediction explorer, and give you a `npm run dev` command.

5. **Add your demo video** when ready: open the demo video component Claude Code created and
   set the `YOUTUBE_ID` constant to the part of your link after `watch?v=`
   (e.g. for `https://www.youtube.com/watch?v=abc123XYZ`, set `YOUTUBE_ID = "abc123XYZ"`).

6. To publish, ask Claude Code to run `npm run build` and help you deploy the `dist/` folder
   to GitHub Pages, Netlify, or Vercel (all free).

---

## What's inside

```
ca-rag-dashboard/
├── README.md              ← you are here
├── CLAUDE.md              ← context Claude Code reads first
├── BUILD_BRIEF.md         ← the full build spec (sections, design, checklist)
└── data/
    ├── results.json           ← 12 configs · TriviaQA + SQuAD BERTScore P/R/F1 + extras
    ├── dimension-analysis.json← mean F1 by embedding / chunking / post-processing
    ├── findings.json          ← headline conclusions + 5 structured findings
    ├── predictions-sample.json← 60 sample model outputs per config (TriviaQA) for the explorer
    ├── project-meta.json      ← title, authors, supervisor, abstract, objectives, refs
    └── methodology.json       ← the 3-phase CA-RAG pipeline
```

## The data, in one breath

12 configurations = 2 embedding models (Contriever, MiniLM) × 2 chunking strategies
(Semantic, Fixed) × 3 post-processing modes (No PP, Dot Product, Cosine), each evaluated by
**BERTScore** on **TriviaQA** and **SQuAD**. The headline story: the **embedding model**
dominates post-processing quality — Contriever stays strong under similarity filtering while
MiniLM collapses against the fixed τ = 0.6 threshold.

> Note: per-question model outputs (for the Prediction Explorer) exist for **TriviaQA only**.
> SQuAD has aggregate BERTScore numbers but no per-question predictions in this dataset.

---

## Don't want to use Claude Code?
The data files are plain JSON — you can build the site in any framework you like, or ask
any assistant to follow `BUILD_BRIEF.md`. Nothing here is locked to a particular tool.
