<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations/translations';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';

	let buttonDisabled = $state(true);

	$effect(() => {
		setTimeout(() => {
			buttonDisabled = false;
		}, 10000);
	});
</script>

<Toaster richColors />

{#if buttonDisabled}
	<Button variant="outline" class="opacity-50" onclick={() => toast.warning($t('tutorial.warning'))}
		>{$t('tutorial.register')} <OcticonArrowRight16 class="ml-1" />
	</Button>
{:else}
	<Button href="/{$page.params.lang}/auth" variant="default">
		{$t('tutorial.register')}
		<OcticonArrowRight16 class="ml-1" />
	</Button>
{/if}
