<!-- src/routes/books -->
<script>
	export let data;
	const {books} = data;
	import  Cover from "./components/cover.svelte";
	import {onMount} from "svelte";
	import { goto } from '$app/navigation';
	onMount(console.log("on Books Page", books))	
	function gotoBook(book){
		console.log("clicked me!", book.slug, book);
		const a = document.createElement("a");
		a.href = `/books/${book.slug}`;
		a.click();
	}
</script>

<div class="book-layout">
	<div class="flex flex-row flex-wrap justify-center ">
	{#each books as book, i}
		<div on:click={gotoBook(book)} class="m-4">
		<Cover   {book} index={i}/>
		</div>
	{/each}
		</div>
</div>

