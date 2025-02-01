<script>
	import {onMount} from "svelte";
	export let book;
	onMount(console.log("cover implemented: ", book))

</script>
<div class="max-w-sm border rounded-xl bg-white border-black-200">
	<h3 class="py-4 text-2xl text-center"> { book.title} </h3>
<div class="flex items-center justify-center flex-col">
		<img src={book.image} />	
		<p class="text-justify py-3 text-md w-80"> {book.description} </p>
		<span class="text-sm text-gray-300 min-w-[90%] text-right">Chapters - {book.chapters} </span>
	</div>
</div>
