# flash-invaders

## Intro

This app is more or less a clone of the [flash-invaders](https://space-invaders.com/flashinvaders/) app and concept. It has been created for the 50th anniversary of the twinning between the french village La Tessoualle and German village Zwiefalten.
The goal is to find some mosaics hidden in La Tessoualle, and answer some quiz each time you scan a new mosaic with the NFC tag stuck on it.

The app is available on the [Play Store](https://play.google.com/store/apps/details?id=com.flashinvader.zwietess), and the [App Store](https://apps.apple.com/app/id6633194940), under the name "Zwietess".

A web version is available on [zwietess.aloiseau.com](https://zwietess.aloiseau.com)

This is the v2 version of a webapp I made for the same event, named flash-invaders (now archived).

## Features and packages used

- Application framework : Tauri (v2)
- Frontend framework : Svelte + TailwindCSS (v5) with SvelteKit
- Frontend components : shadcn-svelte
- NFC scan library : `tauri-plugin-nfc`
- Backend and auth : Supabase
- Internationalization in French and German, with `svelte-kit-i18n`

## Usage

- Clone the repo, and run `pnpm install`
- Duplicate the `.env.example` file, rename it to `.env`, and populate the variables with your own values
- Link your Supabase project and push migrations with `supabase db push`
- Run `pnpm dev` to start the app in development mode, or `pnpm tauri android|ios dev` if you want to run the app.

## Configuration

- For the sake of simplicity, I hardcoded the informations of mosaics and quizs directly in the app, under `src/lib/game-data`.
- Each NFC tag is encoded with a simple URI such as `zwietess://invader${ID}`, ID being the ID of the mosaic. The app only matches those URIs.

## Screenshots

<div style="display: flex; justify-content: space-between; align-items: center;">
    <img src="https://raw.githubusercontent.com/IT-ess/flash-invaders-v2/main/static/readme/readme1.png" alt="Homepage" style="height: 200px; width: auto;">
    <img src="https://raw.githubusercontent.com/IT-ess/flash-invaders-v2/main/static/readme/readme2.png" alt="Gallery" style="height: 200px; width: auto;">
    <img src="https://raw.githubusercontent.com/IT-ess/flash-invaders-v2/main/static/readme/readme3.png" alt="Invader details" style="height: 200px; width: auto;">
</div>
