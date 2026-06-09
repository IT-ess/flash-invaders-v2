import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './zod-schema.ts';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageLoad = async () => {
	return {
		form: await superValidate(zod4(formSchema))
	};
};
