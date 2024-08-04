<script lang="ts">
	import { t } from '$lib/translations/translations';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { supabase } from '$lib/supabase-client';
	import Avatar from './Avatar.svelte';

	let {
		url = $bindable(),
		userId,
		username = $bindable()
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

<div class="font-firava">
	<div>
		<Avatar bind:url {username} {userId} />
	</div>
	<form onsubmit={updateProfile} class="grid items-start gap-4 px-4">
		<div class="grid gap-2">
			<Label class="text-base font-medium" for="username">{$t(`common.profile.username`)}</Label>
			<Input class="border-primary" id="username" bind:value={username} />
		</div>
		<Button type="submit">{$t(`common.nav.submit`)}</Button>
	</form>
</div>
