<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { supabase } from '$lib/supabase-client';
	import NewAvatar from './NewAvatar.svelte';

	let {
		url = $bindable(),
		userId,
		username
	}: {
		url: string | null;
		userId: string;
		username: string | null;
		score: number;
		invaderCount: number;
	} = $props();

	let loading = $state(false);

	const updateProfile = async () => {
		try {
			loading = true;
			let updates;

			updates = {
				id: userId,
				username,
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
</script>

<div>
	<div>
		<NewAvatar bind:url {username} {userId} />
	</div>
	<form onsubmit={updateProfile} class="grid items-start gap-4 px-4">
		<div class="grid gap-2">
			<Label for="username">Username</Label>
			<Input id="username" bind:value={username} />
		</div>
		<Button type="submit">Save changes</Button>
	</form>
</div>
