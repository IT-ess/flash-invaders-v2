import { error, redirect } from '@sveltejs/kit';
import { sessionState } from '$lib/session-state.svelte';
import type { EntryGenerator, PageLoad } from './$types';
import { checkInvaderPrivilege } from '$lib/utils/invader-counter';
import { QUIZ_DATA } from '$lib/game-data/quiz';

export const entries: EntryGenerator = () => {
	const entries = [];
	for (let i = 0; i < 11; i++) {
		entries.push({ lang: 'fr', id: i.toString() });
		entries.push({ lang: 'de', id: i.toString() });
	}
	return entries;
};

export const load = (async ({ params }) => {
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

	const questionsByLang = lang === 'fr' ? QUIZ_DATA.fr : QUIZ_DATA.de;
	const flatQuestions = questionsByLang[invaderId];
	const questions = [
		{
			question: flatQuestions.question1,
			options: flatQuestions.options1,
			correctIndex: flatQuestions.index1
		},
		{
			question: flatQuestions.question2,
			options: flatQuestions.options2,
			correctIndex: flatQuestions.index2
		},
		{
			question: flatQuestions.question3,
			options: flatQuestions.options3,
			correctIndex: flatQuestions.index3
		},
		{
			question: flatQuestions.question4,
			options: flatQuestions.options4,
			correctIndex: flatQuestions.index4
		}
	];

	switch (invaderPrivilege) {
		case 0:
			redirect(307, `/${params.lang}/home`);
		case 1:
			return { user, questions };
		case 2:
			return redirect(307, `/${params.lang}/invader/${params.id}`);
		default:
			// Should not happen since the matcher only gives some numbers
			error(500, { message: 'Auth privileges should be between 0 and 2' });
	}
}) satisfies PageLoad;
