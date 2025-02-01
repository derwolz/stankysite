<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>
<script>
export let data;
console.log(data);
let {content} =  data;
console.log(content);

</script>
{@html content}
