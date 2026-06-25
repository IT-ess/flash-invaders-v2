<script lang="ts">
	import { t } from '$lib/translations/translations';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';
	import { onMount } from 'svelte';

	let buttonDisabled = $state(true);

	onMount(() => {
		setTimeout(() => {
			buttonDisabled = false;
		}, 2000);
	});
</script>

<Toaster richColors />

{#if buttonDisabled}
	<Button variant="outline" class="opacity-50" onclick={() => toast.warning($t('tutorial.warning'))}
		>{$t('common.nav.begin')} <OcticonArrowRight16 class="ml-1" />
	</Button>
{:else}
	<Button href="home" variant="default">
		{$t('common.nav.begin')}
		<OcticonArrowRight16 class="ml-1" />
	</Button>
{/if}
