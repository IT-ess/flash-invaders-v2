import type { AuthSession } from '@supabase/supabase-js';
import { supabase } from './supabase-client';

export class SessionState {
	private session = $state<AuthSession | null>(null);
	private ready: Promise<void> | null = null;

	// Idempotent: reads the persisted session once and subscribes to auth changes.
	// This is awaited from route `load` functions instead of at module top-level — a
	// top-level `await` here makes this an async module, and on iOS WebKit that
	// triggers a "Cannot access 'component' before initialization" error because the
	// mobile auth storage (Tauri store) resolves asynchronously over IPC.
	init(): Promise<void> {
		if (!this.ready) {
			this.ready = (async () => {
				const {
					data: { session }
				} = await supabase.auth.getSession();
				this.session = session;
				supabase.auth.onAuthStateChange((_event, _session) => {
					this.session = _session;
				});
			})();
		}
		return this.ready;
	}

	get getSession() {
		return this.session;
	}

	get getUserId() {
		return this.session?.user?.id ?? null;
	}
}

export const sessionState = new SessionState();
