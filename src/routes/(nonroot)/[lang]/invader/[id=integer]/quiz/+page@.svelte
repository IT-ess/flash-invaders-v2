<script lang="ts">
	import { t } from '$lib/translations/translations';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase-client';
	import { goto } from '$app/navigation';
	import OcticonArrowRight16 from '~icons/octicon/arrow-right-16';
	import type { PageData } from './$types';

	let pageId = +$page.params.id;

	let { data }: { data: PageData } = $props();

	let score = $state(0);
	let questionPointer = $state(0);
	let showAnswer = $state(false);

	const { questions } = data;
	let answers = new Array(questions.length).fill(null);

	async function submitScore() {
		const { error } = await supabase.rpc('update_user_permissions_and_score', {
			invader_id: pageId,
			user_id_input: data.user.id,
			permission_level: 2,
			incremented_score: score
		});
		if (error) {
			console.error('Error updating user permissions and score:', error.message);
		}
	}

	async function onClickGoToHome() {
		goto('/');
	}

	const themeColorsBg = ['bg-bluejum', 'bg-yellowjum', 'bg-blackjum', 'bg-redjum'];
	const themeColorsBgHover = [
		'hover:bg-bluejum-light',
		'hover:bg-yellowjum-light',
		'hover:bg-blackjum-light',
		'hover:bg-redjum-light'
	];
	const themeColorsBgFocus = [
		'focus:bg-bluejum-lighter',
		'focus:bg-yellowjum-lighter',
		'focus:bg-blackjum-lighter',
		'focus:bg-redjum-lighter'
	];

	function computeButtonClasses(i: number): string {
		const baseClasses = 'text-center px-4 py-7 text-lg text-white rounded-lg w-full';
		const ringClass = showAnswer
			? getRingClassFromAnswer(questionPointer, i)
			: 'focus:ring-4 focus:ring-blue-300';
		const themeClass =
			themeColorsBg[i] !== undefined
				? themeColorsBg[i] + ' ' + themeColorsBgHover[i] + ' ' + themeColorsBgFocus[i]
				: 'bg-blue-600 text-white';
		return `${baseClasses} ${ringClass} ${themeClass}`;
	}

	function getRingClassFromAnswer(questionPointer: number, answerIndex: number): string {
		if (questions[questionPointer].correctIndex === answerIndex) {
			return 'ring-4 ring-green-600';
		}
		return 'ring-4 ring-red-600';
	}
</script>

{#if !(questionPointer > answers.length - 1)}
	<div class="flex flex-col h-screen p-2">
		<div class="my-2">
			<Progress value={(questionPointer / questions.length) * 100} />
		</div>
		<div class="p-6 mt-2 bg-white">
			<p>
				{questions[questionPointer].question}
			</p>
		</div>
		<div class="flex flex-col justify-evenly flex-grow p-4">
			{#each questions[questionPointer].options as opt, i}
				<Button
					class={computeButtonClasses(i)}
					onclick={() => {
						answers[questionPointer] = i;
					}}
				>
					{opt}
				</Button>
			{/each}
		</div>

		{#if showAnswer}
			<div class="w-full flex flex-shrink-0 basis-28 justify-center items-center space-x-5">
				<Button
					onclick={() => {
						if (questions[questionPointer].correctIndex === answers[questionPointer]) {
							score += (questionPointer + 1) * 10; // the harder are the questions, the more points you get
						}
						questionPointer++;
						showAnswer = false;
					}}
				>
					{$t('quiz.next')}
					<OcticonArrowRight16 class="ml-1 -mr-1 w-5 h-5" />
				</Button>
				{#if questions[questionPointer].correctIndex === answers[questionPointer]}
					<p class="text-green-500 font-extrabold">
						+{(questionPointer + 1) * 10}
					</p>
				{/if}
			</div>
		{:else}
			<div class="w-full flex flex-shrink-0 basis-28 justify-center items-center">
				<Button
					onclick={() => {
						showAnswer = true;
					}}
				>
					{$t('quiz.show')}
					<OcticonArrowRight16 class="ml-1 -mr-1 w-5 h-5" />
				</Button>
			</div>
		{/if}
	</div>
{:else}
	<div>
		{#await submitScore()}
			<p>...</p>
		{:then _}
			<div class="flex flex-col h-screen justify-center items-center space-y-4">
				<h2 class="text-xl font-extrabold text-accent">{$t('quiz.submitted')}</h2>
				<Button type="submit" onclick={onClickGoToHome}>
					{$t('quiz.home')}
					<OcticonArrowRight16 class="ml-1 -mr-1 w-5 h-5" />
				</Button>
			</div>
			<p>
				Score : {score} / 100
			</p>
		{/await}
	</div>
{/if}
