<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Accordion from '$lib/components/ui/accordion';
	import OcticonRadioTower from '~icons/octicon/radio-tower';
	import OcticonBrowser from '~icons/octicon/browser';
	import OcticonBook from '~icons/octicon/book';
	import MdiNfc from '~icons/mdi/nfc';
	import MaterialSymbolsLanguage from '~icons/material-symbols/language';
	import Fa6SolidMapLocationDot from '~icons/fa6-solid/map-location-dot';
	import * as Card from '$lib/components/ui/card';
	import GoToRegistration from '$lib/components/GoToRegistration.svelte';
	import PageIndicator from '$lib/components/PageIndicator.svelte';
	import { PUBLIC_PLATFORM } from '$env/static/public';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';

	const isMobile = PUBLIC_PLATFORM === 'mobile' ? true : false;
	const isIos = PUBLIC_PLATFORM === 'ios' ? true : false;

	let newLang: string = $state('');
	let newUrl: string = $state('');

	$effect(() => {
		newLang = $page.params.lang === 'fr' ? 'de' : 'fr';
		newUrl = $page.url.pathname.replace($page.params.lang, newLang);
		document.documentElement.lang = $page.params.lang;
	});
</script>

<div class="min-h-screen w-full flex flex-col items-center justify-center container">
	<Card.Root class="relative">
		<div class="absolute right-2 top-2">
			<Button variant="outline" class="!p-2" onclick={() => goto(newUrl)}>
				{#if $page.params.lang === 'fr'}
					🇫🇷
				{:else}
					🇩🇪
				{/if}
			</Button>
		</div>
		<Card.Header>
			<Card.Title>{$t(`tutorial.header`)}</Card.Title>
			<Card.Description
				><p class="font-bold">
					{$t(`tutorial.welcome.p1`)} <span class="text-blue-600 italic">Zw</span><span
						class="text-red-500 italic">ie</span
					><span class="text-black italic">te</span><span class="text-yellow-300 italic">ss</span> !
					{$t(`tutorial.welcome.p2`)}
				</p></Card.Description
			>
		</Card.Header>
		<Card.Content>
			<Accordion.Root type="single" class="w-full">
				<Accordion.Item value="item-1">
					<Accordion.Trigger
						><div class="w-6 h-6"><OcticonRadioTower /></div>
						<span class="mr-5">{$t(`tutorial.sec1.heading`)}</span></Accordion.Trigger
					>
					<Accordion.Content>
						<p class="mb-2 text-justify dark:text-blue-400">
							{$t(isMobile && !isIos ? `tutorial.sec1_mobile.content` : `tutorial.sec1.content`)}
						</p>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-2">
					<Accordion.Trigger
						><div class="w-6 h-6"><MaterialSymbolsLanguage /></div>
						<span class="mr-5">{$t(`tutorial.sec2.heading`)}</span></Accordion.Trigger
					>
					<Accordion.Content>
						<p class="mb-2 text-justify dark:text-blue-400">
							{$t(`tutorial.sec2.content`)}
						</p>
					</Accordion.Content>
				</Accordion.Item>
				{#if !isMobile && !isIos}
					<Accordion.Item value="item-3">
						<Accordion.Trigger
							><div class="w-6 h-6"><OcticonBrowser /></div>
							<span class="mr-5">{$t(`tutorial.sec3.heading`)}</span></Accordion.Trigger
						>
						<Accordion.Content>
							<p class="mb-2 text-justify dark:text-blue-400">
								{$t(`tutorial.sec3.content`)}
							</p>
						</Accordion.Content>
					</Accordion.Item>
				{/if}
				<Accordion.Item value="item-4">
					<Accordion.Trigger
						><div class="w-6 h-6"><OcticonBook /></div>
						<span class="mr-5">{$t(`tutorial.sec4.heading`)}</span></Accordion.Trigger
					>
					<Accordion.Content>
						<p class="mb-2 text-justify dark:text-blue-400">
							{$t(`tutorial.sec4.content`)}
						</p>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-5">
					<Accordion.Trigger
						><div class="w-6 h-6"><Fa6SolidMapLocationDot /></div>
						<span class="mr-5">{$t(`tutorial.sec5.heading`)}</span></Accordion.Trigger
					>
					<Accordion.Content>
						<p class="mb-2 text-justify dark:text-blue-400">
							{$t(`tutorial.sec5.content`)}
						</p>
					</Accordion.Content>
				</Accordion.Item>
				{#if isMobile && !isIos}
					<Accordion.Item value="item-6">
						<Accordion.Trigger
							><div class="w-6 h-6"><MdiNfc /></div>
							<span class="mr-5">{$t(`tutorial.sec6_mobile.heading`)}</span></Accordion.Trigger
						>
						<Accordion.Content>
							<p class="mb-2 text-justify dark:text-blue-400">
								{$t(`tutorial.sec6_mobile.content`)}
							</p>
						</Accordion.Content>
					</Accordion.Item>
				{/if}
			</Accordion.Root>
		</Card.Content>
		<Card.Footer class="justify-end">
			<GoToRegistration />
		</Card.Footer>
	</Card.Root>
	<PageIndicator totalPages={3} currentPage={2} />
</div>
