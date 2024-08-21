import { error, redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import type { InvaderPrivileges } from '$lib/utils/invader-counter';
import { INVADERS_STARTING_INDEX } from '$lib/game-data/invaders';

export const entries: EntryGenerator = () => {
	const entries = [];
	for (let i = INVADERS_STARTING_INDEX; i < 12; i++) {
		entries.push({ lang: 'fr', id: i.toString() });
		entries.push({ lang: 'de', id: i.toString() });
	}
	return entries;
};

export const load = (async ({ params, parent }) => {
	const { privileges } = await parent();

	switch (privileges[`inv${params.id}` as keyof InvaderPrivileges]) {
		case 0:
			redirect(307, `/${params.lang}/home`);
		case 1:
			return {
				answered: false
			};
		case 2:
			return {
				answered: true
			};
		default:
			// Should not happen since the matcher only gives some numbers
			error(500, { message: 'Auth privileges should be between 0 and 2' });
	}
}) satisfies PageLoad;
