import type { AuthSession } from '@supabase/supabase-js';
import { supabase } from './supabase-client';

export class SessionState {
	private session = $state<AuthSession | null>(null);
	private userId = $state<string | null>(null);

	constructor() {}

	async init() {
		await supabase.auth.getSession().then(({ data }) => {
			this.session = data.session;
		});
		supabase.auth.onAuthStateChange((_event, _session) => {
			this.session = _session;
		});
		this.userId = this.session?.user?.id ?? null;
	}

	get getSession() {
		return this.session;
	}

	get getUserId() {
		return this.userId;
	}
}

const sessionState = new SessionState();

await sessionState.init();

export { sessionState as sessionState };
