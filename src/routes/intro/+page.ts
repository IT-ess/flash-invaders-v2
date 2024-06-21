import { supabase } from '$lib/supabase-client';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const { data } = await supabase.from('countries').select();
	return {
		countries: data ?? []
	};
};
