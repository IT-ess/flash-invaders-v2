<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import type { LayoutProps } from './$types';
	import '../app.pcss';

	let { children }: LayoutProps = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children()}
