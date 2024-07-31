<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/translations/translations';

	type Position = 'left' | 'bottom' | 'top';
	type MenuItem = {
		text: string;
		icon: any;
		path: string;
	};

	let {
		position = 'bottom',
		menuItems = [],
		onTabSwitch,
		activeIndex = 0
	}: {
		position: Position;
		menuItems: MenuItem[];
		onTabSwitch: (index: number, item: MenuItem) => void;
		activeIndex: number;
	} = $props();

	//
	//   export let position = "left"; // whether the menubar should be at the bottom or top
	//   export let menuItems = []; // the menu items and their icons
	//   export let onTabSwitch = (index, item) => {}; // the callback function to be called when a tab is switched
	//   export let activeIndex = 0; // the active index of current menu item

	let highlightColor = 'bg-primary'; // the color of the active link, it cannot be exported then doesnt show up in the parent component

	function setActiveLink(index: number) {
		if (activeIndex !== index) {
			activeIndex = index;
			// Call the callback prop
			onTabSwitch(index, menuItems[index]);
		}
	}

	onMount(() => {});
</script>

<div
	class={position === 'left'
		? 'navigation bg-white h-full min-h-screen rounded-r-[15px] min-w-[100px] flex flex-col items-start justify-start z-10'
		: 'navigation bg-white w-[80%] min-w-[300px] h-[70px] rounded-[15px] grid place-items-center z-10 fixed bottom-[5%] left-[50%] -translate-x-1/2'}
>
	<ul class={position == 'left' ? 'list-none w-full relative' : 'list-none flex relative'}>
		{#each menuItems as item, index}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li
				class="mx-4 py-[5px] px-[2px] z-[3] cursor-pointer w-[75px]"
				class:active={activeIndex === index}
				onclick={() => setActiveLink(index)}
			>
				<a href={item.path} class="no-underline text-primary flex flex-col items-center">
					<span
						class="text text-[1.05em] font-medium text-primary py-[5px] px-[5px] rounded-[12px] opacity-0 transform -translate-y-[30px] transition-all duration-500 ease-in-out
                  {activeIndex === index ? ' translate-y-[10px] opacity-100' : ''}"
					>
						{$t(item.text)}
					</span>
					<span
						class="icon text-[1.5em] transform -translate-y-[20px] transition-all duration-500 ease-in-out
                  {activeIndex === index
							? position == 'top'
								? 'translate-y-[26px] text-white'
								: 'translate-y-[-64px] text-white'
							: ''}"
					>
						<svelte:component this={item.icon} size={24} />
					</span>
				</a>
			</li>
		{/each}
		{#if position == 'left'}
			<div
				class="indicator w-[50px] h-[50px] rounded-full border-primary {highlightColor} absolute right-[-38px] z-[2] transition-all duration-300 ease-in-out flex items-center justify-center"
				style="top: {activeIndex * 72 + 2}px;"
			>
				<span class="icon text-white">
					<svelte:component this={menuItems[activeIndex].icon} size={24} />
				</span>
			</div>
		{:else}
			<div
				class="indicator w-[50px] h-[50px] rounded-full border-primary {highlightColor} absolute {position ==
				'top'
					? '-bottom-[48%]'
					: '-top-[54%]'}  z-[2] transition-all duration-300 ease-in-out
       "
				style="left: {activeIndex < 2
					? activeIndex * 75 + 12
					: activeIndex * 75 + 12}px; margin-left: {1 + activeIndex * 2}rem; margin-right: {1 +
					activeIndex * 2}rem;"
			></div>
		{/if}
	</ul>
</div>
