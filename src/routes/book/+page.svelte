<script>
import { onMount } from 'svelte';
import Popup from "/src/routes/popup.svelte";

// Book Metadata
const metadata = {"Book": "ValkyrieXTruck", "chapters": 24, "planned":5, "slug": "valkyrie-x-truck", "released":1}

import Chapter1 from "./chapter/chapter1.svelte";
import Chapter2 from "./chapter/chapter2.svelte";
import Chapter3 from "./chapter/chapter3.svelte";
import Chapter4 from "./chapter/chapter4.svelte";
import Chapter5 from "./chapter/chapter5.svelte";

const Chapters = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5]

let current = 0;
let showPopup = false;
let scrollPercentage = 0;
let imageIndex = 0;
let previousImageIndex = 0;
let nextImageIndex = 0;
let isTransitioning = false;
let currentImageClass = 'current';
let previousImageClass = 'previous';
let nextImageClass = 'next';
let images = [];
let data;
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

function handleDataUpdate(event) {
    console.log("mounted", event.detail);
    data = event.detail;
    images = data.images;
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
 
async function handleEmailSubmit(event) {
    const email = event.detail.email;
    console.log('Submitting email:', email);
   let message; 
    try {
        // Create FormData object
       const formData = {email};
        const response = await fetch('/api/subscribe', {
            method: 'POST',
	    headers: {
				'Content-Type':'application/json'
			},

            // Remove the Content-Type header - it will be automatically set for FormData
            body: JSON.stringify({email})
        });
        
        const data = await response.json();
        
        if (response.ok) {
            message = data.message;
            error = '';
        } else {
            error = data.error || 'An error occurred';
            message = '';
        }
    } catch (e) {
        console.error('Submission error:', e);
        error = 'Failed to submit. Please try again.';
        message = '';
    }
}


function updateImage(scrollPerc) {
    const newIndex = getIndexFromPercentage(scrollPerc, data.images.length);
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
function handleSignUp(){

}
let popup

</script>
<svelte:window
    on:scroll={() => {
        scrollPercentage = getScrollPercentage();
        updateImage(scrollPercentage);
    }}
/>
<svelte:head>

    <title>{metadata.title || 'Chapter'}</title>
</svelte:head>

<div class="fixed top-20 -translate-x-1/4 left-[15%] w-screen -z-50 ">
    {#if previousImageIndex !== imageIndex}
        <img 
            src={images[previousImageIndex]}
            class="image h-screen absolute top-0 left-0  {previousImageClass}" 
            alt="Previous background"
        />
    {/if}
    <img 
        src={images[imageIndex]}
        class="image  h-screen absolute top-0 left-0 {nextImageClass}" 
        alt="Current background"
    />

</div>
<!-- Wrap the content in a container with proper styling -->
<article class="relative prose prose-lg max-w-3xl mx-auto px-4 py-8">
    <div class="markdown-content">  
        <svelte:component this={Chapters[current]} on:bindData={handleDataUpdate} />

    </div>

    <div class="absolute flex flex-col translate-x-3/4 right-0 top-0" >

        {#each Array(metadata.planned).fill() as _, i}
            <button class={
                    `min-w-17  my-12 p-4 text-white font-tech 
                    ${current == i+1 ? 'bg-orange-600 hover:bg-orange-800' :

                    i < metadata.released ? 'bg-gray-600 hover:bg-gray-900' :
                    'text-gray-800 bg-gray-900' }
                `}>
                {i+1}
            </button>
        {/each}
    </div>

    <nav class="flex justify-between mt-8 border-t pt-4">
        {#if metadata.previous}
            <a 
                href={`/books/${data.metadata.bookSlug}/${metadata.previous}`}
                class="text-blue-600 hover:text-blue-800"
            >
                ← Previous Chapter
            </a>
        {:else}
            <span></span>
        {/if}

        {#if metadata.next}
            <a 
                href={`/books/${metadata.bookSlug}/${metadata.next}`}
                class="text-blue-600 hover:text-blue-800"
            >
                Next Chapter →
            </a>
        {/if}
    </nav>


<div class="button-container">
<button on:click={()=>showPopup=true}>
Stay up to date
</button>
</article>
{#if showPopup}
		<Popup
			on:submit={handleEmailSubmit}
			on:close={() => showPopup = false}
		/>
{/if}
<style>


.button-container{
    position: relative;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
}
.button-container button {
    position: absolute;
    top: -16rem;
    margin: 3rem;
    padding: 1rem;
    width: 12rem;
    font: var(--font-tech);
    background-color: #000;
    color: #fff;
    border: 1px solid #fff;
    transition: background-color 1.4s ease-in-out, 
                color 1.4s ease-in-out,
                border-color 1.4s ease-in-out;
}
.button-container button:hover {
background-color: #fff;
color: #000;
border: 1px solid black;
}
.button-container button:active {
background: #990000;
color: #fff;
border: 1px solid #fff;
}
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
