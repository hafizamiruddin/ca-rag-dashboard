# data/ — Data Dictionary

All numbers the website displays come from these files. They are static and final for this
preliminary phase. Do not edit the values when building the site.

---

## results.json
```
{
  "meta": { project_id, title, generator_model, embedding_models[], chunking[],
            post_processing[], threshold_tau, datasets[], metric, hardware,
            samples_per_config, note_predictions },
  "configurations": [
    {
      "config": "Contriever + Fixed + No PP",   // display name
      "embedding": "CONTRIEVER" | "MINILM",
      "embeddingLabel": "Contriever" | "MiniLM",
      "chunking": "Fixed" | "Semantic",
      "pp": "None" | "dot" | "cosine",
      "ppLabel": "No PP" | "Dot Product" | "Cosine",
      "triviaqa": { "prec": 0.7893, "rec": 0.8173, "f1": 0.8022 },
      "squad":    { "prec": 0.8088, "rec": 0.8731, "f1": 0.8394 },
      "trivia_reject_pct": 24.4,      // % of 500 Qs answered "no context provided"
      "trivia_grounding_pct": 55.2,   // % where gold string literally appears in the answer
      "trivia_avg_answer_len": 38.0,  // mean answer length in words
      "n_questions": 500
    }
    // ... 12 total, sorted by triviaqa.f1 descending
  ]
}
```
Notes:
- `trivia_*` extras are computed only for TriviaQA (predictions exist for it).
- `squad` is aggregate BERTScore from the progress report tables; no per-question SQuAD data.

## dimension-analysis.json
Pre-computed mean BERTScore F1:
```
{
  "by_embedding":        { "TriviaQA": {Contriever, MiniLM}, "SQuAD": {...} },
  "by_chunking":         { "TriviaQA": {Fixed, Semantic},    "SQuAD": {...} },
  "by_postprocessing":   { "TriviaQA": {"No PP","Dot Product","Cosine"}, "SQuAD": {...} },
  "embedding_x_pp_TriviaQA": {
     "Contriever": {"No PP","Dot Product","Cosine"},
     "MiniLM":     {"No PP","Dot Product","Cosine"}   // Dot == Cosine here
  }
}
```

## findings.json
```
{
  "headline_conclusions": [ 3 strings ],
  "findings": [ { id, title, dimension, summary, explanation, evidence, tag } x5 ],
  "behavioural_notes": { caveat, abstention },
  "limitations": [ ... ],
  "next_steps": [ ... ]
}
```

## predictions-sample.json
```
{
  "dataset": "TriviaQA",
  "samples_per_config": 60,
  "samples": {
    "Contriever + Fixed + Cosine": [
      { "i": 0, "pred": "<model answer>", "gt": "<gold answer>", "rej": false }
      // ... up to 60 per config
    ],
    // ... one key per configuration (same names as results.json `config`)
  }
}
```
`rej: true` means the model abstained ("no context provided").

## project-meta.json
Title, project_id, programme, institution, semester, supervisor, authors[],
abstract, objectives[], problem_statement, community_impacts[], sdg[], tools[],
key_references[]. Use for the hero, about, and footer.

## methodology.json
`overview`, `phases[]` (Indexing / Generation / Post-Processing, each with `steps[]`),
chunking_methods, post-processing `rationale`, and `evaluation`. Use for the Methodology section.
