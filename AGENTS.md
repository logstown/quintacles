# Quintacles - AGENTS.md

## Project Overview

**Quintacles** is a full-stack Next.js application where users create and browse curated "top 5" lists of movies, TV shows, and episodes. Lists are scoped by restrictions (genre, year, network, person, live-action only). Users can discover lists others have made for the same restrictions.

## Tech Stack

- **Framework**: Next.js 16 with App Router (React 19)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Clerk (`@clerk/nextjs`)
- **UI**: HeroUI component library + Tailwind CSS v4
- **Data fetching**: TanStack React Query v5 (client), `unstable_cache` (server)
- **Animations**: Framer Motion
- **External API**: TMDB (The Movie Database)
- **Deployments**: Vercel (analytics + speed insights included)

## Commands

```bash
npm run dev       # Dev server with Turbopack
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
npm run knip      # Check for unused exports/imports
```

Prisma runs automatically on `postinstall` (`prisma generate && prisma migrate deploy`).

## Project Structure

```
app/                  # Next.js App Router
  @modal/             # Parallel route slot for modals
  _components/        # Page-specific components
  api/
    tmdb/search/      # TMDB search proxy endpoint
    webhooks/clerk/   # Clerk webhook (user sync to DB)
  browse/             # Browse/discover lists
  create/             # List creation flow
  list/               # Individual list view
  user/               # User pages
  user-profile/       # Profile management
  actions.ts          # Server actions (mutations)
  layout.tsx          # Root layout (providers, auth)
  providers.tsx       # Client providers (Clerk, QueryClient, HeroUI, themes)

components/           # Shared reusable components
  build-list/         # List-building UI
  user-list/          # List display components
  navbar/             # Navigation

lib/
  db.ts               # Prisma client singleton
  models.ts           # TypeScript interfaces (RestrictionsUI, etc.)
  TmdbService.ts      # TMDB API wrapper
  TmdbModels.ts       # TMDB type definitions
  server-functions.ts # Cached server-side queries
  genres.tsx          # Genre constants with icons
  networks.ts         # TV network data
  random.ts           # Slug generation, media conversion utilities

prisma/
  schema.prisma       # DB schema
  migrations/         # Migration history

config/fonts.ts       # Font configuration
types/index.ts        # SVG/icon type utilities
```

## Database Schema

Key models:

- **User** — synced from Clerk via webhook; has `username`, `displayName`, `photoURL`, `coverImagePath`
- **UserList** — a list of exactly 5 `ListItem` references + a `Restrictions` slug; tracked via `UsersOnUserLists`
- **UsersOnUserLists** — join table; multiple users can "claim" the same list
- **Restrictions** — unique slug encoding filter criteria: `mediaType`, `genreId`, `year`, `personId`, `networkId`, `episodesTvShowId`, `isLiveActionOnly`
- **ListItem** — cached TMDB data (`mediaType` + `tmdbId` as composite PK)
- **Person**, **TvShowLite**, **Network** — reference data for restriction filters

Env vars needed:
- `POSTGRES_PRISMA_URL` (pooled connection)
- `POSTGRES_URL_NON_POOLING` (direct connection)
- Clerk keys
- TMDB API key

## Key Patterns & Conventions

### Server vs. Client Components
- Default to Server Components; add `'use client'` only where needed (interactivity, hooks)
- Mutations go in `app/actions.ts` as server actions
- Server queries use `unstable_cache` from `lib/server-functions.ts`
- Client-side data uses TanStack Query

### Imports
- Use `@/` path alias for all root-relative imports (configured in `tsconfig.json`)

### Styling
- Tailwind CSS v4 with HeroUI theme integration
- Custom keyframes: `pop-blob` animation, `gradient-radial`
- Dark mode via `next-themes`
- `tailwind-merge` + `clsx` for conditional class merging
- Prettier auto-sorts Tailwind classes (85-char line width, single quotes)

### Media Types
The `MediaType` enum covers: `Movie`, `TvShow`, `TvEpisode`, `TvSeason`, `Person`

### Restrictions / Slugs
Restrictions are encoded as a deterministic slug string. This slug is the primary key for the `Restrictions` table and ties lists together — users with identical restrictions and item sets share a `UserList`.

## No Testing Framework
There are no automated tests. Code quality is enforced via:
- TypeScript strict mode
- ESLint (Next.js core-web-vitals + TanStack Query plugin)
- Prettier
- Knip (dead code detection)

## Open TODOs (from TODO.txt)

**Before go-live:**
- Add `error.tsx` error boundaries
- Cover image adjustor UI
- Cascade delete restrictions when deleting a UserList
- Fix metadata title bug when navigating back to homepage

**Nice to haves:**
- Framer Motion animations
- Notifications when users create the same list

**Ideas:**
- Allow users to fork/edit any list
- Let users swap out posters and backdrops

**Note (2025-11-21):** Re-add `prefetch` to create button links
