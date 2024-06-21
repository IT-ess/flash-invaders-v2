<script lang="ts">
	import { t } from '$lib/translations/translations';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	// import { supabase } from '$lib/supabase-client';

	// async function signUpNewUser() {
	// 	const { data, error } = await supabase.auth.signUp({
	// 		email: 'example@email.com',
	// 		password: 'example-password',
	// 		options: {
	// 			data: { full_name: 'John Doe' }
	// 		}
	// 	});
	// }

	export let data: PageData;
</script>

<ul>
	{#each data.countries as country}
		<li>{country.name}</li>
	{/each}
</ul>

<div class="container">
	<h1>Welcome to Tauri!</h1>
	<h2 class="font-bold">Bonjour !</h2>

	<div>
		<h1 class="justify-center">Zwietess</h1>
	</div>
	<Button variant="default" size="default" href="/intro">
		{$t('common.nav.gallery')}
	</Button>
	<p>{$t('common.zwt3.name')}</p>
	<Button variant="default" size="default" href="/search">Search</Button>
	<Button
		variant="default"
		size="default"
		href="https://www.google.com/maps/d/viewer?mid=1qDy-Qcv9ScGx97vlB1Wy_9tvOIumt0I">Maps</Button
	>
	<Button variant="default" size="default" href="/signup">Login</Button>
</div>
