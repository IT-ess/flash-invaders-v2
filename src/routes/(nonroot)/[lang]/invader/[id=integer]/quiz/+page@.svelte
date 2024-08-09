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
	let lang = $page.params.lang;

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
		goto(`/${lang}/home`);
	}

	const themeColorsBg = ['bg-blue-800', 'bg-blue-600', 'bg-blue-500', 'bg-blue-400'];

	function computeButtonClasses(i: number): string {
		const baseClasses = 'text-center text-wrap px-4 py-7 text-lg text-white rounded-lg w-full';
		const ringClass = showAnswer
			? getRingClassFromAnswer(answers[questionPointer], i)
			: 'focus:ring-4 focus:ring-secondary';
		const themeClass = showAnswer
			? getThemeClassFromAnswer(questionPointer, i)
			: themeColorsBg[i] + ' hover:bg-slate-500 focus:bg-slate-500';

		return `${baseClasses} ${ringClass} ${themeClass}`;
	}

	function getRingClassFromAnswer(answerIndex: number, optionIndex: number): string {
		if (answerIndex === optionIndex) {
			return 'ring-4 ring-secondary';
		} else {
			return '';
		}
	}

	function getThemeClassFromAnswer(questionPointer: number, answerIndex: number): string {
		if (questions[questionPointer].correctIndex === answerIndex) {
			return 'bg-green-500 disabled:opacity-100';
		} else {
			return 'bg-destructive disabled:opacity-100';
		}
	}
</script>

{#if !(questionPointer > answers.length - 1)}
	<div class="flex flex-col h-screen p-2">
		<div class="my-2">
			<Progress value={(questionPointer / questions.length) * 100} />
		</div>
		<div class="p-6 mt-4 bg-white rounded-md font-semibold shadow-lg text-lg text-center ring-2">
			<p>
				{questions[questionPointer].question}
			</p>
		</div>
		<div class="flex flex-col justify-evenly flex-grow p-4">
			{#each questions[questionPointer].options as opt, i}
				<Button
					disabled={showAnswer}
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
					variant="secondary"
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
					variant="secondary"
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
				<h2 class="text-xl font-extrabold text-primary">{$t('quiz.submitted')}</h2>
				<Button type="submit" onclick={onClickGoToHome}>
					{$t('quiz.home')}
					<OcticonArrowRight16 class="ml-1 -mr-1 w-5 h-5" />
				</Button>
				<p class="font-semibold text-base">
					Score : {score} / 100
				</p>
			</div>
		{/await}
	</div>
{/if}
