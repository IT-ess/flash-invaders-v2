<script lang="ts">
	import { t } from '$lib/translations/translations';
	import MdiNfc from '~icons/mdi/nfc';
	import Fa6SolidMapLocationDot from '~icons/fa6-solid/map-location-dot';
	import OcticonQuestion16 from '~icons/octicon/question-16';
	import OcticonTrophy16 from '~icons/octicon/trophy-16';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';
	import * as Card from '$lib/components/ui/card';
	import PageIndicator from '$lib/components/PageIndicator.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { PUBLIC_PLATFORM } from '$env/static/public';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const isMobile = PUBLIC_PLATFORM === 'mobile';
	const lang = page.params.lang === 'de' ? 'de' : 'fr';

	// 0 = how to catch an invader, 1 = quiz & points.
	let step = $state(0);

	let newLang: string = $state('');
	let newUrl: string = $state('');
	$effect(() => {
		newLang = page.params.lang === 'fr' ? 'de' : 'fr';
		newUrl = page.url.pathname.replace(newLang === 'fr' ? 'de' : 'fr', newLang);
		document.documentElement.lang = newLang === 'fr' ? 'de' : 'fr';
	});

	function next() {
		if (step === 0) {
			step = 1;
		} else {
			goto(`/${lang}/avatar`);
		}
	}
</script>

<div class="min-h-screen w-full flex flex-col items-center justify-center container">
	<Card.Root class="relative w-full max-w-md">
		<div class="absolute right-2 top-2">
			<Button variant="outline" class="p-2!" onclick={() => goto(newUrl)}>
				{#if page.params.lang === 'fr'}
					🇫🇷
				{:else}
					🇩🇪
				{/if}
			</Button>
		</div>

		{#if step === 0}
			<Card.Header>
				<Card.Title>{$t('tutorial.scan.heading')}</Card.Title>
				<Card.Description>
					{$t('tutorial.welcome.p1')}
					<span class="text-blue-600 italic">Zw</span><span class="text-red-500 italic">ie</span
					><span class="text-black italic">te</span><span class="text-yellow-300 italic">ss</span> !
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="flex items-start gap-4">
					<Fa6SolidMapLocationDot class="h-9 w-9 shrink-0 text-primary" />
					<div>
						<h3 class="font-semibold">{$t('tutorial.scan.location_title')}</h3>
						<p class="text-muted-foreground text-sm text-justify">{$t('tutorial.sec1.content')}</p>
					</div>
				</div>
				{#if isMobile}
					<div class="flex items-start gap-4">
						<MdiNfc class="h-9 w-9 shrink-0 text-primary" />
						<div>
							<h3 class="font-semibold">{$t('tutorial.scan.nfc_title')}</h3>
							<p class="text-muted-foreground text-sm text-justify">
								{$t('tutorial.sec1_mobile.content')}
							</p>
							<p class="text-muted-foreground mt-1 text-xs italic text-justify">
								{$t('tutorial.sec6_mobile.content')}
							</p>
						</div>
					</div>
				{/if}
			</Card.Content>
		{:else}
			<Card.Header>
				<Card.Title>{$t('tutorial.quiz.heading')}</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="flex items-start gap-4">
					<OcticonQuestion16 class="h-9 w-9 shrink-0 text-primary" />
					<p class="text-muted-foreground text-sm text-justify">{$t('tutorial.sec4.content')}</p>
				</div>
				<div class="flex items-center justify-center gap-3">
					<OcticonTrophy16 class="text-primary h-6 w-6" />
					<div class="flex gap-2 font-semibold">
						<span>10</span><span>·</span><span>20</span><span>·</span><span>30</span><span>·</span
						><span>40</span>
					</div>
				</div>
			</Card.Content>
		{/if}

		<Card.Footer class="justify-end">
			<Button variant="default" onclick={next}>
				{$t('tutorial.next')}<OcticonArrowRight16 class="ml-1" />
			</Button>
		</Card.Footer>
	</Card.Root>
	<PageIndicator totalPages={4} currentPage={1 + step} />
</div>
