<script lang="ts">
	import { t } from '$lib/translations/translations';

	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import OcticonLocation from '~icons/octicon/location';
	import LucideLightbulb from '~icons/lucide/lightbulb';
	import HintViewer from '$lib/components/HintViewer.svelte';
	import type { InvadersInfos } from '../+layout';

	let { data }: { data: PageData } = $props();

	let hintOpen = $state(false);
	let hintSrc = $state('');

	function handleCardClick(infos: InvadersInfos) {
		if (infos.id === 100) {
			if (infos.hintImg) {
				hintSrc = infos.hintImg;
				hintOpen = true;
			}
			return;
		}
		goto(`/${page.params.lang}/invader/${infos.id}`);
	}
</script>

{#snippet invaderCard(infos: InvadersInfos)}
	<div class="space-y-5 items-center justify-center my-6 mx-safe-offset-4">
		<Card.Root onclick={() => handleCardClick(infos)}>
			<Card.Header>
				<Card.Title>{$t(`common.zwt${infos.id}.name`)}</Card.Title>
				<Card.Description class="flex items-center space-x-1">
					{#if infos.id === 100}
						{#if infos.hintImg}
							<LucideLightbulb />
							<span>{$t('common.gallery.hint_cta')}</span>
						{:else}
							???
						{/if}
					{:else}
						<OcticonLocation />
						<p>{infos.lat.toFixed(5)},{infos.long.toFixed(5)}</p>
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<AspectRatio ratio={16 / 9} class="bg-muted rounded-sm shadow-md">
					<img src={infos.img} alt={infos.alt} />
				</AspectRatio>
			</Card.Content>
		</Card.Root>
	</div>
{/snippet}

<main class="mb-safe-offset-28">
	{#each data.invadersInfos as infos}
		{@render invaderCard(infos)}
	{/each}
</main>

<HintViewer
	bind:open={hintOpen}
	src={hintSrc}
	alt={$t('common.gallery.hint_cta')}
	help={$t('common.gallery.zoom_help')}
/>
