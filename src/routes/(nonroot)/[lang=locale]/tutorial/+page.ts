import { loadTranslations } from '$lib/translations/translations';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => {
	return [{ lang: 'fr' }, { lang: 'de' }];
};

export const load: PageLoad = async ({ url, params }) => {
	const { pathname } = url;
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...
	const initLocale = params.lang || defaultLocale; // set default if no locale already set, I use directly path params rather than the global 'locale' store. I must provide some validation here.

	await loadTranslations(initLocale, pathname); // keep this just before the `return`
};
