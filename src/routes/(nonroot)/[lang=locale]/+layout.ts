import { sessionState } from '$lib/session-state.svelte';
import { loadTranslations } from '$lib/translations/translations';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { supabase, type ProfileRow } from '$lib/supabase-client';
import { invaderCounter } from '$lib/utils/invader-counter';
import { downloadAvatar } from '$lib/utils/avatar-functions';
import { INVADERS, INVADERS_STARTING_INDEX } from '$lib/game-data/invaders';

export const load: LayoutLoad = async ({ url, params }) => {
	const { pathname } = url;
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...
	const initLocale = params.lang || defaultLocale; // set default if no locale already set, I use directly path params rather than the global 'locale' store. I must provide some validation here.

	const session = sessionState.getSession;
	const userId = sessionState.getUserId;

	if (!session || !userId) {
		error(401, { message: 'Unauthorized' });
	}

	const { data, error: err } = await supabase.from('profiles').select().eq('id', userId).single();

	if (err) {
		error(500, { message: err.message });
	}

	const { avatar_url: avatarUrl, username, score, ...invadersPrivileges } = data;

	if (avatarUrl === null) {
		console.log('No avatar found');
	}

	await loadTranslations(initLocale, pathname); // keep this just before the `return`
	return {
		session: sessionState.getSession,
		userId,
		fetchedImage: downloadAvatar(avatarUrl),
		username,
		score,
		invaderCount: invaderCounter(userId, true),
		invadersInfos: getInvaderFromState(data),
		privileges: invadersPrivileges
	};
};

function getInvaderFromState(userData: ProfileRow): InvadersInfos[] {
	const invadersInfos: InvadersInfos[] = [];
	for (let i = INVADERS_STARTING_INDEX; i < 12; i++) {
		const invaderState = userData[`inv${i}` as keyof ProfileRow] as number;
		if (invaderState > 0) {
			const { id, imageUrl, name, latitude, longitude } = INVADERS[i - INVADERS_STARTING_INDEX];
			invadersInfos.push({
				id,
				alt: name,
				img: imageUrl,
				lat: latitude,
				long: longitude
			});
		} else {
			invadersInfos.push({
				id: 100,
				alt: 'placeholder',
				img: '/question_mark.png',
				lat: 0,
				long: 0
			});
		}
	}
	return invadersInfos;
}

export type InvadersInfos = {
	id: number;
	alt: string;
	img: string;
	lat: number;
	long: number;
};
