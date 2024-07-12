import { redirect } from '@sveltejs/kit';
import { sessionState } from '$lib/session-state.svelte';
import type { EntryGenerator, PageLoad } from './$types';
import { supabase } from '$lib/supabase-client';
import { checkInvaderPrivilege } from '$lib/utils/invader-counter';

export const entries: EntryGenerator = () => {
	const entries = [];
	for (let i = 0; i < 12; i++) {
		entries.push({ lang: 'fr', id: i.toString() });
		entries.push({ lang: 'de', id: i.toString() });
	}
	return entries;
};

export const load = (async ({ params }) => {
	const session = sessionState.getSession;
	const invaderId = +params.id;

	if (!session) {
		redirect(302, '/');
	}
	if (invaderId > 11) {
		// should be ok since the matcher is restrictive
		redirect(307, `/${params.lang}/home`);
	}
	const { user } = session;

	const invaderPrivilege = await checkInvaderPrivilege(user.id, invaderId);

	if (user === null) {
		redirect(307, `/${params.lang}/home`);
	}

	switch (invaderPrivilege) {
		case 0:
			redirect(307, `/${params.lang}/home`);
		case 1:
			return {
				answered: false,
				user
			};
		case 2:
			return {
				answered: true,
				user
			};
		default:
			// Should not happen since the matcher only gives some numbers
			redirect(307, `/${params.lang}/home`);
	}
}) satisfies PageLoad;
