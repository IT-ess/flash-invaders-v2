<script lang="ts">
	import { t } from '$lib/translations/translations';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="my-8">
	<h1>Top 10</h1>
	<Table.Root class="my-4">
		<Table.Caption class="text-red-100">Top 10 Invader Hunters !</Table.Caption>
		<Table.Header class="bg-red-200">
			<Table.Row>
				<Table.Head class="w-[100px]">{$t('ranking.rank')}</Table.Head>
				<Table.Head>{$t('ranking.avatar')}</Table.Head>
				<Table.Head>{$t('ranking.username')}</Table.Head>
				<Table.Head>{$t('ranking.found')}</Table.Head>
				<Table.Head class="text-right">{$t('ranking.score')}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.profiles as { avatar, username, score }, i}
				<Table.Row>
					<Table.Cell class="font-medium">{i + 1}</Table.Cell>
					<Table.Cell
						><Avatar.Root>
							<Avatar.Image src={avatar} alt={username} />
							<Avatar.Fallback
								>{username !== null ? username[0].toUpperCase() : 'U'}</Avatar.Fallback
							>
						</Avatar.Root></Table.Cell
					>
					<Table.Cell>{username}</Table.Cell>
					<Table.Cell>{data.invaderCount}/12 👾</Table.Cell>
					<Table.Cell class="text-right">{score}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
