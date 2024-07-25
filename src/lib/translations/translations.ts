import i18n from 'sveltekit-i18n';
import type { Config } from 'sveltekit-i18n';

const config: Config = {
	loaders: [
		{
			locale: 'fr',
			key: 'common',
			loader: async () => (await import('./fr/common.json')).default
		},
		{
			locale: 'fr',
			key: 'home',
			// routes: ['/search'],
			loader: async () => (await import('./fr/home.json')).default
		},
		{
			locale: 'fr',
			key: 'auth',
			// routes: ['/auth/register'],
			loader: async () => (await import('./fr/auth.json')).default
		},
		{
			locale: 'fr',
			key: 'context',
			// routes: [/\/invader\/\d+/],
			loader: async () => (await import('./fr/context.json')).default
		},
		{
			locale: 'fr',
			key: 'quiz',
			// routes: [/^\/invader\/([0-9]|1[01])\/quiz$/],
			loader: async () => (await import('./fr/quiz.json')).default
		},
		{
			locale: 'fr',
			key: 'tutorial',
			// routes: ['/tutorial'],
			loader: async () => (await import('./fr/tutorial.json')).default
		},
		{
			locale: 'fr',
			key: 'ranking',
			// routes: ['/tutorial'],
			loader: async () => (await import('./fr/ranking.json')).default
		},
		{
			locale: 'de',
			key: 'common',
			loader: async () => (await import('./de/common.json')).default
		},
		{
			locale: 'de',
			key: 'home',
			// routes: ['/search'],
			loader: async () => (await import('./de/home.json')).default
		},
		{
			locale: 'de',
			key: 'auth',
			// routes: ['/auth/register'],
			loader: async () => (await import('./de/auth.json')).default
		},
		{
			locale: 'de',
			key: 'context',
			// routes: [/\/invader\/\d+/],
			loader: async () => (await import('./de/context.json')).default
		},
		{
			locale: 'de',
			key: 'quiz',
			// routes: [/^\/invader\/([0-9]|1[01])\/quiz$/],
			loader: async () => (await import('./de/quiz.json')).default
		},
		{
			locale: 'de',
			key: 'tutorial',
			// routes: ['/tutorial'],
			loader: async () => (await import('./de/tutorial.json')).default
		},
		{
			locale: 'de',
			key: 'ranking',
			// routes: ['/tutorial'],
			loader: async () => (await import('./de/ranking.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
