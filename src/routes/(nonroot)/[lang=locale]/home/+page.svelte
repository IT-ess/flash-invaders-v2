<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/translations/translations';
	import Button from '$lib/components/ui/button/button.svelte';
	import { INVADERS_STARTING_INDEX, type Invader } from '$lib/game-data/invaders';
	import { PUBLIC_PLATFORM } from '$env/static/public';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto, preloadData } from '$app/navigation';
	import OcticonRadioTower from '~icons/octicon/radio-tower';
	import OcticonAlert from '~icons/octicon/alert';
	import LogosGoogleMaps from '~icons/logos/google-maps';
	import MdiNfc from '~icons/mdi/nfc';
	import { Progress } from '$lib/components/ui/progress';
	import { page } from '$app/stores';
	import type { InvaderPrivileges } from '$lib/utils/invader-counter';
	import CtaButton from '$lib/components/CTAButton.svelte';
	import {
		getInvaderFromTagContent,
		getInvadersFromCoords,
		updateUserPrivileges
	} from '$lib/invader-utils';
	import { readNfcTag } from '$lib/nfc-utils';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { isAvailable } from '@tauri-apps/plugin-nfc';

	let successModal = $state(false);
	let failModal = $state(false);
	let geoFailModal = $state(false);
	let nfcFailModal = $state(false);
	let nfcTimeoutModal = $state(false);
	let nfcNotAvailableModal = $state(false);
	let loading = $state(false);
	let foundInvader: Invader | null = $state(null);
	let accuracy = $state(40);

	let { data }: { data: PageData } = $props();

	let { lang } = $page.params;

	let { score, invaderCount } = data;
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
			navigator.geolocation.getCurrentPosition(
				(position: GeolocationPosition) => {
					resolve(position);
				},
				(error: GeolocationPositionError) => {
					loading = false;
					if (error.code === error.PERMISSION_DENIED) geoFailModal = true;
					reject(error);
				},
				{
					enableHighAccuracy: true,
					timeout: 15000,
					maximumAge: 0
				}
			);
		});
	}

	async function scanInvaderWithNfc() {
		loading = true;
		const isNfcAvailable = await isAvailable();
		if (!isNfcAvailable) {
			loading = false;
			nfcNotAvailableModal = true;
			return;
		}
		toast.info($t('home.nfc_help_text'));
		const tagContent = await readNfcTag(10000);
		if (tagContent === null) {
			toast.dismiss();
			loading = false;
			nfcTimeoutModal = true;
			return;
		}
		if (!tagContent.match('zwietess://')) {
			toast.dismiss();
			nfcFailModal = true;
			return;
		}
		foundInvader = getInvaderFromTagContent(tagContent);
		if (!foundInvader) {
			toast.dismiss();
			nfcFailModal = true;
			return;
		}
		toast.dismiss();
		const invaderPrivilegeForId = data.privileges[
			`inv${foundInvader.id}` as keyof InvaderPrivileges
		] as number;
		if (invaderPrivilegeForId === 0) {
			await updateUserPrivileges(foundInvader.id, data.userId);
		}
		successModal = true;
		loading = false;
	}

	async function searchInvadersWithGeolocation(): Promise<void> {
		loading = true;
		const { coords } = await getCurrentLocation();
		accuracy = coords.accuracy;

		const foundInvaders = getInvadersFromCoords(coords);
		const newlyFoundInvaders = foundInvaders.filter((invader) => {
			const invaderPrivilegeForId = data.privileges[
				`inv${invader.id}` as keyof InvaderPrivileges
			] as number;
			if (invaderPrivilegeForId === 0) {
				return true;
			} else {
				return false;
			}
		});

		if (newlyFoundInvaders.length > 0) {
			foundInvader = newlyFoundInvaders[0];
			await updateUserPrivileges(foundInvader.id, data.userId);
			successModal = true;
		} else {
			failModal = true;
		}
		loading = false;
	}

	async function handleSearch() {
		if (PUBLIC_PLATFORM === 'mobile') {
			await scanInvaderWithNfc();
		} else {
			await searchInvadersWithGeolocation();
		}
	}
</script>

<Toaster richColors position="top-center" duration={9000} />

<div class="container my-8">
	<main>
		<Dialog.Root bind:open={successModal} closeOnOutsideClick={false}>
			<Dialog.Content class="max-w-[80%] rounded-md">
				<Dialog.Header>
					<Dialog.Title>{$t('home.success_modal.message')}</Dialog.Title>
					<Dialog.Description>
						<span>{$t(`common.zwt${foundInvader?.id}.name`)}</span>
						<img src={foundInvader?.imageUrl} alt={foundInvader?.name} />
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
		<Dialog.Root bind:open={geoFailModal}>
			<Dialog.Content class="max-w-[80%] rounded-md">
				<Dialog.Title>{$t('home.geo_fail_modal.title')}</Dialog.Title>
				<Dialog.Description>
					<div class="text-center">
						<OcticonRadioTower class="mx-auto mb-4 w-12 h-12 text-destructive dark:text-gray-200" />
						<h2 class="mb-5 text-lg font-semibold text-destructive dark:text-gray-400">
							{$t('home.geo_fail_modal.message')}
						</h2>
					</div>
				</Dialog.Description>
				<Dialog.Footer>
					<Button variant="destructive" onclick={() => (geoFailModal = false)}
						>{$t('home.fail_modal.button')}</Button
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		<Dialog.Root bind:open={nfcNotAvailableModal}>
			<Dialog.Content class="max-w-[80%] rounded-md">
				<Dialog.Title>{$t('home.nfc_unavailable_modal.title')}</Dialog.Title>
				<Dialog.Description>
					<div class="text-center">
						<MdiNfc class="mx-auto mb-4 w-12 h-12 text-destructive dark:text-gray-200" />
						<h2 class="mb-5 text-lg font-semibold text-destructive dark:text-gray-400">
							{$t('home.nfc_unavailable_modal.message')}
						</h2>
					</div>
				</Dialog.Description>
				<Dialog.Footer>
					<Button variant="destructive" onclick={() => (nfcNotAvailableModal = false)}
						>{$t('home.fail_modal.button')}</Button
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		<Dialog.Root bind:open={nfcFailModal}>
			<Dialog.Content class="max-w-[80%] rounded-md">
				<Dialog.Title>{$t('home.nfc_fail_modal.title')}</Dialog.Title>
				<Dialog.Description>
					<div class="text-center">
						<MdiNfc class="mx-auto mb-4 w-12 h-12 text-destructive dark:text-gray-200" />
						<h2 class="mb-5 text-lg font-semibold text-destructive dark:text-gray-400">
							{$t('home.nfc_fail_modal.message')}
						</h2>
					</div>
				</Dialog.Description>
				<Dialog.Footer>
					<Button variant="destructive" onclick={() => (nfcFailModal = false)}
						>{$t('home.fail_modal.button')}</Button
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		<Dialog.Root bind:open={nfcTimeoutModal}>
			<Dialog.Content class="max-w-[80%] rounded-md">
				<Dialog.Title>{$t('home.nfc_timeout_modal.title')}</Dialog.Title>
				<Dialog.Description>
					<div class="text-center">
						<MdiNfc class="mx-auto mb-4 w-12 h-12 text-destructive dark:text-gray-200" />
						<h2 class="mb-5 text-lg font-semibold text-destructive dark:text-gray-400">
							{$t('home.nfc_timeout_modal.message')}
						</h2>
					</div>
				</Dialog.Description>
				<Dialog.Footer>
					<Button variant="destructive" onclick={() => (nfcTimeoutModal = false)}
						>{$t('home.fail_modal.button')}</Button
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		<div class="flex flex-grow items-center justify-evenly w-full">
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
				<Progress value={displayedScore} max={1200 - INVADERS_STARTING_INDEX * 100} />
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
					barBgClass="bg-secondary"
				/>
			</div>
		</div>
		<div class="p-4 w-full flex justify-center items-center space-x-4 mt-12">
			<Button
				class="w-screen"
				variant="secondary"
				size="lg"
				href="https://www.google.com/maps/d/viewer?mid=1qDy-Qcv9ScGx97vlB1Wy_9tvOIumt0I"
				>Maps<LogosGoogleMaps class="ml-1 mb-[4px]" /></Button
			>
		</div>
	</main>
</div>
