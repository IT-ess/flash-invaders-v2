<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Accordion from '$lib/components/ui/accordion';
	import OcticonRadioTower from '~icons/octicon/radio-tower';
	import OcticonBrowser from '~icons/octicon/browser';
	import OcticonBook from '~icons/octicon/book';
	import OcticonArrowBoth from '~icons/octicon/arrow-both';
	import Fa6SolidMapLocationDot from '~icons/fa6-solid/map-location-dot';
</script>

<div class="flex flex-col grow w-full justify-center items-center font-sans text-center">
	<div class="p-6 bg-white min-h-1/4 flex-initial">
		<p class="font-bold">
			{$t(`tutorial.welcome.p1`)} <span class="text-blue-600 italic">Zw</span><span
				class="text-red-500 italic">ie</span
			><span class="text-black italic">te</span><span class="text-yellow-300 italic">ss</span> !
			{$t(`tutorial.welcome.p2`)}
		</p>
	</div>

	<Accordion.Root class="w-full sm:max-w-[70%]">
		<Accordion.Item value="item-1">
			<Accordion.Trigger
				><div class="w-6 h-6"><OcticonRadioTower /></div>
				<span class="mr-5">{$t(`tutorial.sec1.heading`)}</span></Accordion.Trigger
			>
			<Accordion.Content>
				<p class="mb-2 text-blue-500 dark:text-blue-400">
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
				<p class="mb-2 text-blue-500 dark:text-blue-400">
					{$t(`tutorial.sec2.content`)}
				</p>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-3">
			<Accordion.Trigger
				><div class="w-6 h-6"><OcticonBrowser /></div>
				<span class="mr-5">{$t(`tutorial.sec3.heading`)}</span></Accordion.Trigger
			>
			<Accordion.Content>
				<p class="mb-2 text-blue-500 dark:text-blue-400">
					{$t(`tutorial.sec3.content`)}
				</p>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-4">
			<Accordion.Trigger
				><div class="w-6 h-6"><OcticonBook /></div>
				<span class="mr-5">{$t(`tutorial.sec4.heading`)}</span></Accordion.Trigger
			>
			<Accordion.Content>
				<p class="mb-2 text-blue-500 dark:text-blue-400">
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
				<p class="mb-2 text-blue-500 dark:text-blue-400">
					{$t(`tutorial.sec1.content`)}
				</p>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
