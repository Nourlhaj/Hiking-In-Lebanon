# Lebanon Trails

Discover, plan and share hikes in Lebanon — **TripAdvisor + Strava, only for Lebanon hiking.**

Lebanon Trails brings together a trail database (distance, duration, difficulty, elevation, best season, GPS route, photos, nearby cafés), an interactive difficulty-coloured map, community condition reports and reviews, per-trail packing checklists, hidden-place categories, and a gamified hiker passport with badges.

## What's live

| Route | Screen |
|-------|--------|
| `/` | Landing page |
| `/trails` | Trail explorer — map + filters (difficulty, place type, season, search) |
| `/trails/:slug` | Trail detail — stats, season strip, GPS route & GPX download, checklist, nearby food, conditions, reviews |
| `/places` | Hidden places by category (waterfalls, forests, lakes, viewpoints, camping, ruins) |
| `/community` | Community feed of condition reports, reviews and photos |
| `/passport` | Hiker passport — stats, badges, leaderboard, completed trails |

All data currently comes from `src/data/fixtures.ts`.

## Tech

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing) on Vite 7
- Tailwind CSS 4 (theme tokens in `src/styles.css`)
- Leaflet with OpenTopoMap tiles for maps
- Netlify hosting, Netlify Image CDN for photos (`/.netlify/images`)
- Trail photography generated with Gemini via Netlify AI Gateway (stored in `public/img`)

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Roadmap

See [PLAN.md](./PLAN.md). Next up: the trail database on Netlify Database, user accounts with Netlify Identity, persisted reviews and condition reports, photo uploads, and the real badge engine.
