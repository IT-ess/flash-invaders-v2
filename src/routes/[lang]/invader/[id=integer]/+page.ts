import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	const entries = [];
	for (let i = 0; i < 12; i++) {
		entries.push({ lang: 'fr', id: i.toString() });
		entries.push({ lang: 'de', id: i.toString() });
	}
	return entries;
};
