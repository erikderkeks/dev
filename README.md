# Liquid Glass Developer Page (Monochrome, Apple-like, Tokyo Ghoul vibe)

A clean, black/white portfolio with **liquid glass UI**, subtle **anime scanlines**, and **soft motion**.
Built for **GitHub Pages** with Next.js static export.

## Run locally
```bash
npm install
npm run dev
```

## Build (GitHub Pages)
```bash
npm run build
```

The static site is generated into `./out`.

### Hosting notes
- If you use a **profile repo** (`USERNAME.github.io`) you’re done.
- If you host under a **project path** (`USERNAME.github.io/REPO`), set `basePath` in `next.config.js`.

## Customize
- Your name + intro: `components/hero.tsx`
- Social links: `components/top-nav.tsx`
- GitHub username: `app/page.tsx` (`const username = "erikderkeks"`)
