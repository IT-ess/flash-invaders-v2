<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Carousel from '$lib/components/ui/carousel/index.ts';
	import { Video } from 'flowbite-svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { INVADERS } from '$lib/game-data/invaders';
	import { MediaQuery } from 'runed';
	import type { PageData } from './$types';

	let pageId = +$page.params.id;

	let { data }: { data: PageData } = $props();

	const { carouselCaptions, carouselUrls, itemsTypes, itemsSources, itemsCaptions } =
		INVADERS[pageId];

	const carouselItems = carouselCaptions.map((caption, index) => ({
		caption,
		url: carouselUrls[index]
	}));

	const contents = itemsSources.map((source, index) => ({
		source,
		caption: itemsCaptions[index],
		type: itemsTypes[index]
	}));

	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

<div class="relative min-h-screen flex flex-col bg-gray-100 mt-8">
	<div class="bg-white pt-4 px-8 flex-grow flex flex-col overflow-y-auto pb-6">
		<Carousel.Root>
			<Carousel.Content>
				{#each carouselItems as { url, caption }}
					<Carousel.Item><img src={url} alt={caption} /></Carousel.Item>
				{/each}
			</Carousel.Content>
			{#if isDesktop.matches}
				<Carousel.Previous />
				<Carousel.Next />
			{/if}
		</Carousel.Root>
		<div class="pb-4 mt-4">
			<h1>{$t(`common.zwt${$page.params.id}.name`)}</h1>
		</div>
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
						<p>{caption}</p>
					{/if}
					<Video
						src={source}
						controls
						class="w-full max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
					/>
				</div>
			{:else if type === 'audio'}
				<div>
					{#if caption}
						<p>{caption}</p>
					{/if}
					<audio controls src={source}></audio>
				</div>
			{:else}
				<p>Wrong type of content</p>
			{/if}
		{/each}
		<div class="pr-2 flex-grow space-y-8"></div>
	</div>
	<div class="w-full h-24 flex justify-center items-center bg-gray-200 space-x-4">
		<Button variant="secondary" href="/{$page.params.lang}/gallery">{$t('context.gallery')}</Button>
		{#if !data.answered}
			<Button href="./{$page.params.id}/quiz">{$t(`context.quiz`)}</Button>
		{/if}
	</div>
</div>
