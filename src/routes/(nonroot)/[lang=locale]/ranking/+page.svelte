<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { profiles } = data;
</script>

<div class="my-8">
	<Table.Root class="my-4">
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
				<Table.Row class="text-center">
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
					{#await profile}
						<Table.Cell
							><Avatar.Root>
								<Avatar.Fallback>U</Avatar.Fallback>
							</Avatar.Root></Table.Cell
						>
						<Table.Cell>Name</Table.Cell>
						<Table.Cell>?/12 👾</Table.Cell>
						<Table.Cell class="font-semibold">Score</Table.Cell>
					{:then { avatar, username, invaderCount, score }}
						<Table.Cell
							><Avatar.Root>
								<Avatar.Image src={avatar} alt={username} />
								<Avatar.Fallback
									>{username !== null ? username[0].toUpperCase() : 'U'}</Avatar.Fallback
								>
							</Avatar.Root></Table.Cell
						>
						<Table.Cell>{username}</Table.Cell>
						<Table.Cell>{invaderCount}/12 👾</Table.Cell>
						<Table.Cell class="font-extrabold text-base text-center">{score}</Table.Cell>
					{:catch}
						<Table.Cell class="text-red-500">{$t('common.error')}</Table.Cell>
					{/await}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
