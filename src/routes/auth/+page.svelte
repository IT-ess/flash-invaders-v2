<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSessionState } from '$lib/session-state.svelte';
	import { supabase } from '$lib/supabase-client';

	let isSignUp = $state(true);
	let loading = $state(false);
	let email = $state('');
	let password = $state('');

	const session = getSessionState().getSession;

	const handleSignup = async () => {
		try {
			// event.preventDefault(); // Is that even useful ?
			loading = true;
			const { error } = await supabase.auth.signUp({ email, password });
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
				// TODO : replace with native alert
			}
		} finally {
			loading = false;
			goto('/');
		}
	};

	const handleSignIn = async () => {
		try {
			// event.preventDefault(); // Is that even useful ?
			loading = true;
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
				// TODO : replace with native alert
			}
		} finally {
			loading = false;
			goto('/');
		}
	};
</script>

{#if isSignUp}
	<!-- turn this into a snippet -->
	{@render form(handleSignup)}
	<button onclick={() => (isSignUp = false)}>Already have an account? Sign in instead</button>
	<!-- TODO : replace with a bind: and better ui -->
{:else}
	{@render form(handleSignIn)}
	<button onclick={() => (isSignUp = true)}>Don't have an account? Sign up instead</button>
{/if}

{#snippet form(idFunction)}
	<div class="row flex-center flex">
		<div class="col-6 form-widget" aria-live="polite">
			<h1 class="header">Supabase + Svelte</h1>
			<p class="description">Sign up with your email below</p>
			<form class="form-widget" onsubmit={idFunction}>
				<div>
					<label for="email">Email</label>
					<input
						id="email"
						class="inputField"
						type="email"
						placeholder="Your email"
						autocomplete="email"
						bind:value={email}
					/>
				</div>
				<div>
					<label for="password">Password</label>
					<input
						id="password"
						class="inputField"
						type="password"
						placeholder="Your pwd"
						autocomplete="current-password"
						bind:value={password}
					/>
				</div>
				<div>
					<button type="submit" class="button block" aria-live="polite" disabled={loading}>
						<span>{loading ? 'Loading' : 'Sign up'}</span>
					</button>
				</div>
			</form>
		</div>
	</div>
{/snippet}
