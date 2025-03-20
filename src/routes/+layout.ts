// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)

import { loadTranslations } from "$lib/translations/translations";
import type { LayoutLoad } from "./$types";

// See: https://beta.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

export const load: LayoutLoad = () => {
  const defaultLocale = navigator.language.startsWith("de") ? "de" : "fr"; // get from cookie, user session, ...
  loadTranslations(defaultLocale); // keep this just before the `return`
  return {};
};
