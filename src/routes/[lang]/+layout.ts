import { sessionState } from '$lib/session-state.svelte';
import { loadTranslations } from '$lib/translations/translations';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabase-client';
import { invaderCounter } from '$lib/utils/invader-counter';
import { downloadAvatar } from '$lib/utils/avatar-functions';

export const load: LayoutLoad = async ({ url, params }) => {
	const { pathname } = url;
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...
	const initLocale = params.lang || defaultLocale; // set default if no locale already set, I use directly path params rather than the global 'locale' store. I must provide some validation here.

	if (!sessionState.getSession) {
		error(401, { message: 'Unauthorized' });
	}

	let userId = sessionState.getUserId;
	let avatarUrl: string | null = null;
	let username: string | null = null;
	let score: number = 0;

	if (userId !== null) {
		try {
			const { data, error } = await supabase.from('profiles').select().eq('id', userId).single();

			if (error) {
				throw error;
			}
			if (!data.avatar_url) {
				throw new Error('No avatar found');
			}
			avatarUrl = data.avatar_url;
			username = data.username;
			score = data.score;
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}

		await loadTranslations(initLocale, pathname); // keep this just before the `return`
		return {
			sessionState,
			session: sessionState.getSession,
			userId,
			fetchedImage: (await downloadAvatar(avatarUrl)) ?? null,
			username,
			score,
			invaderCount: await invaderCounter(userId ?? '')
		};
	} else {
		error(401, { message: 'Unauthorized' });
	}
};
