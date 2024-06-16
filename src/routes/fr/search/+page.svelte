<script lang="ts">
	import { INVADERS, type Invader } from '$lib/invaders/invaders';
	// import Button from '$lib/components/ui/button/button.svelte';
	// import { t } from '$lib/translations/translations';
	import { insideCircle, type LatitudeLongitude } from 'geolocation-utils';

	// let successModal = $state(false);
	// let failModal = $state(false);
	let geoFailModal = $state(false);
	let loading = $state(false);
	let positionglob = $state();
	let localInvader: Invader = $state({ id: 0, name: '', latitude: 0, longitude: 0, imageUrl: '' });
	let foundInvader: Boolean = $state(false);

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
		}

		// TODO : if length > 1, filter out those already found ==> Or manage multiple invaders ?
	}

	const matchLocalInvaders = (invader: Invader, userGeoLocation: LatitudeLongitude): Boolean =>
		insideCircle(userGeoLocation, invader, 1000);
</script>

<main class="container">
	<div>
		<h1>Bonjour</h1>
	</div>
	<button onclick={getInvadersWithinRadius}>Recherche</button>
	<div>
		{#if positionglob}
			<p>Latitude: {positionglob.coords.latitude}</p>
			<p>Longitude: {positionglob.coords.longitude}</p>
			<p>Accuracy: {positionglob.coords.accuracy}</p>
		{/if}
	</div>
	<div>
		{#if foundInvader}
			<p>Coucou</p>
			<p>Latitude: {localInvader.latitude}</p>
			<p>Longitude: {localInvader.longitude}</p>
		{/if}
		{foundInvader}
	</div>
</main>
