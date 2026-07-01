<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/translations/translations';
	import Button from '$lib/components/ui/button/button.svelte';
	import { INVADERS_STARTING_INDEX, type Invader } from '$lib/game-data/invaders';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto, preloadData } from '$app/navigation';
	import OcticonAlert from '~icons/octicon/alert';
	import OcticonLocation from '~icons/octicon/location-16';
	import MdiNfc from '~icons/mdi/nfc';
	import LogosGoogleMaps from '~icons/logos/google-maps';
	import { Progress } from '$lib/components/ui/progress';
	import { page } from '$app/state';
	import type { InvaderPrivileges } from '$lib/utils/invader-counter';
	import CtaButton from '$lib/components/CTAButton.svelte';
	import {
		getInvaderFromTagContent,
		getInvadersFromCoords,
		updateUserPrivileges
	} from '$lib/invader-utils';
	import { openUrl } from '@tauri-apps/plugin-opener';
	import { readNfcTag } from '$lib/nfc-utils';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { isAvailable } from '@tauri-apps/plugin-nfc';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';

	type SearchMethod = 'gps' | 'nfc';
	type SearchResult = { invader: Invader; method: SearchMethod; isNew: boolean };

	let successModal = $state(false);
	let failModal = $state(false);
	let loading = $state(false);
	let foundInvader: Invader | null = $state(null);
	let foundMethod: SearchMethod | null = $state(null);
	let foundIsNew = $state(true);
	let accuracy = $state(40);

	let { data }: { data: PageData } = $props();

	let { lang } = page.params;

	let { score, invaderCount } = $derived(data);
	let displayedScore = $state(0);
	let displayedInvaderCount = $state(0);

	$effect(() => {
		const timer = setTimeout(() => {
			displayedScore = score;
			invaderCount.then((count) => (displayedInvaderCount = count));
			preloadData(`/${lang}/ranking`);
		}, 500);
		return () => clearTimeout(timer);
	});

	function getCurrentLocation(): Promise<GeolocationPosition> {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject, {
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0
			});
		});
	}

	function isNewlyFound(invaderId: number): boolean {
		return (data.privileges[`inv${invaderId}` as keyof InvaderPrivileges] as number) === 0;
	}

	// Match by GPS proximity. Any failure (incl. denied permission) resolves to
	// null. Runs in parallel with the NFC scan.
	async function findInvaderByGps(): Promise<SearchResult | null> {
		try {
			const { coords } = await getCurrentLocation();
			accuracy = coords.accuracy;
			// Prefer a not-yet-found invader, but still report one already collected so
			// the caller can show the success dialog again.
			const matches = getInvadersFromCoords(coords);
			const invader = matches.find((invader) => isNewlyFound(invader.id)) ?? matches[0];
			return invader ? { invader, method: 'gps', isNew: isNewlyFound(invader.id) } : null;
		} catch {
			return null;
		}
	}

	// Scan an NFC tag. Returns null when NFC is unavailable, times out, or the tag
	// doesn't match a known invader. Runs in parallel with the GPS lookup.
	async function findInvaderByNfc(): Promise<SearchResult | null> {
		if (!(await isAvailable())) {
			return null;
		}
		toast.info($t('home.nfc_help_text'));
		try {
			const tagContent = await readNfcTag(10000);
			if (!tagContent) {
				return null;
			}
			const invader = getInvaderFromTagContent(tagContent);
			return invader ? { invader, method: 'nfc', isNew: isNewlyFound(invader.id) } : null;
		} finally {
			toast.dismiss();
		}
	}

	// Resolve to the first truthy result, or null once every method resolved null.
	// Plain Promise.race won't do: a fast null (e.g. NFC unavailable) would win and
	// discard a still-pending success from the other method.
	function firstResult(promises: Promise<SearchResult | null>[]): Promise<SearchResult | null> {
		return new Promise((resolve) => {
			let pending = promises.length;
			for (const promise of promises) {
				promise
					.then((result) => {
						if (result) resolve(result);
						else if (--pending === 0) resolve(null);
					})
					.catch(() => {
						if (--pending === 0) resolve(null);
					});
			}
		});
	}

	async function handleSearch() {
		loading = true;
		try {
			// Check GPS and NFC in parallel; keep whichever finds an invader first.
			const result = await firstResult([findInvaderByGps(), findInvaderByNfc()]);
			foundInvader = result?.invader ?? null;
			foundMethod = result?.method ?? null;
			foundIsNew = result?.isNew ?? true;
			if (foundInvader) {
				// Only grant privileges/score the first time it's discovered.
				if (foundIsNew) {
					await updateUserPrivileges(foundInvader.id, data.userId);
				}
				successModal = true;
			} else {
				failModal = true;
			}
		} finally {
			loading = false;
		}
	}
</script>

<Toaster richColors position="top-center" duration={9000} />

<main class="px-safe-offset-4">
	<Dialog.Root bind:open={successModal}>
		<Dialog.Content class="max-w-[80%] rounded-md">
			<Dialog.Header>
				<Dialog.Title
					>{foundIsNew
						? $t('home.success_modal.message')
						: $t('home.success_modal.already_found_message')}</Dialog.Title
				>
				<Dialog.Description>
					<span>{$t(`common.zwt${foundInvader?.id}.name`)}</span>
					{#if foundMethod === 'gps'}
						<span class="text-muted-foreground my-1 flex items-center gap-1 text-sm">
							<OcticonLocation />
							{$t('home.success_modal.found_by_gps')}
						</span>
					{:else if foundMethod === 'nfc'}
						<span class="text-muted-foreground my-1 flex items-center gap-1 text-sm">
							<MdiNfc />
							{$t('home.success_modal.found_by_nfc')}
						</span>
					{/if}
					<AspectRatio ratio={16 / 9} class="bg-muted">
						<img src={foundInvader?.imageUrl} alt={foundInvader?.name} />
					</AspectRatio>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button
					variant="secondary"
					type="submit"
					onclick={() => goto(`./invader/${foundInvader?.id}`)}
					>{$t(`home.success_modal.button`)}</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<Dialog.Root bind:open={failModal}>
		<Dialog.Content class="max-w-[80%] rounded-md">
			<Dialog.Header>
				<Dialog.Title>{$t('home.fail_modal.title')}</Dialog.Title>
				<Dialog.Description>
					<div class="text-center">
						<OcticonAlert class="text-destructive h-12 w-12 mx-auto" />
						<br />
						<h4 class="mb-5 text-lg font-normal text-foreground dark:text-gray-400">
							{$t('home.fail_modal.message')}
						</h4>
						{#if accuracy >= 40}
							<h4 class="mb-5 text-lg font-semibold text-red-500 dark:text-gray-400">
								{$t('home.fail_modal.bad_accuracy')}
							</h4>
						{:else if accuracy < 40 && accuracy >= 20}
							<h4 class="mb-5 text-lg font-semibold text-orange-400 dark:text-gray-400">
								{$t('home.fail_modal.medium_accuracy')}
							</h4>
						{:else if accuracy < 20}
							<h4 class="mb-5 text-lg font-semibold text-green-600 dark:text-gray-400">
								{$t('home.fail_modal.good_accuracy')}
							</h4>
						{/if}
					</div>
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button variant="destructive" onclick={() => (failModal = false)}
					>{$t('home.fail_modal.button')}</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<div class="flex grow items-center justify-evenly w-full">
		<div class="box-content h-56 w-56 p-6">
			<span class="relative flex h-full w-full justify-center">
				<CtaButton handleOnClick={handleSearch} bind:loading />
			</span>
		</div>
	</div>

	<div class="space-y-4">
		<div>
			<p class="flex justify-between">
				<span>Score</span><span>{score}/{1200 - INVADERS_STARTING_INDEX * 100}</span>
			</p>
			<Progress
				value={displayedScore}
				max={1200 - INVADERS_STARTING_INDEX * 100}
				class="bg-slate-300"
			/>
		</div>
		<div>
			<p class="flex justify-between">
				<span>{$t('home.invaders_found')}</span><span
					>{displayedInvaderCount}/{12 - INVADERS_STARTING_INDEX}</span
				>
			</p>
			<Progress
				value={displayedInvaderCount}
				max={12 - INVADERS_STARTING_INDEX}
				class="bg-slate-300"
			/>
		</div>
	</div>
	<div class="p-4 w-full flex justify-center items-center space-x-4 mt-12">
		<Button
			class="w-screen"
			variant="secondary"
			size="lg"
			onclick={() =>
				openUrl('https://www.google.com/maps/d/viewer?mid=1qDy-Qcv9ScGx97vlB1Wy_9tvOIumt0I')}
			>Maps<LogosGoogleMaps class="ml-1 mb-1" /></Button
		>
	</div>
</main>
