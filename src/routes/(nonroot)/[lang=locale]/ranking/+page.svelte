<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';
	import { INVADERS_STARTING_INDEX } from '$lib/game-data/invaders';

	let { data }: { data: PageData } = $props();
	let { profiles, currentUser } = $derived(data);
</script>

<div class="mb-safe-offset-28">
	{#snippet rankCell(i: number)}
		<Table.Cell class="text-lg text-center">
			{#if i === 0}
				🥇
			{:else if i === 1}
				🥈
			{:else if i === 2}
				🥉
			{:else}
				{i + 1}
			{/if}
		</Table.Cell>
	{/snippet}
	<Table.Root class="pb-safe">
		<Table.Caption class="text-primary font-semibold text-lg">{$t('ranking.caption')}</Table.Caption
		>
		<Table.Header class="bg-primary shadow-lg border-b-2 border-secondary">
			<Table.Row>
				<Table.Head class="text-white text-center">{$t('ranking.rank')}</Table.Head>
				<Table.Head class="text-white">{$t('ranking.avatar')}</Table.Head>
				<Table.Head class="text-white text-center">{$t('ranking.username')}</Table.Head>
				<Table.Head class="text-white text-center">{$t('ranking.found')}</Table.Head>
				<Table.Head class="text-white text-center">{$t('ranking.score')}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each profiles as profile, i}
				{#await profile}
					<Table.Row class="text-center">
						{@render rankCell(i)}
						<Table.Cell
							><Avatar.Root>
								<Avatar.Fallback>U</Avatar.Fallback>
							</Avatar.Root></Table.Cell
						>
						<Table.Cell>Name</Table.Cell>
						<Table.Cell>?/{12 - INVADERS_STARTING_INDEX} 👾</Table.Cell>
						<Table.Cell class="font-semibold">Score</Table.Cell>
					</Table.Row>
				{:then { avatar, username, invaderCount, score, isCurrentUser }}
					<Table.Row class={isCurrentUser ? 'bg-secondary text-center' : 'text-center'}>
						{@render rankCell(i)}
						<Table.Cell
							><Avatar.Root>
								<Avatar.Image src={avatar} alt={username} />
								<Avatar.Fallback
									>{username !== null ? username[0].toUpperCase() : 'U'}</Avatar.Fallback
								>
							</Avatar.Root></Table.Cell
						>
						<Table.Cell
							>{isCurrentUser ? `${username} (${$t('ranking.you')})` : username}</Table.Cell
						>
						<Table.Cell>{invaderCount}/{12 - INVADERS_STARTING_INDEX} 👾</Table.Cell>
						<Table.Cell class="font-extrabold text-base text-center">{score}</Table.Cell>
					</Table.Row>
				{:catch}
					<Table.Row class="text-center">
						{@render rankCell(i)}
						<Table.Cell class="text-red-500">{$t('common.error')}</Table.Cell>
					</Table.Row>
				{/await}
			{/each}
			{#if currentUser}
				{#await currentUser then me}
					{#if me}
						<Table.Row class="bg-secondary border-t-4 border-primary text-center">
							<Table.Cell class="text-lg font-bold text-center">{me.rank}</Table.Cell>
							<Table.Cell
								><Avatar.Root>
									<Avatar.Image src={me.avatar} alt={me.username} />
									<Avatar.Fallback
										>{me.username !== null ? me.username[0].toUpperCase() : 'U'}</Avatar.Fallback
									>
								</Avatar.Root></Table.Cell
							>
							<Table.Cell>{me.username} ({$t('ranking.you')})</Table.Cell>
							<Table.Cell>{me.invaderCount}/{12 - INVADERS_STARTING_INDEX} 👾</Table.Cell>
							<Table.Cell class="font-extrabold text-base text-center">{me.score}</Table.Cell>
						</Table.Row>
					{/if}
				{/await}
			{/if}
		</Table.Body>
	</Table.Root>
</div>
