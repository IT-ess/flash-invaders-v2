import { supabase } from '$lib/supabase-client';
import type { EntryGenerator, PageLoad } from './$types';
import { sessionState } from '$lib/session-state.svelte';

export const entries: EntryGenerator = () => {
	return [{ lang: 'fr' }, { lang: 'de' }];
};

export const load: PageLoad = async () => {
	let score = 0;
	if (sessionState.getUserId) {
		const { data } = await supabase
			.from('profiles')
			.select('score')
			.eq('id', sessionState.getUserId)
			.single();
		score = data?.score ?? 0;
	}
	return {
		score
	};
};
