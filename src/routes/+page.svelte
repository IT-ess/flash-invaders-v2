<script lang="ts">
	import { t } from '$lib/translations/translations';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Marquee } from '$lib/components/ui/marquee';
	import type { PageData } from './$types';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';
	import Title from '$lib/components/Title.svelte';

	let { data }: { data: PageData } = $props();
	const { firstMarquee, secondMarquee } = data;
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...
	const localStorageMatchingKeys = localStorage.key(0)?.match('sb') ?? [];
	const isAlreadyLoggedId = localStorageMatchingKeys.length > 0;
</script>

<div class="h-screen w-screen bg-black flex flex-col justify-evenly">
	<Title />
	<div class="flex flex-col space-y-4">
		<Marquee fade={true}>
			{@render marqueeContent(firstMarquee)}
		</Marquee>
		<Marquee reverse={true} fade={true}>
			{@render marqueeContent(secondMarquee)}
		</Marquee>
	</div>
	<div class="items-center justify-center flex space-x-6">
		<Button
			size="lg"
			variant="default"
			href={isAlreadyLoggedId ? `${defaultLocale}/home` : '/auth'}
		>
			{$t(`common.nav.begin`)}<OcticonArrowRight16 class="ml-1 mb-[4px]" /></Button
		>
	</div>
</div>

{#snippet marqueeContent(marquee)}
	{#each marquee as { img, alt, color }}
		<div class="w-[130px] h-[130px] {color} rounded-lg flex items-center justify-center">
			<img class="m-8" src={img} {alt} />
		</div>
	{/each}
{/snippet}
