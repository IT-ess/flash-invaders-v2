import { sessionState } from '$lib/session-state.svelte';
import { supabase } from '$lib/supabase-client';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { countFoundInvaders } from '$lib/game-data/invaders';
import type { InvaderPrivileges } from '$lib/utils/invader-counter';
import { downloadAvatar } from '$lib/utils/avatar-functions';
import { browser } from '$app/environment';

// Every `inv*` column, so the found count can be computed here instead of one
// `count_found_invaders` RPC per leaderboard row.
const PROFILE_COLUMNS =
	'inv0, inv1, inv2, inv3, inv4, inv5, inv6, inv7, inv8, inv9, inv10, inv11';

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
			.select(`score, username, avatar_url, id, ${PROFILE_COLUMNS}`)
			.order('score', { ascending: false })
			.range(0, 9);
		profiles = data;
		cache.set(`ranking`, data);
	}

	if (!profiles) {
		error(500, { message: 'Internal Server Error' });
	}

	const profilePromises = profiles.map(async (profile) => {
		const { id, username, score, avatar_url } = profile;
		return {
			username,
			score,
			avatar: await downloadAvatar(avatar_url),
			// Leaderboard counts base invaders only; the bonus surfaces via score.
			invaderCount: countFoundInvaders(profile, false),
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
		.select(`score, username, avatar_url, ${PROFILE_COLUMNS}`)
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
		invaderCount: countFoundInvaders(me, false)
	};
}

type SupabaseProfiles = {
	id: string;
	username: string | null;
	score: number;
	avatar_url: string | null;
} & Pick<InvaderPrivileges, `inv${number}` & keyof InvaderPrivileges>;
