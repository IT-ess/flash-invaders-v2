import { error, redirect } from '@sveltejs/kit';
import { sessionState } from '$lib/session-state.svelte';
import type { EntryGenerator, PageLoad } from './$types';
import { checkInvaderPrivilege } from '$lib/utils/invader-counter';
import { QUIZ_DATA } from '$lib/game-data/quiz';
import { INVADERS } from '$lib/game-data/invaders';
import { getQuizQuestions } from '$lib/game-data/quiz';

export const entries: EntryGenerator = () =>
	INVADERS.flatMap(({ id }) => [
		{ lang: 'fr', id: id.toString() },
		{ lang: 'de', id: id.toString() }
	]);

export const load = (async ({ params }) => {
	await sessionState.init();
	const session = sessionState.getSession;
	const invaderId = +params.id;
	const lang = params.lang;

	if (!session) {
		error(401, { message: 'Unauthorized' });
	}
	const { user } = session;
	// QUIZ_DATA is indexed by invader id, so an id outside the visible list (out of
	// range, or hidden for the event) must never reach it.
	if (!INVADERS.some(({ id }) => id === invaderId) || user === null) {
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
