<script lang="ts">
	import { t } from '$lib/translations/translations';
	import { type Snippet } from 'svelte';
	import { MediaQuery } from 'runed';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { LayoutData } from './$types';
	import NewAccount from '$lib/components/NewAccount.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
	let newLang: string = $state('');
	let newUrl: string = $state('');

	$effect(() => {
		newLang = $page.params.lang === 'fr' ? 'de' : 'fr';
		newUrl = $page.url.pathname.replace($page.params.lang, newLang);
		document.documentElement.lang = $page.params.lang;
	});

	let { score, fetchedImage, username, invaderCount, userId } = data;

	let url = $state(fetchedImage);
	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

<div>
	<div class="fixed top-0 left-0 right-0 z-10 flex justify-between items-center shadow-md p-4">
		{#if isDesktop.matches}
			<div>
				<Dialog.Root bind:open>
					<Dialog.Trigger asChild let:builder>
						<Button variant="ghost" builders={[builder]}
							><Avatar.Root>
								<Avatar.Image src={url} alt={username} />
								<Avatar.Fallback
									>{username !== null ? username[0].toUpperCase() : 'U'}</Avatar.Fallback
								>
							</Avatar.Root></Button
						>
					</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>{$t('common.nav.profile')}</Dialog.Title>
							<Dialog.Description>
								Make changes to your profile here. Click save when you're done.
							</Dialog.Description>
						</Dialog.Header>
						<NewAccount bind:url {userId} {username} {score} {invaderCount} />
					</Dialog.Content>
				</Dialog.Root>
			</div>
		{:else}
			<div>
				<Drawer.Root bind:open>
					<Drawer.Trigger asChild let:builder>
						<Button variant="ghost" builders={[builder]}
							><Avatar.Root>
								<Avatar.Image src={url} alt={username} />
								<Avatar.Fallback
									>{username !== null ? username[0].toUpperCase() : 'U'}</Avatar.Fallback
								>
							</Avatar.Root></Button
						>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header class="text-left">
							<Drawer.Title>{$t('common.nav.profile')}</Drawer.Title>
							<Drawer.Description class="text-red-300">
								Make changes to your profile here. Click save when you're done.
							</Drawer.Description>
						</Drawer.Header>
						<NewAccount bind:url {userId} {username} {score} {invaderCount} />
						<Drawer.Footer class="pt-2">
							<Drawer.Close asChild let:builder>
								<Button variant="outline" builders={[builder]}>Cancel</Button>
							</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			</div>
		{/if}
		{#if $page.params.lang !== undefined && !$page.url.pathname.match('quiz')}
			<div class="my-2">
				<Button variant="outline" class="!p-2" onclick={() => goto(newUrl)}>
					{#if $page.params.lang === 'fr'}
						🇫🇷
					{:else}
						🇩🇪
					{/if}
				</Button>
			</div>
		{/if}
	</div>
	<div class="pt-16">
		{@render children()}
	</div>
</div>
