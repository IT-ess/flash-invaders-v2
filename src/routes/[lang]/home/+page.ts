import { supabase } from '$lib/supabase-client';
import type { EntryGenerator, PageLoad } from './$types';
import { sessionState } from '$lib/session-state.svelte';
import { error } from '@sveltejs/kit';

export const entries: EntryGenerator = () => {
	return [{ lang: 'fr' }, { lang: 'de' }];
};

export const load: PageLoad = async () => {
	const session = sessionState.getSession;
	if (session === null) {
		error(401, { message: 'Unauthorized' });
	}
	const { data } = await supabase.from('profiles').select().eq('id', session.user.id).single();
	if (!data) {
		error(404, { message: 'Profile not found' });
	}
	return {
		profile: data
	};
};
