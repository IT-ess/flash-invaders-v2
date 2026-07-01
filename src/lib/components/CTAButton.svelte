<script lang="ts">
	import DoubleBounce from '$lib/components/spinners/DoubleBounce.svelte';
	import MdiSpaceInvaders from '~icons/mdi/space-invaders';
	import MdiGestureTap from '~icons/mdi/gesture-tap';

	let {
		handleOnClick,
		loading = $bindable(),
		label,
		scanningLabel,
		hint
	}: {
		handleOnClick: () => void;
		loading: boolean;
		label: string;
		scanningLabel: string;
		hint: string;
	} = $props();
</script>

<div class="flex flex-col items-center gap-5">
	<button
		class="relative w-48 h-48 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-transform active:scale-95 focus:outline-none disabled:active:scale-100"
		onclick={handleOnClick}
		disabled={loading}
	>
		{#if loading}
			<div class="absolute">
				<DoubleBounce color="#2585ce" size="16" unit="rem" duration="3s" pause={false} />
			</div>
		{:else}
			<!-- Expanding rings draw the eye to the button. -->
			<span
				class="animate-[ping_2.5s_ease-out_infinite] absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"
			></span>
			<span
				class="animate-[ping_2.5s_ease-out_infinite] [animation-delay:1.25s] absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"
			></span>
		{/if}
		<div class={loading ? 'animate-[pulse_3s_infinite]' : 'animate-pulse'}>
			<MdiSpaceInvaders class="w-28 h-28" />
		</div>
	</button>

	<span class="text-primary text-xl font-bold tracking-wide">
		{loading ? scanningLabel : label}
	</span>

	{#if !loading}
		<span class="text-muted-foreground flex items-center gap-1.5 text-sm">
			<MdiGestureTap class="w-5 h-5" />
			{hint}
		</span>
	{/if}
</div>
