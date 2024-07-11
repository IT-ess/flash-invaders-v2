import { supabase } from '$lib/supabase-client';

export async function downloadAvatar(path: string | null) {
	try {
		if (path === null) {
			throw new Error('No path provided');
		}

		const { data, error } = await supabase.storage.from('avatars').download(path);

		if (error) {
			throw error;
		}

		return URL.createObjectURL(data);
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error downloading image: ', error.message);
		}
	}
}

export async function updateAvatarPath(userId: string, url: string) {
	try {
		let { error } = await supabase.from('profiles').upsert({ avatar_url: url, id: userId });

		if (error) {
			throw error;
		}
	} catch (error) {
		if (error instanceof Error) {
			alert(error.message);
		}
	}
}
