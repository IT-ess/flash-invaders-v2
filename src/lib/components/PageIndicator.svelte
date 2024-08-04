<script lang="ts">
	let { totalPages = 3, currentPage = 0 }: { totalPages: number; currentPage: number } = $props();

	function incrementPage() {
		currentPage++;
	}
</script>

<div class="flex justify-center items-center my-5">
	{#each Array(totalPages) as _, index}
		<div
			class="w-3 h-3 rounded-full mx-1 transition-transform duration-300 cursor-pointer"
			class:bg-gray-400={index !== currentPage}
			class:bg-gray-800={index === currentPage}
			class:scale-100={index !== currentPage}
			class:scale-125={index === currentPage}
		></div>
	{/each}
</div>
