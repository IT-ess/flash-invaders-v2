<script lang="ts">
	import { goto, onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { PUBLIC_PLATFORM } from '$env/static/public';
	import { getInvaderFromTagContent } from '$lib/invader-utils';
	import { sessionState } from '$lib/session-state.svelte';
	import { pendingInvader } from '$lib/pending-invader.svelte';
	import type { LayoutProps } from './$types';
	import '../app.css';

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

	// Handle a `zwietess://invader${id}` deeplink launch (an NFC scan while the app
	// was closed/backgrounded) as if the invader had been scanned in-app. On
	// Android the launching NFC intent is rewritten to a VIEW intent in
	// MainActivity so it reaches the deep-link plugin.
	function handleDeepLink(urls: string[]) {
		if (Date.now() < pendingInvader.nfcScanGuardUntil) return; // echo of an in-app scan
		const invader = urls
			.map((url) => getInvaderFromTagContent(url.replace(/\/$/, '')))
			.find((invader) => invader !== null);
		if (!invader) return; // not a known invader URI
		if (!sessionState.getUserId) return; // registered users only
		pendingInvader.invader = invader;
		const locale = navigator.language.startsWith('de') ? 'de' : 'fr';
		goto(`/${locale}/home`);
	}

	onMount(() => {
		if (PUBLIC_PLATFORM !== 'mobile') return;
		// The root layout lives for the app's whole lifetime, so the listener never
		// needs to be torn down.
		void (async () => {
			const { getCurrent, onOpenUrl } = await import('@tauri-apps/plugin-deep-link');
			const launchUrls = await getCurrent();
			if (launchUrls) handleDeepLink(launchUrls);
			await onOpenUrl(handleDeepLink);
		})();
	});
</script>

{@render children()}
