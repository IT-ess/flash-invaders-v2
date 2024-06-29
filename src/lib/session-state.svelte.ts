import { getContext, onDestroy, setContext } from 'svelte';
import type { AuthSession } from '@supabase/supabase-js';
import { supabase } from './supabase-client';

export class SessionState {
	session = $state<AuthSession | null>(null);

	constructor() {
		// onDestroy(() => {
		// 	for (const timeout of this.toastToTimeoutMap.values()) {
		// 		clearTimeout(timeout);
		// 	}
		// 	this.toastToTimeoutMap.clear();
		// });
		supabase.auth.getSession().then(({ data }) => {
			this.session = data.session;
		});
		supabase.auth.onAuthStateChange((_event, _session) => {
			this.session = _session;
		});
	}
}

const SESSION_KEY = Symbol('SESSION');

export function setSessionState() {
	return setContext(SESSION_KEY, new SessionState());
}

export function getSessionState() {
	return getContext<ReturnType<typeof setSessionState>>(SESSION_KEY);
}
