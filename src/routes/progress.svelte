<!-- ProgressBar.svelte -->
<script>
	export let labels=[];
	export let currentStep = 0;
	
	$: sectionWidth = `${100 / labels.length}%`;
	
	function getColor(index) {
		if (index < currentStep) return 'bg-white bar-shadow shadow-white'; 
		if (index === currentStep) return 'bg-white bar-shadow shadow-white';
		return 'bg-gray-800';
	}
	function getGlow(index) {
		if (index < currentStep) return 'text-gray-900 ';
		if (index === currentStep) return 'text-gray-200 ';
		return 'text-gray-900 g';
	}
</script>

<div class="w-full max-w-4xl mx-auto p-8">
	<div class="relative pt-8">
		<!-- Labels -->
		<div class="absolute top-0 w-full flex">
			{#each labels as label, index}
				<div 
					class="text-center transition-colors duration-500"
					style="width: {sectionWidth}"
				>
					{#if index === 0 }
					<a href="/sverdle">
					<span class="font-bold {getGlow(index)} md:text-lg text-sm">
						{label}
					</span>
					</a>

					{:else if index !== currentStep}
					<span class="font-bold {getGlow(index)} md:text-lg text-xs">
						{label}
					</span>
										{:else}
					<a href="/about">
					<span class="font-bold {getGlow(index)} md:text-lg text-sm">
						{label}
					</span>
					</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<!-- Progress Bar -->
	<div class="h-8  rounded-full overflow-hidden flex flex-col justify-center center-items ">
		<div class="flex h-2 ">
			{#each labels as _, index}
				<div
					class="{getColor(index)}  transition-colors duration-500"
					style="width: {sectionWidth}"
				/>
			{/each}
		</div>
	</div>
</div>
<style>
.bar-shadow {
	box-shadow: 0px 1px 8px 2px;

}
</style>
