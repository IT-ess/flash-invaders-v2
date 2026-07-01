import { sessionState } from '$lib/session-state.svelte';
import { loadTranslations } from '$lib/translations/translations';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { supabase, type ProfileRow } from '$lib/supabase-client';
import { invaderCounter } from '$lib/utils/invader-counter';
import { downloadAvatar } from '$lib/utils/avatar-functions';
import { INVADERS, BONUS_INVADER_ID } from '$lib/game-data/invaders';

export const load: LayoutLoad = async ({ url, params }) => {
	const { pathname } = url;
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...
	const initLocale = params.lang || defaultLocale; // set default if no locale already set, I use directly path params rather than the global 'locale' store. I must provide some validation here.

	await sessionState.init();
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
	for (const invader of INVADERS) {
		const invaderState = userData[`inv${invader.id}` as keyof ProfileRow] as number;
		const found = invaderState > 0;
		// The bonus invader (id 0) is only revealed once caught: no placeholder.
		if (invader.id === BONUS_INVADER_ID && !found) {
			continue;
		}
		if (found) {
			const { id, imageUrl, name, latitude, longitude } = invader;
			invadersInfos.push({
				id,
				alt: name,
				img: imageUrl,
				lat: latitude,
				long: longitude
			});
		} else {
			// Keep the invader hidden (id 100) but carry its hint picture so the
			// gallery can offer a "tap for a hint" preview.
			invadersInfos.push({
				id: 100,
				alt: 'placeholder',
				img: '/question_mark.png',
				lat: 0,
				long: 0,
				hintImg: invader.hintImageUrl
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
	hintImg?: string;
};
