<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    
    let component;
    let lastScrollY = 0;
    let translateY = 0;
    
    function handleScroll(event) {
        const currentDelta = event.deltaY;
        console.log("currentDelta: ", currentDelta);
        // Calculate new translate value
       if (currentDelta >=0 ) {
		    if (!component.classList.contains("hide")){
			    console.log('adding hide-nav', component.classList);
		    component.classList.add("hide");
                    
		    }} 
	else {
			    component.classList.remove("hide");
		    }
	    
    }
    
    onMount(() => {
        window.addEventListener('wheel', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    });
</script>

<header> 
    <nav bind:this={component} class="fixed z-[999] mx-8 flex w-screen justify-between ">
        <ul>
            <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
                <a href="/">Home</a>
            </li>
        </ul>
        <ul>
            <li class="text-xl min-w-24">
                <a href="https://x.com/TheKingOfStank" rel="noopener noreferrer" target="_blank">
                    <span class="text-2xl">𝕏</span>
                </a>
            </li>
        </ul>
    </nav>
</header>

<style>
header {
    display: flex;
    justify-content: space-between;
	transition: all 0.5s ease-in-out;
}

.hide-nav {
	opacity: 0;
    display: none;
}

.corner {
    width: 3em;
    height: 3em;
}

.corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
}

nav {
    font-family: var(--font-tech);
}

svg {
    width: 2em;
    height: 3em;
    display: block;
}

path {
    fill: var(--background);
}

ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
}

li {
    position: relative;
    height: 100%;
}

nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
}

a:hover {
    color: var(--color-theme-1);
}
</style>
