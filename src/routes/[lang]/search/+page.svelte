<script lang="ts">
	import { INVADERS, type Invader } from '$lib/game-data/invaders';
	import { PUBLIC_SEARCH_RADIUS } from '$env/static/public';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { supabase } from '$lib/supabase-client';
	import { t } from '$lib/translations/translations';
	import { insideCircle, type LatitudeLongitude } from 'geolocation-utils';
	import { sessionState } from '$lib/session-state.svelte.ts';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import OcticonRadioTower from '~icons/octicon/radio-tower';
	import { page } from '$app/stores';

	let successModal = $state(false);
	let foundId: number | undefined = $state();
	let failModal = $state(false);
	let geoFailModal = $state(false);
	let loading = $state(false);
	let foundInvader: Invader | undefined = $state();
	let accuracy = $state(40);
	let positionglob: GeolocationPosition | undefined = $state();
	let localInvader: Invader | null = $state(null);
	let pageLang = $page.params.lang;

	const session = sessionState.getSession;
	if (session === null) {
		redirect(302, '/auth');
	}
	const { user } = session;

	function getCurrentLocation(): Promise<GeolocationPosition> {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				(position: GeolocationPosition) => {
					positionglob = position;
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

		if (foundInvaders.length > 0) {
			localInvader = foundInvaders[0];
			const { id } = localInvader;
			foundInvader = localInvader;

			const { error } = await supabase.rpc('update_user_permissions_and_score', {
				invader_id: id,
				user_id_input: user.id,
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

<main>
	<div class="flex flex-grow bg-gray-200 items-center justify-evenly w-full">
		<div class="m-auto mt-14">
			<div class="box-content h-44 w-44 p-4">
				{#if loading}
					<!-- <Spinner color="yellow" size="40" /> -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="animate-spin"
					>
						<path d="M21 12a9 9 0 1 1-6.219-8.56" />
					</svg>
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

	<div class="p-4 w-full h-24 flex justify-center items-center">
		<button onclick={getInvadersWithinRadius}>Recherche</button>
	</div>

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
				<Button
					variant="secondary"
					type="submit"
					onclick={() => goto(`${pageLang}/invaders/${foundId}`)}
					>{$t(`home.success_modal.button`)}</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<Dialog.Root bind:open={failModal}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Fail modal [titre à trouver]</Dialog.Title>
				<Dialog.Description>
					<div class="text-center">
						<svg
							aria-hidden="true"
							class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
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
			<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
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
	<div>
		{#if positionglob}
			<p>Latitude: {positionglob.coords.latitude}</p>
			<p>Longitude: {positionglob.coords.longitude}</p>
			<p>Accuracy: {positionglob.coords.accuracy}</p>
		{/if}
	</div>
	<div>
		{#if localInvader}
			<p>Coucou</p>
			<p>Latitude: {localInvader.latitude}</p>
			<p>Longitude: {localInvader.longitude}</p>
		{/if}
		{foundInvader}
	</div>
</main>
