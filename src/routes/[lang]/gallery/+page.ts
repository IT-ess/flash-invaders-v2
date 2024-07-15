import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { supabase, type ProfileRow } from '$lib/supabase-client';
import { INVADERS } from '$lib/game-data/invaders';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return [{ lang: 'fr' }, { lang: 'de' }];
};

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
			const { id, imageUrl, name, latitude, longitude } = INVADERS[i];
			invadersInfos.push({
				id,
				alt: name,
				img: imageUrl,
				lat: latitude,
				long: longitude
			});
		} else {
			invadersInfos.push({
				id: 100,
				alt: 'placeholder',
				img: '/question_mark.png',
				lat: 0,
				long: 0
			});
		}
	}
	return invadersInfos;
}

export type InvadersInfos = {
	id: number;
	alt: string;
	img: string;
	lat: number;
	long: number;
};
