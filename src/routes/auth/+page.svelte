<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase-client';
	import { formSchema, type FormSchema } from './zod-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: SuperValidated<Infer<FormSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	let isSignUp = $state(true);
	let loading = $state(false);
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...

	const handleSignup = async (event: Event) => {
		try {
			event.preventDefault(); // Is that even useful ?
			loading = true;
			const email = $formData.email;
			const password = $formData.password;
			const { error } = await supabase.auth.signUp({ email, password });
			if (error) throw error;
			goto(`${defaultLocale}/home`);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	const handleSignIn = async (event: Event) => {
		try {
			event.preventDefault(); // Is that even useful ?
			loading = true;
			const email = $formData.email;
			const password = $formData.password;
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			goto(`${defaultLocale}/home`);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

{#if isSignUp}
	{@render formSnippet(handleSignup)}
	<br />
	<button onclick={() => (isSignUp = false)}>Already have an account? Sign in instead</button>
{:else}
	{@render formSnippet(handleSignIn)}
	<br />
	<button onclick={() => (isSignUp = true)}>Don't have an account? Sign up instead</button>
{/if}

{#snippet formSnippet(idFunction)}
	<div class="row flex-center flex">
		<div class="col-6 form-widget" aria-live="polite">
			<h1 class="header">Supabase + Svelte</h1>
			<form method="POST" use:enhance onsubmit={idFunction}>
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} type="email" bind:value={$formData.email} />
					</Form.Control>
					<Form.Description>It's preferred that you use your company email.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input {...attrs} type="password" bind:value={$formData.password} />
					</Form.Control>
					<Form.Description>Ensure the password is at least 8 characters.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button>Submit</Form.Button>
			</form>
		</div>
	</div>
{/snippet}
