<script>
import { onMount } from 'svelte';
export let data;
const{content, metadata, navigation} = data; 
// Extract the actual content from the SSR payload



$: processedContent = data.content;
let scrollPercentage = 0;
let imageIndex = 0;
let previousImageIndex = 0;
let nextImageIndex = 0;
let isTransitioning = false;
let currentImageClass = 'current';
let previousImageClass = 'previous';
let nextImageClass = 'next';
function getScrollPercentage() {
    const doc = document.documentElement;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollHeight = doc.scrollHeight;

    // Calculate percentage scrolled
    const scrolled = (scrollTop / (scrollHeight - windowHeight)) * 100;

    // Clamp between 0 and 100
    return Math.min(100, Math.max(0, scrolled));
}

function getIndexFromPercentage(percentage, arrayLength) {
    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    // Convert percentage to decimal (0-1)
    const decimal = clampedPercentage / 100;

    // Calculate index
    // Subtract 0.001 to ensure 100% returns last index rather than undefined
    const index = Math.floor(decimal * arrayLength - 0.001);

    // Clamp index between 0 and arrayLength - 1
    return Math.min(arrayLength - 1, Math.max(0, index));
}

function updateImage(scrollPerc) {
    const newIndex = getIndexFromPercentage(scrollPerc, metadata.images.length);
    if (newIndex !== imageIndex && !isTransitioning) {
        isTransitioning = true;
        previousImageIndex = imageIndex;
        nextImageIndex = newIndex;
        // Swap classes to trigger the transition
        [nextImageClass, previousImageClass] = [previousImageClass, nextImageClass];

        // Start fade out transition after a small delay
        setTimeout(() => {
            isTransitioning = false;
            imageIndex = nextImageIndex;
            previousImageIndex = nextImageIndex;
            // Swap classes to trigger the transition
            [nextImageClass, previousImageClass] = [previousImageClass, nextImageClass];
        }, 500); // Match this with CSS transition duration
    }
}
let chapterMax = 5;
</script>
<svelte:window
    on:scroll={() => {
        scrollPercentage = getScrollPercentage();
        updateImage(scrollPercentage);
    }}
/>
<svelte:head>
    <title>{data.metadata?.title || 'Chapter'}</title>
</svelte:head>
<div class="fixed top-20 -translate-x-1/4 left-[15%] w-screen -z-50 ">
    {#if previousImageIndex !== imageIndex}
        <img 
            src={metadata.images[previousImageIndex]} 
            class="image h-screen absolute top-0 left-0  {previousImageClass}" 
            alt="Previous background"
        />
    {/if}
    <img 
        src={metadata.images[imageIndex]} 
        class="image  h-screen absolute top-0 left-0 {nextImageClass}" 
        alt="Current background"
    />

</div>
<!-- Wrap the content in a container with proper styling -->
<article class="relative prose prose-lg max-w-3xl mx-auto px-4 py-8">
    <div class="markdown-content">
        {@html content}    


    </div>

    <div class="absolute flex flex-col translate-x-3/4 right-0 top-0" >

        {#each Array(navigation.planned).fill() as _, i}
            <button class={
                    `min-w-17  my-12 p-4 text-white font-tech 
                    ${navigation.index == i+1 ? 'bg-orange-600 hover:bg-orange-800' :
                    i < navigation.released ? 'bg-gray-600 hover:bg-gray-900' :
                    'text-gray-800 bg-gray-900' }
                `}>
                {i+1}
            </button>
        {/each}
    </div>

    <nav class="flex justify-between mt-8 border-t pt-4">
        {#if navigation.previous}
            <a 
                href={`/books/${data.metadata.bookSlug}/${navigation.previous}`}
                class="text-blue-600 hover:text-blue-800"
            >
                ← Previous Chapter
            </a>
        {:else}
            <span></span>
        {/if}

        {#if navigation.next}
            <a 
                href={`/books/${navigation.bookSlug}/${navigation.next}`}
                class="text-blue-600 hover:text-blue-800"
            >
                Next Chapter →
            </a>
        {/if}
    </nav>
</article>

<style>
.image {
    transition: opacity 0.5s ease-in-out;
}
.next {
    opacity: 1.0;
}
.previous {
    opacity: 0.0;
}
.font-tech {
    font-family: var(--font-tech);
}
/* Add custom styles for your markdown content */
:global(.markdown-content h1) {
    @apply text-3xl font-bold mb-6;
}

:global(.markdown-content h2) {
    @apply text-2xl font-bold mb-4 mt-8;
}

:global(.markdown-content p) {
    @apply mb-1 leading-relaxed font-serif text-justify indent-8 ;

}

:global(.markdown-content a) {
    @apply text-blue-600 hover:text-blue-800 underline;
}

:global(.markdown-content ul) {
    @apply list-disc pl-6 mb-4;
}

:global(.markdown-content ol) {
    @apply list-decimal pl-6 mb-4;
}

:global(.markdown-content code) {
    @apply bg-gray-100 px-1 py-0.5 rounded;
}

:global(.markdown-content pre) {
    @apply bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto;
}
.markdown-content {
    overflow:hidden;

    box-shadow: 0px 0px 20px  20px #123;
    @apply bg-white p-8; 

}
:global(.scene-change) {
    @apply flex justify-center  my-8;

}
:global(.scene-change img) {
    @apply h-4;
}
:global(.poem){
    @apply        my-8;
}

:global(.poem p)  {
    text-align:center;

}
</style>
