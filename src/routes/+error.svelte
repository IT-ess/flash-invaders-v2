<script lang="ts">
	import { t } from '$lib/translations/translations';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
{#if $page.status === 401}
	<Button variant="default" size="default" href="/auth">
		{$t('common.nav.auth')}
	</Button>
{:else}
	<Button variant="default" size="default" href="/">
		{$t('common.nav.home')}
	</Button>
{/if}
