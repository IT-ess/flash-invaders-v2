import type { PageLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './zod-schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};
