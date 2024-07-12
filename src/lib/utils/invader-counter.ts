import { supabase, type ProfileRow } from '$lib/supabase-client';

export async function invaderCounter(userId: string): Promise<number> {
	let { data, error } = await supabase.rpc('count_found_invaders', {
		profile_id: userId
	});

	if (error) console.error(error);
	return data ?? 0;
}

export async function checkInvaderPrivilege(userId: string, invaderId: number): Promise<number> {
	let { data, error } = await supabase.rpc('check_invader_privilege', {
		profile_id: userId,
		invader_id: invaderId
	});

	if (error) console.error(error);
	return data ?? 0;
}
