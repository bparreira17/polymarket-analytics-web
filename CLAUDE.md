# CLAUDE.md — PolyAnalytics Web

## Project Overview

PolyAnalytics is a "Bloomberg Terminal for Prediction Markets" — a Next.js web app providing real-time analytics, whale tracking, leaderboards, portfolio management, and cross-platform arbitrage scanning for Polymarket and Kalshi.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with React 18
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3 + HeroUI (component library) + dark/light theme via `next-themes`
- **State/Data:** TanStack React Query (30s stale time, 30s refetch)
- **Auth:** Clerk (`@clerk/nextjs`) — middleware protects `/whales`, `/arbitrage`, `/account`
- **Charts:** `lightweight-charts` (TradingView)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Monitoring:** Sentry (`@sentry/nextjs`)
- **Testing:** Vitest + jsdom + React Testing Library + `@testing-library/jest-dom`
- **Linting:** ESLint with `next/core-web-vitals` + `next/typescript`

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (run once)
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout (Clerk + Providers + TerminalShell)
│   ├── providers.tsx     # Client providers (React Query, HeroUI, next-themes)
│   ├── page.tsx          # Homepage / Dashboard
│   ├── markets/          # Market listing + [id] detail pages
│   ├── leaderboard/      # Trader leaderboard
│   ├── whales/           # Whale trade feed (protected)
│   ├── arbitrage/        # Arbitrage scanner (protected)
│   ├── portfolio/        # User portfolio
│   ├── watchlist/        # User watchlist
│   ├── traders/[address] # Individual trader profile
│   ├── pricing/          # Subscription tiers
│   ├── account/          # Account settings (protected)
│   ├── sign-in/          # Clerk sign-in
│   └── sign-up/          # Clerk sign-up
├── components/
│   ├── layout/           # Shell components (navbar, sidebar, footer, terminal-shell, ticker-tape, command-palette, etc.)
│   ├── dashboard/        # Dashboard widgets (stat-card, top-movers, whale-feed, sparkline, etc.)
│   ├── markets/          # Market-specific components (market-card, order-book, filters, trades-feed, watchlist-button)
│   ├── charts/           # Price chart (lightweight-charts wrapper)
│   └── plan-gate.tsx     # Subscription gating component
├── hooks/                # Custom React hooks (use-markets, use-watchlist, use-websocket, use-notifications, use-portfolio, use-traders, use-user)
├── lib/
│   ├── api.ts            # API client — all backend calls via `api.*` namespace
│   ├── api-client.ts     # Lower-level fetch helper
│   └── utils.ts          # Shared utilities
├── types/
│   └── index.ts          # Shared TypeScript types (Market, Trade, LeaderboardEntry, etc.)
├── middleware.ts          # Clerk auth middleware (route protection)
└── test/
    └── setup.ts          # Vitest setup (jest-dom matchers)
```

## Architecture Notes

- **API layer:** All backend calls go through `src/lib/api.ts` which exports a namespaced `api` object (e.g., `api.markets.list()`, `api.whaleTrades()`, `api.watchlists.add()`). The backend URL comes from `NEXT_PUBLIC_API_URL`.
- **Auth tokens:** Protected API calls accept a `token` parameter (Clerk JWT), passed via the `Authorization: Bearer` header.
- **Path alias:** `@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
- **Tests live alongside code:** Test files use `__tests__/` directories co-located with the code they test (e.g., `components/layout/__tests__/navbar.test.tsx`).
- **Subscription tiers:** Free, Pro, Enterprise — gated via `<PlanGate>` component and backend billing API (Stripe).

## Coding Conventions

- Use TypeScript strict mode — avoid `any` when possible.
- Import types with `import type { ... }` syntax.
- Components are functional with named exports.
- Path imports use the `@/` alias (e.g., `import { api } from "@/lib/api"`).
- Prefer HeroUI components for UI elements.
- Tests use Vitest globals (`describe`, `it`, `expect` — no imports needed).

## Environment Variables

See `.env.example` for required variables:
- `NEXT_PUBLIC_API_URL` — Backend API base URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — Clerk auth
- `NEXT_PUBLIC_STRIPE_*_PRICE_ID` — Stripe subscription prices
- `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_AUTH_TOKEN` — Sentry (optional)

**Never commit `.env` files or secrets.**
