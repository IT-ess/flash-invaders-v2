<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Carousel from '$lib/components/ui/carousel/index.ts';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let showThumbs = false;
	let showCaptions = false;
	let showIndicators = false;
	// const images = data.context.carousel;
	const content = [{ source: '', type: '', caption: '' }]; // data.context.items;

	// onMount(() => {
	// 	preloadImages();
	// });

	// function preloadImages() {
	// 	images.forEach(({ imgurl }) => {
	// 		const img = new Image();
	// 		img.src = imgurl;
	// 	});
	// }
</script>

<div class="relative min-h-screen flex flex-col bg-gray-100">
	<div class="bg-white pt-4 px-8 flex-grow flex flex-col overflow-y-auto pb-6">
		<Carousel.Root>
			<Carousel.Content>
				<Carousel.Item>...</Carousel.Item>
				<Carousel.Item>...</Carousel.Item>
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
		<!-- <Carousel {images} {showThumbs} {showCaptions} {showIndicators} /> -->
		<div class="pb-4 mt-4">
			<h1>{$t(`common.zwt${$page.params.id}.name`)}</h1>
		</div>
		{#each content as { source, type, caption }}
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
					<audio controls src={source} />
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
