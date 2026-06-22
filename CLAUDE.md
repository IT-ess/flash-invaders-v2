# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Zwietess is a "flash-invaders" clone built for the 50th anniversary of the twinning between La Tessoualle (France) and Zwiefalten (Germany). Players find hidden mosaics in La Tessoualle, scan an NFC tag on each one, and answer a quiz. It ships as a mobile app (iOS/Android via Tauri) and a web build.

## Commands

Package manager is **pnpm** (`pnpm-workspace.yaml` present). Tauri uses **cargo** for the Rust side.

- `pnpm dev` — run the SvelteKit frontend in the browser (web dev)
- `pnpm build` — build the static frontend into `build/`
- `pnpm check` — typecheck (`svelte-kit sync && svelte-check`); run this to validate changes (there is no test suite)
- `pnpm format` — Prettier write (tabs, single quotes, no trailing comma, width 100)
- `pnpm tauri android dev` / `pnpm tauri ios dev` — run the native app on device/emulator
- `supabase db push` — apply migrations in `supabase/migrations/` to the linked Supabase project

There are no automated tests and no separate lint step beyond `pnpm check` and Prettier.

## Environment

Copy `.env.example` to `.env` and fill in values. All vars are `PUBLIC_` (exposed to the client via `$env/static/public`):

- `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `PUBLIC_SEARCH_RADIUS` — meters; geofence radius used to match a user's GPS position to nearby mosaics
- `PUBLIC_PLATFORM` — `mobile` or `web`; gates platform-specific behavior (e.g. NFC is mobile-only)
- `PUBLIC_IS_TUTORIAL_DISABLED`

## Architecture

**Stack:** Tauri v2 (Rust shell) + SvelteKit/Svelte 5 (runes) + TailwindCSS v4 + shadcn-svelte + Supabase.

**Rendering model — this is the key constraint.** Tauri has no Node server, so the app is a fully static, client-only SPA: `adapter-static`, `ssr = false`, `prerender = true` (set in `src/routes/+layout.ts`). All data loading happens in the browser. Because `svelte.config.js` crawl-based prerendering "doesn't work" (see comment), routes are effectively enumerated manually — be careful adding dynamic routes.

**Game data is hardcoded**, not in the database. Mosaic definitions (id, name, coordinates, image) live in `src/lib/game-data/invaders.ts` and quizzes in `src/lib/game-data/quiz.ts`. Supabase stores only user state (profiles, scores, permissions).

**NFC scan flow:**
1. Each physical tag encodes the URI `zwietess://invader${ID}`.
2. `src/lib/nfc-utils.ts` scans (`@tauri-apps/plugin-nfc`, scheme filter `zwietess`) and manually decodes the NDEF text record payload.
3. `src/lib/invader-utils.ts` (`getInvaderFromTagContent`) matches the URI to a hardcoded invader, and/or `getInvadersFromCoords` matches by GPS proximity using `geolocation-utils` `insideCircle`.
4. `updateUserPrivileges` calls the Supabase RPC `update_user_permissions_and_score` to grant access and update score.

**Auth/session:** `src/lib/supabase-client.ts` exposes the typed `supabase` client (`database.types.ts` is generated from the Supabase schema). `src/lib/session-state.svelte.ts` is a singleton `SessionState` class (Svelte 5 `$state` runes) that wraps the auth session — imported directly as `sessionState`.

**i18n:** `sveltekit-i18n` configured in `src/lib/translations/translations.ts` with `fr` and `de` locale dirs. Locale is part of the URL: routes live under `(nonroot)/[lang=locale]/...`, validated by the `locale` param matcher (`src/params/locale.ts`, only `fr`/`de`). The root layout picks a default from `navigator.language`.

**Routing:** route groups separate concerns — `(nonroot)/[lang=locale]/` holds the localized in-game pages (home, gallery, invader/[id], invader/[id]/quiz, ranking, avatar, tutorial), while `auth/` and `privacy/` sit outside the locale segment. The `integer` param matcher (`src/params/integer.ts`) constrains invader IDs.

**Forms/validation:** `sveltekit-superforms` + `zod` v4 (note: zod 4 import quirks were fixed recently — see commit `023467f`).

**UI components:** shadcn-svelte components live in `src/lib/components/ui/` (configured via `components.json`, style "luma", base color neutral, lucide icons). Use the `$lib/components/ui` aliases. Icons also via `unplugin-icons` (`@iconify/json`).

## Tauri / native notes

- Rust deps (`src-tauri/Cargo.toml`): `tauri-plugin-nfc` is only compiled for `android`/`ios` targets. iOS requires the `CoreNFC` framework (set in `tauri.conf.json`), Android `minSdkVersion` 28.
- `frontendDist` is `../build`; Tauri runs `pnpm build` before bundling and `pnpm dev` (port 1420) for dev.
- App identifier: `com.flashinvader.zwietess`.
