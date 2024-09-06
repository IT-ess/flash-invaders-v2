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
	if (sessionState.getUserId) {
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
			return { username, score, avatar: await downloadAvatar(avatar_url), invaderCount };
		});

		return { profiles: profilePromises };
	} else {
		error(401, { message: 'Unauthorized' });
	}
};

type SupabaseProfiles = {
	id: string;
	username: string | null;
	score: number;
	avatar_url: string | null;
};
