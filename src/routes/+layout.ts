// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://beta.tauri.app/start/frontend/sveltekit/ for more info
import { loadTranslations } from '$lib/translations/translations.ts';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = false;

export const load: LayoutLoad = async () => {
	const initLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...

	await loadTranslations(initLocale); // keep this just before the `return`

	return {};
};
