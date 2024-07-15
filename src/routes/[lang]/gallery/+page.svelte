<script lang="ts">
	import { t } from '$lib/translations/translations';

	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import type { InvadersInfos } from './+page.ts';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import OcticonLocation from '~icons/octicon/location';

	let { data }: { data: PageData } = $props();
	data.invadersInfos;
</script>

{#snippet invaderCard(infos: InvadersInfos)}
	<div class="space-y-5 items-center justify-center my-6">
		<Card.Root
			onclick={() => {
				if (infos.id === 100) {
					return;
				}
				goto(`/${$page.params.lang}/invader/${infos.id}`);
			}}
		>
			<Card.Header>
				<Card.Title>{$t(`common.zwt${infos.id}.name`)}</Card.Title>
				<Card.Description class="flex items-center">
					{#if infos.id === 100}
						???
					{:else}
						<OcticonLocation />{infos.lat.toFixed(5)},{infos.long.toFixed(5)}
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<AspectRatio ratio={16 / 9} class="bg-muted">
					<img src={infos.img} alt={infos.alt} />
				</AspectRatio>
			</Card.Content>
		</Card.Root>
	</div>
{/snippet}

<main>
	{#each data.invadersInfos as infos}
		{@render invaderCard(infos)}
	{/each}
</main>
