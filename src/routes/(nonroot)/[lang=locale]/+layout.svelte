<script lang="ts">
	import { t } from '$lib/translations/translations';
	import { MediaQuery } from 'svelte/reactivity';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { LayoutProps } from './$types';
	import Account from '$lib/components/Account.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import NavbarSlider from '$lib/components/NavbarSlider.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
	import { buttonVariants } from '$lib/components/ui/button';
	import { supabase } from '$lib/supabase-client';
	import { Medal, Images, Radio } from 'lucide-svelte';

	const menuItems = [
		{ text: 'common.nav.gallery', icon: Images, path: 'gallery' },
		{ text: 'common.nav.search', icon: Radio, path: 'home' },
		{ text: 'common.nav.ranking', icon: Medal, path: 'ranking' }
	];

	let activeIndex = $state(1);
	let position: 'left' | 'bottom' | 'top' = $state('bottom');

	function handleTabSwitch(index: number, item: any) {
		activeIndex = index;
	}

	let { children, data }: LayoutProps = $props();
	let newLang: string = $state('');
	let newUrl: string = $state('');

	let { fetchedImage, username, userId } = data;

	let url: string | null = $state(null);
	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');

	$effect(() => {
		if (page.url.pathname.match('gallery')) {
			activeIndex = 0;
		}
		if (page.url.pathname.match('ranking')) {
			activeIndex = 2;
		}
		newLang = page.params.lang === 'fr' ? 'de' : 'fr';
		newUrl = page.url.pathname.replace(page.params.lang, newLang);
		document.documentElement.lang = page.params.lang;

		fetchedImage.then((image) => {
			url = image;
		});
	});

	async function onClickSignOutAndGoToRoot() {
		await supabase.auth.signOut();
		goto('/');
	}

	async function onClickDeleteAccountAndGoToRoot() {
		await supabase.functions.invoke('delete_user_account');
		supabase.auth.signOut();
		goto('/');
	}
</script>

<div
	class="fixed left-0 right-0 z-10 flex justify-between items-center shadow-md p-4 border-b-2 border-slate-300 bg-slate-300 font-firava"
>
	{#if isDesktop.current}
		<div>
			<Dialog.Root bind:open>
				<Dialog.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
					<Avatar.Root>
						<Avatar.Image src={url} alt={username} />
						<Avatar.Fallback>{username !== null ? username[0].toUpperCase() : 'U'}</Avatar.Fallback>
					</Avatar.Root>
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					{@render alertDisconnect()}
					<Dialog.Header>
						<Dialog.Title>{$t('common.profile.title')}</Dialog.Title>
						<Dialog.Description class="font-medium text-black">
							{$t('common.profile.description')}
						</Dialog.Description>
					</Dialog.Header>
					<Account bind:url {userId} {username} />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{:else}
		<div class="pt-1">
			<Drawer.Root bind:open>
				<Drawer.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
					<Avatar.Root>
						<Avatar.Image src={url} alt={username} />
						<Avatar.Fallback>{username !== null ? username[0].toUpperCase() : 'U'}</Avatar.Fallback>
					</Avatar.Root>
				</Drawer.Trigger>
				<Drawer.Content>
					{@render alertDisconnect()}
					<Drawer.Header class="text-left">
						<Drawer.Title>{$t('common.profile.title')}</Drawer.Title>
						<Drawer.Description class="font-medium text-black">
							{$t('common.profile.description')}
						</Drawer.Description>
					</Drawer.Header>
					<Account bind:url {userId} {username} />
				</Drawer.Content>
			</Drawer.Root>
		</div>
	{/if}
	<h1 class="text-3xl mr-4 font-normal font-pixelify">
		{$t(`common.headers.${page.url.pathname}`)}
	</h1>
	{#if page.params.lang !== undefined && !page.url.pathname.match('quiz')}
		<div class="m-2">
			<Button variant="outline" class="!p-2" onclick={() => goto(newUrl)}>
				{#if page.params.lang === 'fr'}
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
{#if !page.url.pathname.match('invader')}
	<NavbarSlider {menuItems} {position} {activeIndex} onTabSwitch={handleTabSwitch} />
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
			<AlertDialog.Footer class="space-y-2">
				<AlertDialog.Cancel class="sm:mt-2">{$t('common.nav.cancel')}</AlertDialog.Cancel>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive', class: 'bg-black' })}
					onclick={onClickDeleteAccountAndGoToRoot}
				>
					{$t('common.profile.delete_account')}
				</AlertDialog.Action>
				<AlertDialog.Action
					class={buttonVariants({ variant: 'destructive' })}
					onclick={onClickSignOutAndGoToRoot}
				>
					{$t('common.profile.sign_out')}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/snippet}
