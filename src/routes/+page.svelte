<script>

import Counter from './Counter.svelte';
import { onMount } from 'svelte';
import CharacterCard from './charactercard.svelte'; 
import { goto } from '$app/navigation';
import Popup from './popup.svelte';
import ProgressBar from './progress.svelte';

    let showPopup = false;
const characters = [{
	position:"right",
	title:"Chariot True",
	altTitle:"Errant Steel",
	name:"Truck",
	img:"/images/books/valkyriextruck/characters/truck.webp",
	glow:"blue",
	description:"Sanctuary — in a world where none exists",
	altBg: "/images/books/valkyriextruck/characters/truck2.webp",
	altDescription:"Only a temporary reprieve from a world gone mad",
	h:["37rem", "27rem", "15rem"],
	w:["30rem","22rem","12rem"],

//const labels = ['Intelligence', 'Strength', 'Speed', 'Defense', 'Luck'];
	stats:[0, 60, 70, 80, 30]
},{
		position:"left",
		title:"Maiden of Light",
		altTitle:"Maiden of Spite",
		altDescription:"However, even gods are powerless against this fate.",
		name:"Runa",
		img:"/images/books/valkyriextruck/characters/Runa.webp",
		altBg:"/images/books/valkyriextruck/characters/Runa2.webp",
		glow:"gold",
		h:["37rem", "27rem", "15rem"],
		w:["30rem","22rem","12rem"],
		description:"Not all angels come with wings — some arrive with loaded guns.",

		stats:[50, 90, 80, 60, 0]
	},{
		position:"right",
		title:"Man of Sorrow",
		altTitle:"Harrowed Man",
		altDescription: "But sacrificing everything is not enough",
		name:"Max",
		img:"/images/books/valkyriextruck/characters/Max.webp",
		altBg:"/images/books/valkyriextruck/characters/Max2.webp",
		glow:"green",
		h:["37rem", "27rem", "15rem"],
		w:["30rem","22rem","12rem"],
		description:"Survival requires the sacrifice of everything.",

	stats:[80,24,30,14,100]
	}
]


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

function handleRead() {
		const a = document.createElement("a");
		a.href = `/book/`;
		a.click();
}
</script>

<svelte:head>
	<title>Valkyrie X sf Truck</title>
	<meta name="description" content="A man gets hit by a truck, setting off the end of the world. The driver, a woman by the name of Runa saves his life, but to what end? Read more in this action packed book by first time novelist, King Stanky" />

<script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></script><script src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz"></script><script>window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));window.amplitude.init('d2ea11d4e803a7a46628f259f095a69c', {"autocapture":{"elementInteractions":true}});</script>
</svelte:head>

<section>
	<div class="w-full h-screen relative ">
	<h1 class="absolute sm:x-16 sm:yb-0 yb-64 flex  justify-center center-items h-full w-full ">
		<!-- <img class="object-contain" src="/images/books/valkyriextruck/ValkyrieLogo3.webp" /> -->
		<video class="mix-blend-normal bg-transparent" autoplay muted >
			    <source src="/images/books/valkyriextruck/valkyrielogo.webm" type="video/webm">
				    Your browser does not support the video tag.
		</video>

	</h1>
	<div class="bottom-1/4 absolute h-16 items-center  flex justify-center w-full font-tech">
		<button on:click={() => showPopup = true} class="mx-4 h-full flex justify-content items-center border  border-radius-sm border-gray-800 hover:bg-blue-900 " ><span class="drop-reveal px-2">Join the WaitList</span></button>
		<button on:click={handleRead} class="border mx-4 h-full flex justify-content text-center radius-radius-sm text-black  border-gray-800 bg-orange-200 hover:bg-gray-900 hover:text-gray-300 items-center "><span class="drop-reveal px-2">Read the First Chapter</span></button>
		</div>

	</div>
	<div class="w-3/4 sm:mb-0  flex flex-col h-screen  justify-around font-tech">
		
		<div class="flex justify-center  align-center w-full h-16" >	
			<img class="unseen" use:inView src="/images/books/valkyriextruck/tiremark-s.webp" height='16px' width='16px' alt="tire tracks"	/>
		</div>	
			<h2 class=" text-center min-y-16 relative text-4xl poetic">
			<span class="unseen" use:inView> A Deadly Encounter	</span>


			</h2>
		<div use:inView class=" unseen p-2  min-w-sm mx-0  text-center bg-gray-800 md:text-lg/8 sm:text-sm/8 text-xs/8 " >

				<p>Wheels burning, ever churning, a maiden of light yet yearning.  </p>
				<p>Before her, man of sorrow lay, arrived now his numbered day. </p>
				<p>As she aims her chariot true, Fetter’s mind has yet its due. </p>
				<p>By helm his riven future sprawled, shattered glass his thread enthralled.</p>
				<p>Sorrow spared by padded blow, a common fellow now in stow.</p>
			<p>Thread rimple, answer simple, she lay gun at sorrow’s temple.</p>
			</div>

		<h2 use:inView class=" sm:text-8xl text-5xl unseen text-center my-0">
			Reticulate Fates
		</h2>

			</div>

		<div class="w-full font-tech" > 
		{#each characters as character, c} 
		<CharacterCard data={character} /> 
		{/each} 
	 </div> 
	<div class="h-[90vh] sm:mt-24 mt-0 mb-16 flex flex-col justify-around center-items ">
	<h2 use:inView class="lg:text-8xl md:text-8xl sm:text-6xl text-6xl unseen text-center my-8 font-tech">
			Fettered Souls
	</h2>
	<div use:inView class="p-2 unseen min-w-sm text-center font-tech bg-gray-800 md:text-lg/8 sm:text-sm/8 text-xs/8" >
				<p>Gun's roar crying, acrid scent rising, cabin now capsizing  </p>
				<p>Swirling chaos, man unbound dumping free, his mind confound</p>
				<p>Maiden fastened, flailing still, chariot tumbels 'gainst her will.</p>
				<p>Blades collide, errant steel screeches, coppered fluid, man's head breaches.</p>
				<p>Severed thread, sorrow fades, maiden's radiance, on him cascades.</p>
			<p>Harrowed Man's blight, amidst prism light, wounded by Maiden of Spite</p>
			</div>
	<h2 use:inView class="unseen text-center font-tech w-auto  my-8 text-4xl">
		Unseen plans
	</h2>
		<div class="flex justify-center align-center w-full">
	<img use:inView class="unseen" src="/images/books/valkyriextruck/tiremark-s.webp" width="20" style="transform:rotate(180deg);"/>
			</div>
		</div>
	<div class="w-full flex justify-around items-center mb-8">
		<button on:click={handleRead} class="hover:bg-orange-800 py-4 px-6 bg-orange-600 text-white">Read Chapter 1</button>
		</div>
	{#if showPopup}
		<Popup
			on:submit={handleEmailSubmit}
			on:close={() => showPopup = false}
		/>
	{/if}
</section>

<style lang="css">
section {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
flex: 0.6;
}

h1 {
width: 100%;
}

.font-tech {
font-family: var(--font-tech);
}
.invisible {
display: None;
}
.poetic::before {
content: "";
position: absolute;
top: 0;
left: 50%;
transform: translateX(-50%);
width: 1px;
height: 40px;
background-color:(var(--color-text));
}
.poetic {
}
.drop-reveal {
  animation: dropReveal 0.9s ease-in-out forwards,
             removeBorder 0.1s ease-in-out 0.9s forwards,
             opacityFlicker 0.2s ease-in-out 0.5s;
  transform-origin: top;
  opacity: 0;
visibility: visible;
}


@keyframes removeBorder {
  to {
border: 0px solid rgba(0,0,0,0);
    box-shadow: 0px 0px 0px rgba(0,0,0,0);
  }
}

@keyframes dropReveal {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes opacityFlicker {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }

}
.unseen {
opacity: 0;
transform: scaleY(0);
}
</style>

