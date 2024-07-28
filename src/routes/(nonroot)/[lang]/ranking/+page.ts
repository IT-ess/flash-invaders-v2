import { sessionState } from '$lib/session-state.svelte';
import { supabase } from '$lib/supabase-client';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { invaderCounter } from '$lib/utils/invader-counter';
import { downloadAvatar } from '$lib/utils/avatar-functions';

export const entries: EntryGenerator = () => {
	return [{ lang: 'fr' }, { lang: 'de' }];
};

export const load: PageLoad = async () => {
	if (sessionState.getUserId) {
		const { data } = await supabase
			.from('profiles')
			.select('score, username, avatar_url, id')
			.order('score', { ascending: false })
			.range(0, 9);

		if (!data) {
			error(500, { message: 'Internal Server Error' });
		}

		const profilePromises = data.map(async ({ id, username, score, avatar_url }) => {
			const invaderCount = await invaderCounter(id);
			return { username, score, avatar: (await downloadAvatar(avatar_url)) ?? null, invaderCount };
		});

		const profiles: Profile[] = await Promise.all(profilePromises);

		return { profiles };
	} else {
		error(401, { message: 'Unauthorized' });
	}
};

type Profile = {
	username: string | null;
	score: number;
	avatar: string | null;
	invaderCount: number;
};
