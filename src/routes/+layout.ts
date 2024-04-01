import { loadTranslations } from '$lib/translations/translations.ts';

export const prerender = true;
export const ssr = false;

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url }) => {
	const { pathname } = url;

	const initLocale = 'fr'; // get from cookie, user session, ...

	await loadTranslations(initLocale, pathname); // keep this just before the `return`

	return {};
};
