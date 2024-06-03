<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { t } from '$lib/translations/translations';
</script>

<main class="container">
	<div>
		<h1 class="justify-center">Zwietess</h1>
	</div>
	<Button variant="default" size="default" href="/intro">
		{$t('common.nav.gallery')}
	</Button>
	<Button variant="default" size="default" href="/fr/search">Search</Button>
</main>
