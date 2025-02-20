<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Carousel from '$lib/components/ui/carousel/index.ts';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { INVADERS, INVADERS_STARTING_INDEX } from '$lib/game-data/invaders';
	import type { PageData } from './$types';

	let pageId = +page.params.id;

	let { data }: { data: PageData } = $props();

	const { carouselCaptions, carouselUrls, itemsTypes, itemsSources, itemsCaptions } =
		INVADERS[pageId - INVADERS_STARTING_INDEX];

	const carouselItems = carouselCaptions.map((caption, index) => ({
		caption,
		url: carouselUrls[index]
	}));

	const contents = itemsSources.map((source, index) => ({
		source,
		caption: itemsCaptions[index],
		type: itemsTypes[index]
	}));
</script>

<div class="relative flex flex-col bg-gray-100 mt-10">
	<div class="bg-white pt-4 px-8 flex-grow flex flex-col overflow-y-auto pb-6 rounded-md shadow-lg">
		<Carousel.Root>
			<Carousel.Content>
				{#each carouselItems as { url, caption }}
					<Carousel.Item><img class="rounded-sm mx-auto" src={url} alt={caption} /></Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous class="ml-6" />
			<Carousel.Next class="mr-6" />
		</Carousel.Root>
		<div class="mt-4 space-y-4">
			{#each contents as { source, type, caption }}
				{#if type === 'text'}
					<div>
						<p>
							{$t(source)}
						</p>
					</div>
				{:else if type === 'video'}
					<div>
						{#if caption}
							<p class="text-muted-foreground">{caption}</p>
						{/if}
						<video
							controls
							src={source}
							class="w-full max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
							><track kind="captions" /></video
						>
					</div>
				{:else if type === 'audio'}
					<div>
						{#if caption}
							<p class="text-muted-foreground">{caption}</p>
						{/if}
						<audio controls src={source}></audio>
					</div>
				{:else}
					<p>Wrong type of content</p>
				{/if}
			{/each}
		</div>
	</div>
	<div class="w-full h-24 flex justify-center items-center bg-gray-200 space-x-4">
		<Button variant="secondary" href="/{page.params.lang}/gallery">{$t('context.gallery')}</Button>
		{#if !data.answered}
			<Button href="./{page.params.id}/quiz">{$t(`context.quiz`)}</Button>
		{/if}
	</div>
</div>
