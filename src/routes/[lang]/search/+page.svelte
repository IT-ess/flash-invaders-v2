<script lang="ts">
	import { INVADERS, type Invader } from '$lib/game-data/invaders';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { supabase } from '$lib/supabase-client';
	// import Button from '$lib/components/ui/button/button.svelte';
	// import { t } from '$lib/translations/translations';
	import { insideCircle, type LatitudeLongitude } from 'geolocation-utils';
	import { getSessionState } from '$lib/session-state.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	let successModal = $state(false);
	// let failModal = $state(false);
	let geoFailModal = $state(false);
	let loading = $state(false);
	let positionglob = $state();
	let localInvader: Invader | null = $state(null);
	let foundInvader: Boolean = $state(false);

	const session = getSessionState().getSession;
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

			// const { error } = await supabase.from('profiles').update({ inv1: 1 }).eq('id', user.id);
			const { error } = await supabase.rpc('update_invader_permission', {
				invader_id: id,
				user_id_input: user.id,
				permission_level: 1
			});
			if (error) {
				console.error('Error updating user profile', error);
			}
		}

		successModal = true;

		// TODO : if length > 1, filter out those already found ==> Or manage multiple invaders ?
	}

	const matchLocalInvaders = (invader: Invader, userGeoLocation: LatitudeLongitude): Boolean =>
		insideCircle(userGeoLocation, invader, 1000000000);
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
				<Button type="submit" onclick={() => goto('/invaders/1')}>Save changes</Button>
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
