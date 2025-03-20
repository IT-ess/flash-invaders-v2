<script lang="ts">
	import DoubleBounce from '$lib/components/spinners/DoubleBounce.svelte';
	import MdiSpaceInvaders from '~icons/mdi/space-invaders';

	let { handleOnClick, loading = $bindable() }: { handleOnClick: () => void; loading: boolean } =
		$props();
</script>

<button
	class="relative w-48 h-48 rounded-full bg-primary text-white flex items-center justify-center focus:outline-none"
	onclick={handleOnClick}
	disabled={loading}
>
	{#if loading}
		<div class="absolute">
			<DoubleBounce color="#2585ce" size="16" unit="rem" duration="3s" pause={false} />
		</div>
	{/if}
	<div class={loading ? 'animate-[pulse_3s_infinite]' : ''}>
		<MdiSpaceInvaders class="w-28 h-28" />
	</div>
	{#if !loading}
		<span
			class="animate-[ping_3s_infinite] absolute inline-flex h-full w-full rounded-full bg-primary opacity-10"
		></span>
	{/if}
</button>
