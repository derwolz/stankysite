<script>
import { onMount } from 'svelte';
import Popup from "/src/routes/popup.svelte";

// Book Metadata
const metadata = {"Book": "ValkyrieXTruck", "chapters": 24, "planned":5, "slug": "valkyrie-x-truck", "released":5}

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
let data = {previous:false, next:false, imagePercs: [0]};

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
    data = event.detail;
    images = data.images;
}

function inView(node, options = {}) {
    const {
        root = null,
        rootMargin = '0px',
        threshold = .3,
        once = true,
        onIntersect = () => {},
    } = options;

    // Create the observer
    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add class when element comes into view

                    entry.target.classList.remove('unseen');	
                    requestAnimationFrame(()=>{
                        entry.target.classList.add('drop-reveal');
                    });
                    onIntersect(entry);
                    // If once is true, disconnect after first intersection
                    if (once) {
                        observer.disconnect();
                    }
                } else {
                }
            });
        },
        {
            root,
            rootMargin,
            threshold,
        }
    );

    // Start observing the node
    observer.observe(node);

    return {
        destroy() {
            // Cleanup when component is destroyed
            observer.disconnect();
        },
        update(newOptions) {
            // Handle dynamic options updates
            options = { ...options, ...newOptions };
        },
    };
}

function getIndexFromPercentage(percentage, arrayLength) {
    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    // Convert percentage to decimal (0-1)
    const decimal = clampedPercentage / 100;
    console.log(decimal);
    // Calculate index
    // Subtract 0.001 to ensure 100% returns last index rather than undefined
    let idx = 0;
    for (let i = 0; i < data.imagePercs.length; i++){
        if (decimal > data.imagePercs[i])
    {
            idx = i
        }
    }
    return idx
}

async function handleEmailSubmit(event) {
    const email = event.detail.email;
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

function changeImage(image){
    console.log('hi', image);
}

let chapterMax = 5;
function handleSignUp(){

}
$: data
let popup
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function handleNavigate(page){
    let p = page;
    p = p 
    p = p >= metadata.released ? metadata.released -1  : p;
    current = p;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}
</script>
<svelte:window
    on:scroll={() => {
        scrollPercentage = getScrollPercentage();
        updateImage(scrollPercentage);
    }}
/>
<svelte:head>

    <title>{metadata.title || 'Chapter'}</title>
<script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></script><script src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz"></script><script>window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));window.amplitude.init('d2ea11d4e803a7a46628f259f095a69c', {"autocapture":{"elementInteractions":true}});</script>

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
        <svelte:component this={Chapters[current]} on:bindData={handleDataUpdate} parentData={data} changeImage={changeImage}/>

    </div>

    <div class="absolute flex flex-col translate-x-3/4 right-0 top-0" >

        {#each Array(metadata.planned).fill() as _, i}
            <button class={
                `min-w-17  my-12 p-4 text-white font-tech 
${current == i ? 'bg-orange-600 hover:bg-orange-800' :

i < metadata.released ? 'bg-gray-600 hover:bg-gray-900' :
'text-gray-800 bg-gray-900' }
`}
                on:click={()=>handleNavigate(i)}
            >
                {i+1}
            </button>
        {/each}
    </div>

    <nav class="flex justify-between mt-8 border-t pt-4">
        {#if data.previous}
            <button 
                on:click={()=>{handleNavigate(current-1)}}
                class="text-blue-600 hover:text-blue-800"
            >
                ← Previous Chapter
            </button>
        {:else}
            <span></span>
        {/if}

        {#if data.next}
            <button 
                on:click={()=>{handleNavigate(current+1)}}
                class="text-blue-600 hover:text-blue-800"
            >
                Next Chapter →
            </button>
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
    @apply text-2xl md:text-3xl font-bold mb-6;
}

:global(.markdown-content h2) {
    @apply text-xl md:text-2xl font-bold mb-4 mt-8;
}

:global(.markdown-content p) {
    @apply mb-1 text-xs md:text-base leading-relaxed font-serif text-justify indent-6 ;

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
    @apply    italic    my-8;
}

:global(.poem p)  {
    text-align:center;

}
</style>
