<script lang="ts">
	let { lang }: { lang: string } = $props();
</script>

{#if lang === 'fr'}
	<div class="text-center">
		<h1 class="text-6xl font-extrabold mt-4 font-pixelify">
			<span class="text-[#0074cd]">zwi</span><span class="text-white">et</span><span
				class="text-[#ff473d]">ess</span
			>
		</h1>
	</div>
{:else}
	<div class="text-center">
		<h1 class="text-6xl font-extrabold mt-4 font-pixelify">
			<span class="text-black text-stroke">zwi</span><span class="text-[#ff473d]">ete</span><span
				class="text-[#FFCC00]">ss</span
			>
		</h1>
	</div>
{/if}

<style>
	.text-stroke {
		-webkit-text-stroke: 1px white;
	}
</style>
