<script lang="ts">
	import type { PageData } from './$types';
	import { Spinner } from 'flowbite-svelte';
	import { t } from '$lib/translations/translations';
	import Button from '$lib/components/ui/button/button.svelte';
	import { INVADERS, type Invader } from '$lib/game-data/invaders';
	import { PUBLIC_SEARCH_RADIUS } from '$env/static/public';
	import * as Dialog from '$lib/components/ui/dialog';
	import { supabase } from '$lib/supabase-client';
	import { insideCircle, type LatitudeLongitude } from 'geolocation-utils';
	import { goto } from '$app/navigation';
	import OcticonRadioTower from '~icons/octicon/radio-tower';
	import OcticonAlert from '~icons/octicon/alert';
	import LogosGoogleMaps from '~icons/logos/google-maps';
	import type { ProfileRow } from '$lib/supabase-client';
	import { Progress } from '$lib/components/ui/progress';

	let successModal = $state(false);
	let foundId: number | undefined = $state();
	let failModal = $state(false);
	let geoFailModal = $state(false);
	let loading = $state(false);
	let foundInvader: Invader | undefined = $state();
	let accuracy = $state(40);
	let localInvader: Invader | null = $state(null);

	let { data }: { data: PageData } = $props();

	let { score, invaderCount } = data;
	let displayedScore = $state(0);
	let displayedInvaderCount = $state(0);

	$effect(() => {
		const timer = setTimeout(() => {
			displayedScore = score;
			displayedInvaderCount = invaderCount;
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
					timeout: 15000, // TODO : handle error if timeout
					maximumAge: 0
				}
			);
		});
	}
	async function getInvadersWithinRadius(): Promise<void> {
		loading = true;
		const { coords } = await getCurrentLocation();
		accuracy = coords.accuracy;
		const foundInvaders = INVADERS.filter((invader) =>
			matchLocalInvaders(invader, {
				latitude: coords.latitude,
				longitude: coords.longitude
			})
		);
		const newlyFoundInvaders = foundInvaders.filter((invader) => {
			const invaderPrivilegeForId = data.profile[`inv${invader.id}` as keyof ProfileRow] as number;
			if (invaderPrivilegeForId === 0) {
				return true;
			} else {
				return false;
			}
		});

		if (newlyFoundInvaders.length > 0) {
			localInvader = newlyFoundInvaders[0];
			const { id } = localInvader;
			foundInvader = localInvader;

			const { error } = await supabase.rpc('update_user_permissions_and_score', {
				invader_id: id,
				user_id_input: data.userId,
				permission_level: 1,
				incremented_score: 0
			});
			if (error) {
				console.error('Error updating user profile', error);
			}
			foundId = id;
			successModal = true;
		} else {
			failModal = true;
		}

		loading = false;

		// TODO : if length > 1, filter out those already found ==> Or manage multiple invaders ?
	}

	const matchLocalInvaders = (invader: Invader, userGeoLocation: LatitudeLongitude): Boolean =>
		insideCircle(userGeoLocation, invader, +PUBLIC_SEARCH_RADIUS);
</script>

<div class="container my-8">
	<main>
		<Dialog.Root bind:open={successModal} closeOnOutsideClick={false}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>{$t('home.success_modal.message')}</Dialog.Title>
					<Dialog.Description>
						<span>{$t(`common.zwt${foundInvader?.id}.name`)}</span>
						<img src={foundInvader?.imageUrl} alt={foundInvader?.name} />
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button variant="secondary" type="submit" onclick={() => goto(`./invader/${foundId}`)}
						>{$t(`home.success_modal.button`)}</Button
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		<Dialog.Root bind:open={failModal}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>{$t('home.fail_modal.title')}</Dialog.Title>
					<Dialog.Description>
						<div class="text-center">
							<OcticonAlert class="text-destructive h-12 w-12 text-center" />
							<h4 class="mb-5 text-lg font-normal text-white dark:text-gray-400">
								{$t('home.fail_modal.message')}
							</h4>
							{#if accuracy >= 40}
								<h4 class="mb-5 text-lg font-normal text-red-500 dark:text-gray-400">
									{$t('home.fail_modal.bad_accuracy')}
								</h4>
							{:else if accuracy < 40 && accuracy >= 20}
								<h4 class="mb-5 text-lg font-normal text-orange-400 dark:text-gray-400">
									{$t('home.fail_modal.medium_accuracy')}
								</h4>
							{:else if accuracy < 20}
								<h4 class="mb-5 text-lg font-normal text-green-600 dark:text-gray-400">
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
			<Dialog.Content>
				<Dialog.Title>{$t('home.geo_fail_modal.title')}</Dialog.Title>
				<Dialog.Description>
					<div class="text-center">
						<div class="mx-auto mb-4 w-14 h-14 text-white dark:text-gray-200">
							<OcticonRadioTower />
						</div>
						<h2 class="mb-5 text-lg font-normal text-white dark:text-gray-400">
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

		<div class="flex flex-grow bg-gray-200 items-center justify-evenly w-full">
			<div class="m-auto mt-14">
				<div class="box-content h-44 w-44 p-4">
					{#if loading}
						<Spinner color="yellow" size="40" />
					{:else}
						<span class="relative flex h-full w-full">
							<OcticonRadioTower />
							<span
								class="animate-[ping_3s_infinite] absolute inline-flex h-full w-full rounded-full bg-bluejum-lighter opacity-25"
							></span>
						</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="p-4 w-full h-24 flex justify-center items-center space-x-4">
			<Button variant="default" size="lg" onclick={getInvadersWithinRadius}
				>{$t('home.button.scan')}</Button
			>
			<Button
				variant="secondary"
				size="lg"
				href="https://www.google.com/maps/d/viewer?mid=1qDy-Qcv9ScGx97vlB1Wy_9tvOIumt0I"
				>Maps<LogosGoogleMaps class="ml-1 mb-[4px]" /></Button
			>
		</div>
		<div class="space-y-4">
			<div>
				<p class="flex justify-between"><span>Score</span><span>{score}/1200</span></p>
				<Progress value={displayedScore} max={1200} />
			</div>
			<div>
				<p class="flex justify-between">
					<span>{$t('home.invaders_found')}</span><span>{invaderCount}/12</span>
				</p>
				<Progress value={displayedInvaderCount} max={12} barBgClass="bg-secondary" />
			</div>
		</div>
	</main>
</div>
