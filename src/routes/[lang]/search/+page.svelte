<script lang="ts">
	import { INVADERS, type Invader } from '$lib/game-data/invaders';
	import { PUBLIC_SEARCH_RADIUS } from '$env/static/public';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { supabase } from '$lib/supabase-client';
	// import { t } from '$lib/translations/translations';
	import { insideCircle, type LatitudeLongitude } from 'geolocation-utils';
	import { sessionState } from '$lib/session-state.svelte.ts';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	let successModal = $state(false);
	let foundId: number | undefined = $state();
	// let failModal = $state(false);
	let geoFailModal = $state(false);
	let loading = $state(false);
	let positionglob: GeolocationPosition | undefined = $state();
	let localInvader: Invader | null = $state(null);
	let foundInvader: Boolean = $state(false);

	const session = sessionState.getSession;
	if (session === null) {
		redirect(302, '/auth');
	}
	const { user } = session;

	function getCurrentLocation(): Promise<GeolocationPosition> {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				(position: GeolocationPosition) => {
					console.log(position);
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
		const { coords } = await getCurrentLocation();
		const foundInvaders = INVADERS.filter((invader) =>
			matchLocalInvaders(invader, {
				latitude: coords.latitude,
				longitude: coords.longitude
			})
		);

		if (foundInvaders.length > 0) {
			foundInvader = true;
			localInvader = foundInvaders[0];
			const { id } = localInvader;

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
		}

		successModal = true;

		// TODO : if length > 1, filter out those already found ==> Or manage multiple invaders ?
	}

	const matchLocalInvaders = (invader: Invader, userGeoLocation: LatitudeLongitude): Boolean =>
		insideCircle(userGeoLocation, invader, +PUBLIC_SEARCH_RADIUS);
</script>

<main class="container">
	<div>
		<h1>Bonjour</h1>
	</div>
	<button onclick={getInvadersWithinRadius}>Recherche</button>
	<Dialog.Root bind:open={successModal} closeOnOutsideClick={false}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
				<Dialog.Description>
					This action cannot be undone. This will permanently delete your account and remove your
					data from our servers.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button type="submit" onclick={() => goto(`/invaders/${foundId}`)}>Save changes</Button>
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
