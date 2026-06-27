import { sessionState } from '$lib/session-state.svelte';
import { supabase } from '$lib/supabase-client';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { invaderCounter } from '$lib/utils/invader-counter';
import { downloadAvatar } from '$lib/utils/avatar-functions';
import { browser } from '$app/environment';

export const entries: EntryGenerator = () => {
	return [{ lang: 'fr' }, { lang: 'de' }];
};

const cache = new Map();

export const load: PageLoad = async () => {
	await sessionState.init();
	const userId = sessionState.getUserId;
	if (!userId) {
		error(401, { message: 'Unauthorized' });
	}

	let profiles: SupabaseProfiles[] | null;
	if (browser && cache.has(`ranking`)) {
		profiles = cache.get(`ranking`);
	} else {
		const { data } = await supabase
			.from('profiles')
			.select('score, username, avatar_url, id')
			.order('score', { ascending: false })
			.range(0, 9);
		profiles = data;
		cache.set(`ranking`, data);
	}

	if (!profiles) {
		error(500, { message: 'Internal Server Error' });
	}

	const profilePromises = profiles.map(async ({ id, username, score, avatar_url }) => {
		const invaderCount = await invaderCounter(id, false);
		return {
			username,
			score,
			avatar: await downloadAvatar(avatar_url),
			invaderCount,
			isCurrentUser: id === userId
		};
	});

	// When the current user is outside the top 10, resolve their own row so the UI
	// can still show them their rank.
	const isInTopTen = profiles.some(({ id }) => id === userId);
	const currentUser = isInTopTen ? null : resolveCurrentUserRanking(userId);

	return { profiles: profilePromises, currentUser };
};

async function resolveCurrentUserRanking(userId: string) {
	const { data: me } = await supabase
		.from('profiles')
		.select('score, username, avatar_url')
		.eq('id', userId)
		.single();

	if (!me) {
		return null;
	}

	// Standard competition ranking: how many players score strictly higher, + 1.
	const { count } = await supabase
		.from('profiles')
		.select('id', { count: 'exact', head: true })
		.gt('score', me.score);

	return {
		rank: (count ?? 0) + 1,
		username: me.username,
		score: me.score,
		avatar: await downloadAvatar(me.avatar_url),
		invaderCount: await invaderCounter(userId, false)
	};
}

type SupabaseProfiles = {
	id: string;
	username: string | null;
	score: number;
	avatar_url: string | null;
};
