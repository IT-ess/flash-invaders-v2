import type { AuthSession } from '@supabase/supabase-js';
import { supabase } from './supabase-client';

export class SessionState {
	private session = $state<AuthSession | null>(null);

	constructor() {}

	async init() {
		await supabase.auth.getSession().then(({ data }) => {
			this.session = data.session;
		});
		supabase.auth.onAuthStateChange((_event, _session) => {
			this.session = _session;
		});
	}

	get getSession() {
		return this.session;
	}

	signOut() {
		supabase.auth.signOut();
		this.session = null;
	}
}

const sessionState = new SessionState();

await sessionState.init();

export { sessionState as sessionState };
