<script lang="ts">
	import NewAvatar from '$lib/components/NewAvatar.svelte';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import { t } from '$lib/translations/translations';
	import type { PageData } from './$types';
	import Title from '$lib/components/Title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';

	// import { CheckCircleSolid } from 'flowbite-svelte-icons';

	let { data }: { data: PageData } = $props();
	let { username, fetchedImage, userId } = data;
</script>

<div class="h-screen w-screen container flex flex-col justify-between">
	<Title />
	<div>
		<NewAvatar {username} url={fetchedImage} {userId} size="lg" />
		<div class="text-center mt-12 font-firava">
			<h2 class="text-4xl capitalize font-extrabold">Set your userpic</h2>
			<p>So the people know your face better</p>
		</div>
	</div>
	<Button class="mb-8 font-semibold" size="lg" variant="default" href="tutorial"
		>{$t(`common.nav.tutorial`)}<OcticonArrowRight16 class="ml-1 mb-[4px]" /></Button
	>
</div>
