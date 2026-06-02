# BUILD BRIEF — CA-RAG Research Results Dashboard

You are building a polished, single-page **research results dashboard** website for a Final Year Project (FYP) titled *"Context-Aware Retrieval-Augmented Generation Model for Document Question Answering"* (Project 17002R, IIUM). The site presents the project's experimental results and analysis in an intuitive, interactive way, plus a section for a demo YouTube video.

This brief is the source of truth. All data and content you need are already in the `data/` folder — **do not invent numbers**; read them from the JSON files.

---

## 1. Tech stack (recommended)

Build a **Vite + React** single-page app. Reasoning: it bundles cleanly, the data files import as JSON, and it's trivial for the user to `npm run dev` / `npm run build`.

- **Vite + React** (JavaScript or TypeScript — your call, JS is fine)
- **Recharts** for charts (or hand-rolled SVG if you prefer tighter control)
- **Framer Motion** for entrance/scroll animations (optional but encouraged)
- Plain CSS or CSS Modules. **Do not** pull in a heavy UI kit; the look must be custom (see §4).
- No backend. All data is static JSON in `data/`.

Copy the `data/*.json` files into `src/data/` (or import from `../data/`) so they bundle.

Deliverables:
- A working dev server (`npm install && npm run dev`).
- A production build (`npm run build`) that outputs static files deployable to GitHub Pages / Netlify / Vercel.
- A short `HOW_TO_RUN.md` at the project root.

---

## 2. Data files (already provided in `data/`)

| File | What's in it |
|---|---|
| `results.json` | `meta` block + `configurations[]`: all **12 configurations** with TriviaQA **and** SQuAD BERTScore Precision/Recall/F1, plus TriviaQA-only computed extras (`trivia_reject_pct`, `trivia_grounding_pct`, `trivia_avg_answer_len`). Already sorted by TriviaQA F1 descending. |
| `dimension-analysis.json` | Pre-computed mean F1 broken down by embedding / chunking / post-processing, for **both** datasets, plus the embedding×post-processing interaction table for TriviaQA. |
| `findings.json` | `headline_conclusions[]`, five structured `findings[]` (each with title, dimension, summary, explanation, evidence, tag), `behavioural_notes`, `limitations[]`, `next_steps[]`. |
| `predictions-sample.json` | 60 sample model outputs per configuration for TriviaQA (`samples[configName] = [{i, pred, gt, rej}]`). `rej:true` means the model returned "no context provided". For the Prediction Explorer. |
| `project-meta.json` | Title, authors, supervisor, abstract, objectives, problem statement, community impacts, SDGs, tools, key references. For header/about/footer. |
| `methodology.json` | The three-phase pipeline (Indexing / Generation / Post-Processing) with steps and rationale, plus evaluation description. |

The 12 configurations are the cross of: embedding ∈ {Contriever, MiniLM} × chunking ∈ {Semantic, Fixed} × post-processing ∈ {No PP, Dot Product, Cosine}.

### Key data facts (sanity-check your rendering against these)
- Best TriviaQA F1 = **0.8022** (No-PP configs); best PP config = Contriever + Semantic + Dot = **0.7941**.
- MiniLM filtering collapses: Semantic MiniLM 0.8019 (No PP) → 0.6083 (Cosine/Dot). Fixed 0.8022 → 0.5563.
- SQuAD always scores higher than TriviaQA for the same config.
- For MiniLM, Cosine and Dot Product are **identical** (L2-normalised embeddings). For Contriever they differ.

---

## 3. Sections to build (in order)

Single page, sticky top nav that smooth-scrolls to each section and highlights the active one.

### Nav brand
`CA-RAG // 17002R` (use project_id from project-meta.json).

### S0 — Hero / Overview
- Eyebrow: "Final Year Project · BCS · Document Question Answering".
- Big title (from `project-meta.title`), with "Retrieval-Augmented Generation" emphasised.
- One-paragraph plain-language summary of what CA-RAG is (drop the retriever; generate per chunk; validate by similarity after generation). You may adapt from `project-meta.abstract` — **rewrite in your own words, keep it short**.
- Meta chips: supervisor, authors, generator model (Zephyr-7B-Beta), hardware (1× RTX 4090).
- 4 KPI stat cards: Best BERTScore F1 (0.8022); 12 configurations; 2 datasets (TriviaQA + SQuAD); ~26% mean abstention (compute mean of `trivia_reject_pct`).

### S1 — Performance Leaderboard
- Horizontal bar ranking of all 12 configs.
- **Dataset toggle**: TriviaQA / SQuAD (switches which `f1`/`prec`/`rec` is shown).
- **Metric toggle**: F1 / Precision / Recall.
- Each row: rank number, config name, three small tags (embedding / chunking / post-processing), the numeric score, and an animated bar. Colour bars by score tier (e.g. green ≥0.80, teal ≥0.78, gold ≥0.70, orange ≥0.60, coral below). Highlight the top row.
- Suggested bar scale: min 0.50, max ~0.84 so differences are visible.

### S2 — Comparative Analysis ("Where the score comes from")
Use `dimension-analysis.json`. Three small panels side by side, each a mini bar chart of **mean F1** with a dataset toggle (or show both datasets grouped):
1. By **Embedding model** (Contriever vs MiniLM)
2. By **Chunking strategy** (Semantic vs Fixed)
3. By **Post-processing** (No PP vs Dot vs Cosine)

Then a highlighted **interaction callout**: the `embedding_x_pp_TriviaQA` table — show that MiniLM Dot == MiniLM Cosine (0.5823) while Contriever Dot (0.7933) ≫ Contriever Cosine (0.7001). This is the single most important interaction in the project; give it visual weight (a small 2×3 heatmap-style grid works well).

Add a **Precision vs Recall scatter** (one point per config, colour = embedding, point size = F1) with a dataset toggle. Up-and-right is better. Tooltip on hover with config name + P/R/F1.

### S3 — Grounding & Abstention Behaviour (TriviaQA only)
Two ranked bar lists from `results.json`:
1. **Abstention rate** (`trivia_reject_pct`) — share of 500 questions answered "no context provided".
2. **Answer grounding** (`trivia_grounding_pct`) — share where the gold string literally appears in the answer (a strict factual-hit proxy).
- Add a one-line note explaining these are computed from the raw TriviaQA predictions, and that higher abstention ≠ safer (cite the 13.2% vs 35.8% contrast from `findings.behavioural_notes.abstention`).

### S4 — Key Findings
Render `findings.headline_conclusions` as three prominent statements at the top, then the five `findings[]` as cards. Each card: dimension label, title, summary, a short "why" (explanation), and the `tag` as a small badge. Keep the evidence numbers visible (e.g. the before/after F1).

### S5 — Prediction Explorer (qualitative)
Interactive browser over `predictions-sample.json`:
- A dropdown to pick the configuration (show its TriviaQA F1 next to the name).
- A filter segmented control: All / Answered / Abstained.
- A text search box that filters by the gold answer (`gt`).
- Render each sample as a card: question id, an "answered/abstained" flag, the **Gold** answer, and the **Model** output. Style abstained cards distinctly (e.g. coral left border).
- "Show more" pagination (start ~8, add 8 each click).
- A meta line: "this config abstains on X% of all 500 questions · grounding Y%".

### S6 — Demo Video
- A 16:9 responsive container.
- **Important:** the user will supply the YouTube link later. Expose a single constant at the top of the component, e.g. `const YOUTUBE_ID = "";`. If empty, show a tasteful placeholder (play icon + a note telling them where to paste the ID). If set, embed `https://www.youtube.com/embed/${YOUTUBE_ID}`.
- Add a clear code comment showing exactly where to paste it.

### S7 — Methodology
Render `methodology.json` as three phase cards (Indexing → Generation → Post-Processing) with arrows between them, each listing its steps. Include the post-processing rationale and the evaluation (BERTScore) description. Add a small "Future Work" strip from `findings.next_steps`.

### Footer
About blurb, configuration summary (2×2×3 = 12 runs, 500 TriviaQA questions each, BERTScore metric), a few `project-meta.key_references`, and an institution line (IIUM · KICT · Innovative Tech Expo Sem 2 25/26).

---

## 4. Design direction

Aim for a **refined "research instrument" aesthetic** — think a serious data console, not a generic startup landing page. Make it look genuinely designed.

- **Theme:** dark. Deep ink background (~`#0c0e13`), warm off-white text (`#ECE7DC`).
- **Accents:** a small, disciplined palette — warm gold (`#E8A33D`), teal/cyan (`#4FD1C5`), soft violet (`#9A8CFF`), green (`#7BD88F`) for "best", coral (`#F2766B`) for warnings/abstention. Dominant neutral + sharp accents; do **not** spread colour evenly.
- **Typography:** a distinctive serif display face (e.g. **Fraunces**) for headings, a clean grotesk (e.g. **Hanken Grotesk**) for body, and a mono (e.g. **JetBrains Mono**) for numbers, tags, and labels. Avoid Inter/Roboto/Arial. Load from Google Fonts.
- **Atmosphere:** subtle radial gradient glows behind the hero, hairline borders (`#262c3a`), rounded-16px panels, soft depth. No purple-on-white gradient clichés.
- **Motion:** one well-orchestrated load with staggered reveals; bars animate width on scroll-into-view; chart points fade/scale in. Keep it tasteful, not busy.
- **Numbers are the hero.** Big, confident numerals in the mono/serif face. Tabular alignment for metric columns.
- Fully **responsive** (mobile nav can collapse; charts must reflow). Respect `prefers-reduced-motion`.

Reference: the project poster uses a green/orange phase-coded methodology diagram and a horizontal BERTScore leaderboard — you can echo that leaderboard idea but elevate the execution. Ignore the poster's "prototype" screenshots; the demo video covers the product.

---

## 5. Acceptance checklist

- [ ] `npm install && npm run dev` runs with no errors.
- [ ] All 12 configs appear in the leaderboard; dataset + metric toggles work.
- [ ] Dimension breakdowns and the embedding×PP interaction render from `dimension-analysis.json`.
- [ ] P/R scatter has working hover tooltips and a dataset toggle.
- [ ] Abstention + grounding bars render from `results.json`.
- [ ] All five findings + three headline conclusions render from `findings.json`.
- [ ] Prediction Explorer: config dropdown, All/Answered/Abstained filter, gold-answer search, pagination all work.
- [ ] Demo video section has a single obvious `YOUTUBE_ID` constant + placeholder fallback.
- [ ] Methodology renders the three phases from `methodology.json`.
- [ ] Sticky nav highlights the active section on scroll.
- [ ] Looks polished on mobile and desktop; `npm run build` produces a deployable `dist/`.
- [ ] No fabricated numbers — every figure traces back to a file in `data/`.

Build it cleanly, commit-ready, and leave brief comments where the user is expected to edit (the YouTube ID, and the deploy base path if using GitHub Pages).
