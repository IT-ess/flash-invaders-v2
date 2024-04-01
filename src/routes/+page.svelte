<script lang="ts">
	import Greet from '$lib/components/Greet.svelte';
	import { t } from '$lib/translations/translations';
</script>

<main class="container">
	<h1>Welcome to Tauri!</h1>

	<div class="row bg-red-700">
		<a href="https://vitejs.dev" target="_blank">
			<img src="/vite.svg" class="logo vite" alt="Vite Logo" />
		</a>
		<a href="https://tauri.app" target="_blank">
			<img src="/tauri.svg" class="logo tauri" alt="Tauri Logo" />
		</a>
		<a href="https://svelte.dev" target="_blank">
			<img src="/svelte.svg" class="logo svelte" alt="Svelte Logo" />
		</a>
	</div>

	<p>Click on the Tauri, Vite, and Svelte logos to learn more.</p>
	<p>Bonjour : {$t('common.nav.gallery')}</p>

	<div class="row">
		<Greet />
	</div>
</main>

<!-- <style lang="postcss">
  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style> -->
