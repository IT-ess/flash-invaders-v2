import { error, redirect } from '@sveltejs/kit';
import { sessionState } from '$lib/session-state.svelte';
import type { EntryGenerator, PageLoad } from './$types';
import { checkInvaderPrivilege } from '$lib/utils/invader-counter';
import { getQuizQuestions } from '$lib/game-data/quiz';

export const entries: EntryGenerator = () => {
	const entries = [];
	for (let i = 0; i < 12; i++) {
		entries.push({ lang: 'fr', id: i.toString() });
		entries.push({ lang: 'de', id: i.toString() });
	}
	return entries;
};

export const load = (async ({ params }) => {
	await sessionState.init();
	const session = sessionState.getSession;
	const invaderId = +params.id;
	const lang = params.lang;

	if (!session) {
		error(401, { message: 'Unauthorized' });
	}
	const { user } = session;
	if (invaderId > 11 || user === null) {
		// should be ok since the matcher is restrictive
		redirect(307, `/${lang}/home`);
	}

	const invaderPrivilege = await checkInvaderPrivilege(user.id, invaderId);

	// both locales are shipped so the quiz can be switched in place, without losing progress
	const questionsByLang = {
		fr: getQuizQuestions('fr', invaderId),
		de: getQuizQuestions('de', invaderId)
	};

	switch (invaderPrivilege) {
		case 0:
			redirect(307, `/${params.lang}/home`);
		case 1:
			return { user, questionsByLang };
		case 2:
			return redirect(307, `/${params.lang}/invader/${params.id}`);
		default:
			// Should not happen since the matcher only gives some numbers
			error(500, { message: 'Auth privileges should be between 0 and 2' });
	}
}) satisfies PageLoad;
