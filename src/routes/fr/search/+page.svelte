<script lang="ts">
    // import Button from '$lib/components/ui/button/button.svelte';
    // import { t } from '$lib/translations/translations';

    // let successModal = $state(false);
    // let failModal = $state(false);
    let geoFailModal = $state(false);
    let loading = $state(false);
    let positionglob = $state();

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
                    if (error.code === error.PERMISSION_DENIED)
                        geoFailModal = true;
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000, // TODO : handle error if timeout
                    maximumAge: 0,
                },
            );
        });
    }
</script>

<main class="container">
    <div>
        <h1>Bonjour</h1>
    </div>
    <button onclick={getCurrentLocation}>Recherche</button>
    <div>
        {#if positionglob}
            <p>Latitude: {positionglob.coords.latitude}</p>
            <p>Longitude: {positionglob.coords.longitude}</p>
            <p>Accuracy: {positionglob.coords.accuracy}</p>
        {/if}
    </div>
</main>
