<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { t } from '$lib/translations/translations';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase-client';
	import { formSchema, type FormSchema } from './zod-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card';
	import OcticonMail16 from '~icons/octicon/mail-16';
	import OcticonKeyAsterisk16 from '~icons/octicon/key-asterisk-16';
	import { AuthError } from '@supabase/supabase-js';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';
	import MaterialSymbolsAccountCircle from '~icons/material-symbols/account-circle';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import PageIndicator from '$lib/components/PageIndicator.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import OcticonAlert from '~icons/octicon/alert';

	let { data }: { data: SuperValidated<Infer<FormSchema>> } = $props();

	const form = superForm(data, {
		SPA: true,
		validators: zodClient(formSchema),
		dataType: 'json',
		onError({ result }) {
			toast.error(result.error.message || 'Unknown error');
		}
	});

	const { form: formData, enhance, message } = form;

	let isSignUp = $state(true);
	let loading = $state(false);
	let authFailModal = $state(false);
	let authErrorMessage = $state('');
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...

	const handleSubmission = async (event: Event) => {
		try {
			event.preventDefault();
			loading = true;
			const email = $formData.email;
			const password = $formData.password;
			const username = $formData.username;

			let error: AuthError | null = null;
			if (isSignUp) {
				error = (
					await supabase.auth.signUp({
						email,
						password,
						options: {
							data: {
								username
							}
						}
					})
				).error;
			} else {
				error = (await supabase.auth.signInWithPassword({ email, password })).error;
			}
			if (error) throw error;
			if (isSignUp) {
				goto(`${defaultLocale}/avatar`);
			} else {
				goto(`${defaultLocale}/home`);
			}
		} catch (error) {
			if (error instanceof Error) {
				authErrorMessage = error.message;
				authFailModal = true;
			}
		} finally {
			loading = false;
		}
	};
</script>

<Toaster richColors />

<div class="min-h-screen w-full flex flex-col items-center justify-center">
	<Dialog.Root bind:open={authFailModal}>
		<Dialog.Content class="max-w-[80%] rounded-md">
			<Dialog.Title>Error</Dialog.Title>
			<Dialog.Description>
				<div class="text-center">
					<OcticonAlert class="mx-auto mb-4 w-12 h-12 text-destructive dark:text-gray-200" />
					<h2 class="mb-5 text-lg font-semibold text-destructive dark:text-gray-400">
						{authErrorMessage}
					</h2>
				</div>
			</Dialog.Description>
			<Dialog.Footer>
				<Button variant="destructive" onclick={() => (authFailModal = false)}
					>{$t('home.fail_modal.button')}</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>{$t(`auth.register`)}</Card.Title>
			<Card.Description>{$t(`auth.caption`)}</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="row flex-center flex mt-4">
				<div class="col-6 form-widget" aria-live="polite">
					<form method="POST" use:enhance onsubmit={handleSubmission}>
						<Form.Field {form} name="email" class="min-w-40">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="flex items-center">
										<OcticonMail16 class="mr-1 mb-[1px]" />{$t(`auth.email.label`)}
									</Form.Label>
									<Input {...props} type="email" bind:value={$formData.email} />
								{/snippet}
							</Form.Control>
							{#if isSignUp}
								<Form.Description>{$t(`auth.email.helper`)}</Form.Description>
							{/if}
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="password" class="mt-6">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="flex items-center"
										><OcticonKeyAsterisk16 class="mr-1 mb-[1px]" />{$t(
											`auth.password.label`
										)}</Form.Label
									>
									<Input {...props} type="password" bind:value={$formData.password} />
								{/snippet}
							</Form.Control>
							{#if isSignUp}
								<Form.Description>{$t(`auth.password.helper`)}</Form.Description>
							{/if}
							<Form.FieldErrors />
						</Form.Field>
						{#if isSignUp}
							<Form.Field {form} name="username" class="mt-6">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label class="flex items-center"
											><MaterialSymbolsAccountCircle class="mr-1 mb-[1px]" />{$t(
												`auth.username.label`
											)}</Form.Label
										>
										<Input {...props} type="text" bind:value={$formData.username} />
									{/snippet}
								</Form.Control>
								<Form.Description>{$t(`auth.username.helper`)}</Form.Description>
								<Form.FieldErrors />
							</Form.Field>
						{/if}
						{#if !loading}
							<Form.Button class="text-white mt-4"
								>{#if isSignUp}
									{$t(`auth.signUp`)}
								{:else}
									{$t(`auth.signIn`)}
								{/if}<OcticonArrowRight16 /></Form.Button
							>
						{:else}
							<Form.Button disabled class="text-white mt-4">
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								{#if isSignUp}
									{$t(`auth.signUp`)}
								{:else}
									{$t(`auth.signIn`)}
								{/if}
							</Form.Button>
						{/if}
					</form>
				</div>
			</div>
		</Card.Content>
		<Card.Footer>
			{#if isSignUp}
				<Button variant="link" onclick={() => (isSignUp = false)}
					>{$t(`auth.signUpSwitch.toSignIn`)}<OcticonArrowRight16 /></Button
				>
			{:else}
				<Button variant="link" onclick={() => (isSignUp = true)}
					>{$t(`auth.signUpSwitch.toSignUp`)}<OcticonArrowRight16 />
				</Button>
			{/if}
		</Card.Footer>
	</Card.Root>
	<PageIndicator totalPages={3} currentPage={0} />
</div>
