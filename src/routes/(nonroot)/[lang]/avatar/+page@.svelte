<script lang="ts">
	import NewAvatar from '$lib/components/NewAvatar.svelte';
	import { t } from '$lib/translations/translations';
	import type { PageData } from './$types';
	import Title from '$lib/components/Title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';
	import PageIndicator from '$lib/components/PageIndicator.svelte';

	let { data }: { data: PageData } = $props();
	let { username, fetchedImage, userId } = data;
</script>

<div class="h-screen w-screen container flex flex-col justify-between">
	<div class="mt-8"><Title /></div>
	<div>
		<NewAvatar {username} url={fetchedImage} {userId} size="lg" />
		<div class="text-center mt-12 font-firava">
			<h2 class="text-4xl capitalize font-extrabold">{$t(`avatar.heading`)}</h2>
			<p>{$t(`avatar.subheading`)}</p>
		</div>
	</div>
	<PageIndicator totalPages={3} currentPage={1} />
	<Button class="mb-8 font-semibold" size="lg" variant="default" href="tutorial"
		>{$t(`common.nav.tutorial`)}<OcticonArrowRight16 class="ml-1 mb-[4px]" /></Button
	>
</div>
