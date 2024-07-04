<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Carousel from '$lib/components/ui/carousel/index.ts';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { INVADERS } from '$lib/game-data/invaders';

	// const images = data.context.carousel;
	const content = [{ source: '', type: '', caption: '' }]; // data.context.items;

	const { carouselCaptions, carouselUrls, itemsTypes, itemsSources, itemsCaptions } =
		INVADERS[+$page.params.id];

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

<div class="relative min-h-screen flex flex-col bg-gray-100">
	<div class="bg-white pt-4 px-8 flex-grow flex flex-col overflow-y-auto pb-6">
		<Carousel.Root>
			<Carousel.Content>
				{#each carouselItems as { url, caption }}
					<Carousel.Item><img src={url} alt={caption} /></Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
		<!-- <Carousel {images} {showThumbs} {showCaptions} {showIndicators} /> -->
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
					<!-- <Video src={source} controls /> -->
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
		<Button href="/{$page.params.lang}/gallery">{$t('context.gallery')}</Button>
	</div>
</div>
