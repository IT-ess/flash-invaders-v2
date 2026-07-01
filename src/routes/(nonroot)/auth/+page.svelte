<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { t } from '$lib/translations/translations';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase-client';
	import { formSchema, type FormSchema } from './zod-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';
	import MaterialSymbolsAccountCircle from '~icons/material-symbols/account-circle';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import PageIndicator from '$lib/components/PageIndicator.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import OcticonAlert from '~icons/octicon/alert';

	let { data }: { data: SuperValidated<Infer<FormSchema>> } = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		SPA: true,
		validators: zod4Client(formSchema),
		dataType: 'json',
		onError({ result }) {
			toast.error(result.error.message || 'Unknown error');
		}
	});

	const { form: formData, enhance } = form;

	let loading = $state(false);
	let authFailModal = $state(false);
	let authErrorMessage = $state('');
	const defaultLocale = navigator.language.startsWith('de') ? 'de' : 'fr'; // get from cookie, user session, ...

	async function isUsernameTaken(username: string): Promise<boolean> {
		const { data } = await supabase
			.from('profiles')
			.select('username')
			.eq('username', username)
			.maybeSingle();
		return data !== null;
	}

	const handleSubmission = async (event: Event) => {
		try {
			event.preventDefault();
			loading = true;
			const username = $formData.username;

			if (await isUsernameTaken(username)) {
				authErrorMessage = $t('auth.username.taken');
				authFailModal = true;
				return;
			}

			const { error } = await supabase.auth.signInAnonymously({
				options: {
					data: {
						username
					}
				}
			});
			if (error) {
				console.error('Anonymous sign-in failed', error);
				// The profile-creation trigger raises a "Database error saving new
				// user" if the name was claimed between the pre-check and sign-in;
				// treat that as a taken username. Surface any other error verbatim so
				// the real cause (e.g. anonymous sign-ins disabled) is visible.
				authErrorMessage = error.message.includes('Database error')
					? $t('auth.username.taken')
					: error.message;
				authFailModal = true;
				return;
			}

			await goto(`${defaultLocale}/tutorial`);
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
			<Card.Title class="font-pixelify">{$t(`auth.register`)}</Card.Title>
			<Card.Description>{$t(`auth.caption`)}</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="row flex-center flex mt-4">
				<div class="col-6 form-widget" aria-live="polite">
					<form method="POST" use:enhance onsubmit={handleSubmission}>
						<Form.Field {form} name="username" class="min-w-40">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="flex items-center"
										><MaterialSymbolsAccountCircle class="mr-1 mb-px" />{$t(
											`auth.username.label`
										)}</Form.Label
									>
									<Input {...props} type="text" bind:value={$formData.username} />
								{/snippet}
							</Form.Control>
							<Form.Description>{$t(`auth.username.helper`)}</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
						{#if !loading}
							<Form.Button class="text-white mt-4"
								>{$t(`auth.signUp`)}<OcticonArrowRight16 /></Form.Button
							>
						{:else}
							<Form.Button disabled class="text-white mt-4">
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								{$t(`auth.signUp`)}
							</Form.Button>
						{/if}
					</form>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
	<PageIndicator totalPages={4} currentPage={0} />
</div>
