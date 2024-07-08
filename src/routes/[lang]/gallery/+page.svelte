<script lang="ts">
	import { t } from '$lib/translations/translations';

	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';

	let { data }: { data: PageData } = $props();
	data.invadersInfos;
</script>

{#snippet invaderCard(infos: InvadersInfos)}
	<div>
		<Card.Root>
			<Card.Header>
				<Card.Title>{$t(`common.zwt${infos.id}.name`)}</Card.Title>
				<Card.Description>Card Description (localization)</Card.Description>
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
