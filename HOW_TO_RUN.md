# HOW TO RUN — CA-RAG Dashboard

## Development

```bash
cd ca-rag-dashboard   # this directory (where package.json lives)
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Production build

```bash
npm run build         # outputs to dist/
npm run preview       # preview the dist/ locally
```

The `dist/` folder is a self-contained static site, deployable to:
- **GitHub Pages** — set `base: '/your-repo-name/'` in `vite.config.js` first
- **Netlify / Vercel** — push the repo; set build command `npm run build` and publish dir `dist`

## Adding the demo video

1. Upload your demo to YouTube and copy the video ID (the part after `?v=` or after `youtu.be/`).
2. Open `src/components/DemoVideo.jsx`.
3. Replace the empty string on **line 5**:
   ```js
   const YOUTUBE_ID = 'your-video-id-here'
   ```
4. Save — the iframe appears instantly (no rebuild needed in dev mode).

## Data

All data lives in `data/*.json` and is imported at build time. To update numbers,
edit the JSON files and re-run `npm run build`.
