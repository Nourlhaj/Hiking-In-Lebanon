# Lebanon Trails — Product Roadmap

**Positioning:** TripAdvisor + Strava, only for hiking in Lebanon. Discover trails, plan a hike, share conditions, and track progress with badges.

Each milestone is a self-contained slice that can ship on its own.

## ✅ Milestone 1 — Product surface (done)
Branded, clickable product with realistic stub data in `src/data/fixtures.ts`.
- Landing page (`/`) with positioning, map teaser, featured trails, hidden-place categories, live community reports and badges.
- Trail explorer (`/trails`) — Leaflet topo map with green/orange/red pins, search, difficulty/category/season filters, sort, list/map toggle on mobile.
- Trail detail (`/trails/:slug`) — all trail facts, season strip, GPS route on map, GPX download, interactive packing checklist, nearby cafés/restaurants, condition reports (local-only form), reviews, similar trails.
- Hidden places (`/places`), Community feed (`/community`), Hiker passport (`/passport`) with badges and leaderboard.

## Milestone 2 — Trail database
- Netlify Database (Postgres + Drizzle) schema: `trails`, `trail_photos`, `trail_routes` (GeoJSON/polyline), `nearby_spots`, `categories`.
- Seed script that migrates the fixture trails into the database.
- Replace fixture imports with TanStack Start server functions/loaders (`getTrails`, `getTrail`), keeping the fixture shapes.
- Real GPS tracks: store GPX-derived polylines per trail instead of the generated placeholder routes.

## Milestone 3 — Accounts
- Netlify Identity sign-up/login (email + Google), protected actions, profile page backed by a `profiles` table.
- "Save" and "I hiked this" persist per user; passport reads real stats.

## Milestone 4 — Community: reviews & condition reports
- `reviews` and `condition_reports` tables; posting from the trail page (form already built), "helpful" votes, report expiry after ~7 days.
- Trail rating/review count computed from real reviews.
- Moderation: report/flag content, admin role to hide posts.

## Milestone 5 — Photos
- Photo uploads to Netlify Blobs, served through the Netlify Image CDN.
- Photo galleries on trails and in the community feed.

## Milestone 6 — Gamification
- `completions` table (trail, user, date, optional GPX upload) and badge rules engine (regions, cedar reserves, waterfalls per season, summits, total km).
- Badge unlock notifications, seasonal leaderboard by region and among friends.

## Milestone 7 — Hidden places & contributions
- Points of interest independent of trails (single waterfalls, viewpoints, camping spots) on the map.
- Users submit new trails/places for review before publishing.

## Milestone 8 — Polish & growth
- Production map tiles provider (current OpenTopoMap tiles are fine for prototyping only), offline-friendly trail pages (PWA).
- Arabic and French localisation (RTL support).
- Weather forecast per trailhead, sunrise/sunset times, SEO pages per region.
