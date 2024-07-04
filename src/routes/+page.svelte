<script lang="ts">
	import { t } from '$lib/translations/translations';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import Account from '$lib/components/Account.svelte';
	import { getSessionState } from '$lib/session-state.svelte';

	// let { data }: { data: PageData } = $props();
</script>

<div class="container">
	<h1>Welcome to Tauri!</h1>
	<h2 class="font-bold">Bonjour !</h2>

	<Account />

	<div>
		<h1 class="justify-center">Zwietess</h1>
	</div>
	<Button variant="default" size="default" href="/intro">
		{$t('common.nav.gallery')}
	</Button>
	<p>{$t('common.zwt3.name')}</p>
	<Button variant="default" size="default" href="/fr/search">Search</Button>
	<Button variant="default" size="default" href="/fr/invader/1">Invader</Button>
	<Button variant="default" size="default" href="/fr/invader/1/quiz">Quiz</Button>
	<Button variant="default" size="default" href="/fr/tutorial">Tuto</Button>
	<Button variant="default" size="default" href="/fr/gallery">Gallery</Button>
	<Button
		variant="default"
		size="default"
		href="https://www.google.com/maps/d/viewer?mid=1qDy-Qcv9ScGx97vlB1Wy_9tvOIumt0I">Maps</Button
	>
</div>

<!-- TODO: insert bottom nav here -->
