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
	import BottomNav from '$lib/components/BottomNav.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
	import { buttonVariants } from '$lib/components/ui/button';
	import { supabase } from '$lib/supabase-client';

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

	function onClickSignOutAndGoToRoot() {
		supabase.auth.signOut();
		goto('/');
	}
</script>

<div
	class="fixed left-0 right-0 z-10 flex justify-between items-center shadow-md p-4 border-b-2 border-slate-300 bg-slate-500"
>
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
					{@render alertDisconnect()}
					<Dialog.Header>
						<Dialog.Title>{$t('common.profile.title')}</Dialog.Title>
						<Dialog.Description class="font-medium text-black">
							{$t('common.profile.description')}
						</Dialog.Description>
					</Dialog.Header>
					<NewAccount bind:url {userId} {username} {score} {invaderCount} />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{:else}
		<div class="pt-1">
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
					{@render alertDisconnect()}
					<Drawer.Header class="text-left">
						<Drawer.Title>{$t('common.profile.title')}</Drawer.Title>
						<Drawer.Description class="font-medium text-black">
							{$t('common.profile.description')}
						</Drawer.Description>
					</Drawer.Header>
					<NewAccount bind:url {userId} {username} {score} {invaderCount} />
					<Drawer.Footer class="pt-2">
						<Drawer.Close asChild let:builder>
							<Button variant="outline" builders={[builder]}>{$t('common.nav.cancel')}</Button>
						</Drawer.Close>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Root>
		</div>
	{/if}
	<h1 class="text-lg mr-4 font-medium">{$t(`common.headers.${$page.url.pathname}`)}</h1>
	{#if $page.params.lang !== undefined && !$page.url.pathname.match('quiz')}
		<div class="m-2">
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
{#if !$page.url.pathname.match('invader')}
	<BottomNav />
{/if}

{#snippet alertDisconnect()}
	<AlertDialog.Root>
		<AlertDialog.Trigger class="absolute right-0 m-4"
			><Button variant="ghost" size="icon"
				><MaterialSymbolsExitToAppRounded class="text-destructive h-8 w-8" /></Button
			></AlertDialog.Trigger
		>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{$t('common.profile.disconnect')}</AlertDialog.Title>
				<AlertDialog.Description class="text-black">
					{$t('common.profile.disconnect_confirm')}
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t('common.nav.cancel')}</AlertDialog.Cancel>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive' })}
					onclick={onClickSignOutAndGoToRoot}
				>
					{$t('common.profile.signOut')}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/snippet}
