import { sessionState } from '$lib/session-state.svelte';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase-client';
import { downloadAvatar } from '$lib/utils/avatar-functions';

export const load: PageLoad = async ({ url }) => {
	if (!sessionState.getSession) {
		error(401, { message: 'Unauthorized' });
	}

	let userId = sessionState.getUserId;
	let avatarUrl: string | null = null;
	let username: string | null = null;
	let score: number = 0;

	if (userId !== null) {
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('avatar_url, username')
				.eq('id', userId)
				.single();

			if (error) {
				throw error;
			}
			if (!data.avatar_url) {
				throw new Error('No avatar found');
			}
			avatarUrl = data.avatar_url;
			username = data.username;
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}

		return {
			session: sessionState.getSession,
			userId,
			fetchedImage: (await downloadAvatar(avatarUrl)) ?? null,
			username
		};
	} else {
		error(401, { message: 'Unauthorized' });
	}
};
