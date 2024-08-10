import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	if (param === 'fr' || param === 'de') {
		return true;
	} else {
		return false;
	}
}) satisfies ParamMatcher;
