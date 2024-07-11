<script lang="ts">
	import { type Snippet } from 'svelte';
	import { MediaQuery } from 'runed';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { LayoutData } from './$types';
	import NewAccount from '$lib/components/NewAccount.svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	let { score, fetchedImage, username, invaderCount, userId } = data;

	let url = $state(fetchedImage);
	let open = $state(false);
	const isDesktop = new MediaQuery('(min-width: 768px)');
</script>

<div class="container" style="padding: 50px 0 100px 0">
	<div>
		{#if isDesktop.matches}
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
						<Dialog.Title>Edit profile</Dialog.Title>
						<Dialog.Description>
							Make changes to your profile here. Click save when you're done.
						</Dialog.Description>
					</Dialog.Header>
					<NewAccount bind:url {userId} {username} {score} {invaderCount} />
				</Dialog.Content>
			</Dialog.Root>
		{:else}
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
						<Drawer.Title>Edit profile</Drawer.Title>
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
		{/if}
	</div>
	{@render children()}
</div>
