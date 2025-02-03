<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>
<script>
export let data;
let {content} =  data;

</script>
{@html content}
