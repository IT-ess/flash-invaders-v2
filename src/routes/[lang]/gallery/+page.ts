import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { supabase, type ProfileRow } from '$lib/supabase-client';
import { INVADERS } from '$lib/game-data/invaders';

export const load: PageLoad = async (event) => {
	const session = await supabase.auth.getSession();
	const userId = session.data.session?.user.id;
	if (!session || !userId) {
		redirect(302, '/auth');
	}
	const { data, error } = await supabase.from('profiles').select().eq('id', userId).single();

	const { params } = event;
	if (error !== null) {
		redirect(307, `/${params.lang}/home`);
	}
	return { invadersInfos: getInvaderFromState(data) };
};

function getInvaderFromState(userData: ProfileRow): InvadersInfos[] {
	const invadersInfos: InvadersInfos[] = [];
	for (let i = 0; i < 12; i++) {
		const invaderState = userData[`inv${i}` as keyof ProfileRow] as number;
		if (invaderState > 0) {
			const { id, imageUrl, name } = INVADERS[i];
			invadersInfos.push({
				id,
				alt: name,
				img: imageUrl
			});
		} else {
			invadersInfos.push({
				id: 100,
				alt: 'placeholder',
				img: '/question_mark.png'
			});
		}
	}
	return invadersInfos;
}

export type InvadersInfos = {
	id: number;
	alt: string;
	img: string;
};
