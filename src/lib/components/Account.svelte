<script lang="ts">
	import { supabase } from '../supabase-client';
	import Avatar from './Avatar.svelte';
	import { getSessionState } from '$lib/session-state.svelte';
	import { goto } from '$app/navigation';

	const sessionState = getSessionState();
	const session = sessionState.getSession;

	let loading = $state(false);
	let username: string | null = $state(null);
	let website: string | null = $state(null);
	let avatarUrl: string | null = $state(null);

	$effect(() => {
		getProfile();
	});

	const getProfile = async () => {
		if (session === null) {
			throw Error('Not authenticated'); // I should handle this better
		}
		try {
			loading = true;
			const { user } = session;

			const { data, error, status } = await supabase
				.from('profiles')
				.select('username, website, avatar_url')
				.eq('id', user.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				username = data.username;
				website = data.website;
				avatarUrl = data.avatar_url;
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const updateProfile = async () => {
		if (session === null) {
			throw Error('Not authenticated'); // I should handle this better
		}
		try {
			loading = true;
			const { user } = session;

			const updates = {
				id: user.id,
				username,
				website,
				avatar_url: avatarUrl,
				updated_at: new Date().toISOString()
			};

			let { error } = await supabase.from('profiles').upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const handleSignOut = () => {
		sessionState.signOut();
		goto('/auth');
	};
</script>

<form onsubmit={updateProfile} class="form-widget">
	<Avatar bind:url={avatarUrl} size={150} upload={() => updateProfile()} />
	<div>Email: {session?.user.email}</div>
	<div>
		<label for="username">Name</label>
		<input id="username" type="text" bind:value={username} />
	</div>
	<div>
		<label for="website">Website</label>
		<input id="website" type="text" bind:value={website} />
	</div>
	<div>
		<button type="submit" class="button primary block" disabled={loading}>
			{loading ? 'Saving ...' : 'Update profile'}
		</button>
	</div>
	<button type="button" class="button block" onclick={handleSignOut}> Sign Out </button>
</form>
