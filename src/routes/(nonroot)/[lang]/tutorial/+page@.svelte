<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Accordion from '$lib/components/ui/accordion';
	import OcticonRadioTower from '~icons/octicon/radio-tower';
	import OcticonBrowser from '~icons/octicon/browser';
	import OcticonBook from '~icons/octicon/book';
	import OcticonArrowBoth from '~icons/octicon/arrow-both';
	import Fa6SolidMapLocationDot from '~icons/fa6-solid/map-location-dot';
	import * as Card from '$lib/components/ui/card';
	import GoToRegistration from '$lib/components/GoToRegistration.svelte';
	import PageIndicator from '$lib/components/PageIndicator.svelte';
	import { PUBLIC_PLATFORM } from '$env/static/public';

	const isMobile = PUBLIC_PLATFORM === 'mobile' ? true : false;
</script>

<div class="min-h-screen w-full flex flex-col items-center justify-center container">
	<Card.Root>
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
			<Accordion.Root class="w-full sm:max-w-[70%]">
				<Accordion.Item value="item-1">
					<Accordion.Trigger
						><div class="w-6 h-6"><OcticonRadioTower /></div>
						<span class="mr-5">{$t(`tutorial.sec1.heading`)}</span></Accordion.Trigger
					>
					<Accordion.Content>
						<p class="mb-2 text-justify dark:text-blue-400">
							{$t(`tutorial.sec1.content`)}
						</p>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="item-2">
					<Accordion.Trigger
						><div class="w-6 h-6"><OcticonArrowBoth /></div>
						<span class="mr-5">{$t(`tutorial.sec2.heading`)}</span></Accordion.Trigger
					>
					<Accordion.Content>
						<p class="mb-2 text-justify dark:text-blue-400">
							{$t(`tutorial.sec2.content`)}
						</p>
					</Accordion.Content>
				</Accordion.Item>
				{#if !isMobile}
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
							{$t(`tutorial.sec1.content`)}
						</p>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
		<Card.Footer class="justify-end">
			<GoToRegistration />
		</Card.Footer>
	</Card.Root>
	<PageIndicator totalPages={3} currentPage={2} />
</div>
