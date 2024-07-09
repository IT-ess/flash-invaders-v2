<script lang="ts">
	import { supabase } from '../supabase-client';
	import Avatar from './Avatar.svelte';
	import { goto } from '$app/navigation';
	import type { AuthSession } from '@supabase/supabase-js';
	import { sessionState } from '$lib/session-state.svelte.ts';

	let loading = $state(false);
	let username: string | null = $state(null);
	let avatarUrl: string | null = $state(null);
	let userId: string | undefined = $state();

	let session = $state<AuthSession | null>(null);

	$effect(() => {
		session = sessionState.getSession;
		userId = session?.user.id;
		// TODO: getProfile currently runs twice, before the session retrieval (and it results in an error), and after (it succeeds).
		// I should find a way to handle this better
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
				.select('username, avatar_url')
				.eq('id', user.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				username = data.username;
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
	<Avatar bind:url={avatarUrl} size={150} {userId} upload={() => updateProfile()} />
	<div>Email: {session?.user.email}</div>
	<div>
		<label for="username">Name</label>
		<input id="username" type="text" bind:value={username} />
	</div>
	<div>
		<button type="submit" class="button primary block" disabled={loading}>
			{loading ? 'Saving ...' : 'Update profile'}
		</button>
	</div>
	<button type="button" class="button block" onclick={handleSignOut}> Sign Out </button>
</form>
