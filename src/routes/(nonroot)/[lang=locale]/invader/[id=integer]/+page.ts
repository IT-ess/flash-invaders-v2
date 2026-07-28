import { error, redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import type { InvaderPrivileges } from '$lib/utils/invader-counter';
import { INVADERS } from '$lib/game-data/invaders';

export const entries: EntryGenerator = () =>
	INVADERS.flatMap(({ id }) => [
		{ lang: 'fr', id: id.toString() },
		{ lang: 'de', id: id.toString() }
	]);

export const load = (async ({ params, parent }) => {
	const { privileges } = await parent();

	// Hidden invaders keep their `inv*` column, so the privilege switch below would
	// happily let one through; and `+page.svelte` falls back to invader 0 when the id
	// is unknown, which would render the wrong content instead of failing.
	if (!INVADERS.some(({ id }) => id === +params.id)) {
		redirect(307, `/${params.lang}/home`);
	}

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
