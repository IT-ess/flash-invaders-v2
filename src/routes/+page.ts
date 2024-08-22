import { INVADERS, INVADERS_STARTING_INDEX } from '$lib/game-data/invaders';
import type { PageLoad } from './$types';

const themeColorsBg = ['bg-[#ff473d]', 'bg-[#ffd93e]', 'bg-[#0074cd]', 'bg-white'];

export const load: PageLoad = async (event) => {
	const firstMarquee = getMarqueeInfosArray();
	const secondMarquee = getMarqueeInfosArray();
	return { firstMarquee, secondMarquee };
};

function getMarqueeInfosArray(): MarqueeInfos[] {
	const marqueeInfos: MarqueeInfos[] = [];
	for (let i = 0; i < 12 - INVADERS_STARTING_INDEX; i++) {
		const { imageUrl, name } = INVADERS[i];
		marqueeInfos.push({
			alt: name,
			img: imageUrl,
			color: ''
		});
	}
	shuffle(marqueeInfos);
	for (let i = 0; i < marqueeInfos.length; i++) {
		marqueeInfos[i].color = themeColorsBg[i % themeColorsBg.length];
	}
	return marqueeInfos;
}

export type MarqueeInfos = {
	alt: string;
	img: string;
	color: string;
};

function shuffle(array: MarqueeInfos[]) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}
