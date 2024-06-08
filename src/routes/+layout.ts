// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://beta.tauri.app/start/frontend/sveltekit/ for more info
import { loadTranslations } from "$lib/translations/translations.ts";

export const prerender = true;
export const ssr = false;

export const load = async ({ url }) => {
  const { pathname } = url;

  const initLocale = "fr"; // get from cookie, user session, ...

  await loadTranslations(initLocale, pathname); // keep this just before the `return`

  return {};
};
