<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/translations/translations';
	import Button from '$lib/components/ui/button/button.svelte';
	import { INVADERS_STARTING_INDEX, type Invader } from '$lib/game-data/invaders';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto, preloadData } from '$app/navigation';
	import OcticonAlert from '~icons/octicon/alert';
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

	let successModal = $state(false);
	let failModal = $state(false);
	let loading = $state(false);
	let foundInvader: Invader | null = $state(null);
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
				timeout: 15000,
				maximumAge: 0
			});
		});
	}

	function isNewlyFound(invaderId: number): boolean {
		return (data.privileges[`inv${invaderId}` as keyof InvaderPrivileges] as number) === 0;
	}

	// Match by GPS proximity. Any failure (incl. denied permission) resolves to
	// null so the caller can fall back to NFC.
	async function findInvaderByGps(): Promise<Invader | null> {
		try {
			const { coords } = await getCurrentLocation();
			accuracy = coords.accuracy;
			return getInvadersFromCoords(coords).find((invader) => isNewlyFound(invader.id)) ?? null;
		} catch {
			return null;
		}
	}

	// Fallback to scanning an NFC tag. Returns null when NFC is unavailable, times
	// out, or the tag doesn't match a known invader.
	async function findInvaderByNfc(): Promise<Invader | null> {
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
			return invader && isNewlyFound(invader.id) ? invader : null;
		} finally {
			toast.dismiss();
		}
	}

	async function handleSearch() {
		loading = true;
		try {
			// Try GPS first; fall back to an NFC scan only if it finds nothing.
			foundInvader = (await findInvaderByGps()) ?? (await findInvaderByNfc());
			if (foundInvader) {
				await updateUserPrivileges(foundInvader.id, data.userId);
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
				<Dialog.Title>{$t('home.success_modal.message')}</Dialog.Title>
				<Dialog.Description>
					<span>{$t(`common.zwt${foundInvader?.id}.name`)}</span>
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
