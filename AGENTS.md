# AGENTS.md

Guide for AI agents and developers working on **Lebanon Trails** — a hiking platform for Lebanon ("TripAdvisor + Strava, only for Lebanon hiking").

**Start here:** read `PLAN.md`. Milestone 1 (product surface with stub data) is complete; continue with the next unchecked milestone.

## Stack

TanStack Start (React 19, TanStack Router file routes) · Vite 7 · Tailwind CSS 4 · Leaflet · TypeScript strict · Netlify.

## Directory structure

```
public/img/              Generated trail photos (large PNGs — always serve via img() helper)
src/
  data/fixtures.ts       ALL stub data: trails, categories, condition reports, reviews, badges, hiker, leaderboard
  lib/img.ts             img(src, width) → Netlify Image CDN URL; formatDuration()
  components/
    SiteHeader.tsx       Sticky nav
    SiteFooter.tsx
    TrailMap.tsx         Client-only Leaflet map (pins coloured by difficulty, optional GPS route)
    TrailCard.tsx        Trail card + DifficultyPill + TrailStats
    BadgeMedal.tsx       Progress-ring badge medal
    Logo.tsx
  routes/
    __root.tsx           HTML shell, meta, fonts, header/footer
    index.tsx            Landing page
    trails/index.tsx     Explorer (search params: q, difficulty, category, month)
    trails/$slug.tsx     Trail detail
    places.tsx           Hidden places by category
    community.tsx        Community feed
    passport.tsx         Hiker profile, badges, leaderboard
```

## Conventions & decisions

- **Stub data lives only in `src/data/fixtures.ts`.** When adding persistence (Netlify Database + Drizzle, see PLAN.md), keep the exported types (`Trail`, `Review`, `ConditionReport`, `Badge`) and swap the arrays for loader/server-function calls so screens don't change.
- GPS routes are **generated placeholders** (`buildRoute()` in fixtures) from each trail's start coordinate. Replace with real GPX data in the trail database milestone.
- `TrailMap` dynamically imports Leaflet inside `useEffect` because Leaflet touches `window` (SSR-safe). It uses a ResizeObserver so it works when toggled from hidden. Pins are `divIcon`s styled by `.trail-pin` in `styles.css`.
- Difficulty colours: easy `#3f8a4e`, moderate `#d9861c`, hard `#c0392b` — available as Tailwind tokens `easy` / `moderate` / `hard`. Other tokens: `cedar`, `limestone`, `sand`, `clay`, `moss`, `ink`.
- Typography: Fraunces (display, `font-display`) + Schibsted Grotesk (body), loaded from Google Fonts in `__root.tsx`.
- Images: never reference `/img/*.png` directly in `<img>`; use `img(src, width)` so the Image CDN resizes to WebP.
- Interactive features without persistence (checklist ticks, "I hiked this", "Save", condition-report form) use local React state for now.
- Imports use the `@/` alias for `src/`.

## Commands

```bash
pnpm dev          # Vite dev server on :3000
netlify dev       # with Netlify emulation
```
