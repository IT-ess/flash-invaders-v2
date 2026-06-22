import { PUBLIC_PLATFORM, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { browser } from '$app/environment';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import { LazyStore } from '@tauri-apps/plugin-store';
import { type Database } from './database.types';

// On mobile, Tauri's WebView does not reliably persist `localStorage` across app
// launches, which logs the user out every time. Back the auth session with the
// Tauri store plugin (persisted to disk) instead. On web we keep the default
// `localStorage` behaviour.
let storage: SupportedStorage | undefined;

if (browser && PUBLIC_PLATFORM === 'mobile') {
	const store = new LazyStore('supabase-auth.json');
	storage = {
		getItem: async (key) => (await store.get<string>(key)) ?? null,
		setItem: async (key, value) => {
			await store.set(key, value);
			await store.save();
		},
		removeItem: async (key) => {
			await store.delete(key);
			await store.save();
		}
	};
}

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: false,
		...(storage ? { storage } : {})
	}
});

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
