# Math Adventure 🌟

A kid-friendly primary mathematics learning page for Levels 1–5 (Grades 1–5), designed around the core strands of Vietnam's 2018 General Education Program.

## Features

- Level 1–5 learning paths
- Responsive kid-friendly React UI
- Randomized practice questions by grade level
- Instant right/wrong feedback and hints
- Stars, streaks, solved-question stats
- Progress saved locally in the browser
- GitHub Actions deployment to GitHub Pages

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy-pages.yml` builds the Vite app and deploys `dist/` to GitHub Pages.

Expected URL: `https://forlanguage.github.io/simple-math-for-kid/`
