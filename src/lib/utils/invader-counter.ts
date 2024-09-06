import { supabase } from '$lib/supabase-client';
import { browser } from '$app/environment';

const cache = new Map();

export async function invaderCounter(targetedUserId: string, forceFetch: boolean): Promise<number> {
	if (browser && cache.has(`${targetedUserId}_count`) && !forceFetch) {
		return cache.get(`${targetedUserId}_count`);
	}
	let { data, error } = await supabase.rpc('count_found_invaders', {
		profile_id: targetedUserId
	});
	if (error) console.error(error);

	cache.set(`${targetedUserId}_count`, data ?? 0);

	return data ?? 0;
}

export async function checkInvaderPrivilege(userId: string, invaderId: number): Promise<number> {
	if (browser && cache.has(`${userId}_${invaderId}_privilege`)) {
		return cache.get(`${userId}_${invaderId}_privilege`);
	}

	let { data, error } = await supabase.rpc('check_invader_privilege', {
		profile_id: userId,
		invader_id: invaderId
	});

	cache.set(`${userId}_${invaderId}_privilege`, data ?? 0);

	if (error) console.error(error);
	return data ?? 0;
}

export type InvaderPrivileges = {
	id: string;
	inv0: number;
	inv1: number;
	inv2: number;
	inv3: number;
	inv4: number;
	inv5: number;
	inv6: number;
	inv7: number;
	inv8: number;
	inv9: number;
	inv10: number;
	inv11: number;
	updated_at: string | null;
};
