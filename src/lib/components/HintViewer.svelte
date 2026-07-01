<script lang="ts">
	import { fade } from 'svelte/transition';
	import LucideX from '~icons/lucide/x';

	let {
		open = $bindable(false),
		src = '',
		alt = '',
		help = ''
	}: { open?: boolean; src?: string; alt?: string; help?: string } = $props();

	const MIN_SCALE = 1;
	const MAX_SCALE = 5;
	const DOUBLE_TAP_MS = 300;

	let scale = $state(1);
	let tx = $state(0);
	let ty = $state(0);

	let container = $state<HTMLDivElement>();
	const pointers = new Map<number, { x: number; y: number }>();
	let prevDistance = 0;
	let prevMid = { x: 0, y: 0 };
	let lastTapAt = 0;

	function reset() {
		scale = 1;
		tx = 0;
		ty = 0;
		pointers.clear();
		prevDistance = 0;
	}

	// Reset zoom/pan every time the viewer opens with a new picture.
	$effect(() => {
		if (open) reset();
	});

	function clampTranslation() {
		if (!container) return;
		const { width, height } = container.getBoundingClientRect();
		const maxX = ((scale - 1) * width) / 2;
		const maxY = ((scale - 1) * height) / 2;
		tx = Math.min(maxX, Math.max(-maxX, tx));
		ty = Math.min(maxY, Math.max(-maxY, ty));
	}

	// Zoom to `newScale` while keeping the content point under (px, py) fixed.
	function zoomAround(px: number, py: number, newScale: number) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const mx = px - cx;
		const my = py - cy;
		const factor = newScale / scale;
		tx = mx - (mx - tx) * factor;
		ty = my - (my - ty) * factor;
		scale = newScale;
		clampTranslation();
	}

	function onPointerDown(event: PointerEvent) {
		container?.setPointerCapture(event.pointerId);
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

		if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			prevDistance = Math.hypot(a.x - b.x, a.y - b.y);
			prevMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
		} else if (pointers.size === 1) {
			const now = Date.now();
			if (now - lastTapAt < DOUBLE_TAP_MS) {
				if (scale > 1) reset();
				else zoomAround(event.clientX, event.clientY, 2.5);
				lastTapAt = 0;
			} else {
				lastTapAt = now;
			}
		}
	}

	function onPointerMove(event: PointerEvent) {
		const previous = pointers.get(event.pointerId);
		if (!previous) return;
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

		if (pointers.size >= 2) {
			const [a, b] = [...pointers.values()];
			const distance = Math.hypot(a.x - b.x, a.y - b.y);
			const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
			if (prevDistance > 0) {
				const newScale = Math.min(
					MAX_SCALE,
					Math.max(MIN_SCALE, scale * (distance / prevDistance))
				);
				zoomAround(mid.x, mid.y, newScale);
				tx += mid.x - prevMid.x;
				ty += mid.y - prevMid.y;
				clampTranslation();
			}
			prevDistance = distance;
			prevMid = mid;
		} else if (scale > 1) {
			tx += event.clientX - previous.x;
			ty += event.clientY - previous.y;
			clampTranslation();
		}
	}

	function onPointerUp(event: PointerEvent) {
		pointers.delete(event.pointerId);
		if (pointers.size < 2) prevDistance = 0;
		if (scale <= 1) {
			tx = 0;
			ty = 0;
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex touch-none select-none items-center justify-center overflow-hidden bg-black/95"
		transition:fade={{ duration: 150 }}
	>
		<button
			class="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm"
			onclick={() => (open = false)}
			aria-label="Close"
		>
			<LucideX class="h-6 w-6" />
		</button>

		<div
			bind:this={container}
			class="flex h-full w-full touch-none items-center justify-center"
			role="presentation"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		>
			<img
				{src}
				{alt}
				draggable="false"
				class="max-h-full max-w-full object-contain"
				style="transform: translate({tx}px, {ty}px) scale({scale}); transform-origin: center center; touch-action: none;"
			/>
		</div>

		{#if help && scale === 1}
			<p
				class="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm"
			>
				{help}
			</p>
		{/if}
	</div>
{/if}
