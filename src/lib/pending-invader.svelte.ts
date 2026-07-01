import type { Invader } from '$lib/game-data/invaders';

// Holds an invader captured from a deeplink launch (NFC scan while the app was
// closed/backgrounded) until the home page is ready to display its success modal.
class PendingInvader {
	invader = $state<Invader | null>(null);

	// On Android an in-app NFC scan is delivered both to the NFC plugin and, via
	// MainActivity, to the deeplink path. While an in-app scan is running we set
	// this to a future timestamp so the deeplink handler ignores that echo.
	nfcScanGuardUntil = 0;
}

export const pendingInvader = new PendingInvader();
