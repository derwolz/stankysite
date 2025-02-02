<script>
export let data;
import {onMount} from 'svelte'
const { name, title, glow, altTitle, altBg, altDescription ,img, description, position} = data;
import Wiper from "./wiper.svelte"
let altActive = false;
let bgImage;
let activeDesc = description;
let wipeDirection;
let mountAnimation = false;
let windowWidth; 
let dimensions = { width: 0, height: 0 };

function calculateSize() {
    if (!windowWidth) return;
    
    let width;
    if (windowWidth < 600) {
        width = Math.min(windowWidth * 0.9, 300);
    } else if (windowWidth < 960) {
        width = Math.min(windowWidth * 0.6, 400);
    } else {
        width = Math.min(windowWidth * 0.4, 500);
    }
    
    // Maintain 3:4 aspect ratio
    const height = (width * 4) / 3;
    
    dimensions = { width , height };
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
					const hiddenDiv = node.nextElementSibling;
					if (hiddenDiv) {
						// Add class when element comes into view
						hiddenDiv.classList.remove('hidden');
						altActive = false;
						setTimeout(()=>{
							mountAnimation = true;
						},300);
						setTimeout(()=>{mountAnimation=false;},900);
					}
					onIntersect(entry);
					// If once is true, disconnect after first intersection
					if (once) {
						observer.disconnect();
					}
				} else {
					// Remove class when element leaves viewport (if once is false)
					altActive = true;
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


onMount(() => {
    windowWidth = window.innerWidth;
    calculateSize();

    const handleResize = () => {
        windowWidth = window.innerWidth;
        calculateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
});
$: endAnimation = false;
function activateAlt(b){
	altActive = b;
	if (endAnimation == true) {return;}
	endAnimation = true;
	if (!b) {
		bgImage.classList.add("clear");
		setTimeout(()=>{
			endAnimation = false;
		}, 450)
	}
	else{
		bgImage.classList.remove("clear");
		setTimeout(()=> {
			endAnimation = false;
		},450)
	}
}
function swapText(){
	activeDesc =( activeDesc !== description) ?  description : altDescription 
}
let namePosition;
$: namePosition = windowWidth >=730 ? `${position}-name` : windowWidth >= 601 ? 'bottom-name' : 'sm-bottom-name';
</script>
<div use:inView class="my-8 min-h-16 " />
<div class="hidden my-0    flex flex-col justify-center items-center" >
	<div id={`${name}`} class={`relative min-w-full h-[80vh]   ${position}-head `}>

		<div class={`absolute t-0   overflow-hidden  h-32 flex justify-content items-center  ${namePosition}`}>
			<h3 class=" text-6xl    px-2 t-1/2 "> 
				{name}
			</h3>
			<Wiper trigger={mountAnimation} zeroed={true} direction={wipeDirection} duration={500}/>

		</div>
		<div style={`width: ${dimensions.width}px; height: ${dimensions.height}px;`} class={` ${glow}-shadow character-box overflow-hidden absolute   ${position}-img`}>
		</div>
		
		
		{#if !altActive}
			<div class="xl:top-5 lg:top-5 md:top-5 sm:top-5 -top-20 stack absolute min-w-full   text-center font-tech 96" style="--stacks: 3;">
				<span class="text-7xl" style="--index: 0;" >{title}</span>
				<span class="text-7xl" style="--index: 1;" >{title}</span>
				<span class="text-7xl" style="--index: 2;" >{title}</span>
			</div>
		{:else}
			<div class=" xl:top-5 lg:top-5 md:top-5 sm:top-5 -top-20 stack absolute min-w-full   text-center font-tech 96" style="--stacks: 3;">
				<span class="text-7xl" style="--index: 0;">{altTitle}</span>
				<span class="text-7xl" style="--index: 1;">{altTitle}</span>
				<span class="text-7xl" style="--index: 2;">{altTitle}</span>
			</div>
		{/if}	

		<div style={`width: ${dimensions.width}px; height: ${dimensions.height}px;`} class={`absolute  w-full bg-div2 overflow-hidden ${position}-img `} on:mouseenter={()=>{activateAlt(true)}} on:mouseleave={()=>{activateAlt(false)}}>

			<img bind:this={bgImage}  src={altBg} style={`width: ${dimensions.width}px; height: ${dimensions.height}px;`} class="bg-image z-4 clear blur-sm absolute t-0"/> 

			<img  src={img} style={`width: ${dimensions.width}px; height: ${dimensions.height}px;`} class="z-5 absolute"/> 
			<Wiper trigger={mountAnimation} zeroed={true} direction={position} duration={499}/>
		</div>



		<div class={`my-16  absolute min-h-32 min-w-32 overflow-hidden bg-gray-800 ${position}-span`}>

			<Wiper trigger={endAnimation} triggerEnd={()=>{swapText()}}  direction={position} duration={900}>


			</Wiper  >
			<div class={` p-3 bg-gray-800  justify max-w-40 max-h-40 text-left w-full h-full`}><span >
				{activeDesc}
			</span>
			</div>
		</div>

	</div>


</div>
<style>
.hidden { display: none; }
h2 {

font-family: var(--font-tech);

}
h3 {
font-family: var(--font-tech);
}
.bg-image {
transition: all .3s ease-in-out;
}
.clear {
opacity: 0;
}

.left-name  {
transform:rotate(90deg);
left: 65%;
top: 25%;
}
.right-name  {
transform:rotate(270deg);
right:65%;
top:25%;
}
.left-head h2 {
padding-left: 30em;
}
.left-img {
left:0%;	

}
.right-img {
right: 00%;
}
.left-span {
right: 45%;
top: 24%;
}
.right-span {
right: 40%;
top: 24%;
}
.bg-div2{
background-image: var(--bg-alt-image);
background-position:center;
background-size:cover
}
.bg-div {
background-image: var(--bg-image);
background-size:cover;
background-position:center;
}

.stack {
display: grid;
grid-template-columns: 1fr;
}

.stack span {
font-weight: bold;
grid-row-start: 1;
grid-column-start: 1;
--stack-height: calc(100% / var(--stacks, 3) - 1px);
--inverse-index: calc(calc(var(--stacks, 3) - 1) - var(--index));
--clip-top: calc(var(--stack-height) * var(--index));
--clip-bottom: calc(var(--stack-height) * var(--inverse-index));
clip-path: inset(var(--clip-top) 0 var(--clip-bottom) 0);
animation: stack 340ms cubic-bezier(.46,.29,0,1.24) 1 backwards calc(var(--index) * 120ms), glitch 2s ease infinite 2s alternate-reverse;
}
/* Chariot True (Truck) Box */
.blue-shadow {
--glow-color:0, 71, 171, 0.4; /* Cobalt blue with transparency */
}

/* Runa (Maiden of Light) Box */
.gold-shadow {
--glow-color: 255, 215, 0, 0.5; /* Subtle gold undertone */
}

/* Max (Man of Sorrow) Box */
.green-shadow {
--glow-color: 46, 169, 87, 0.6; /* Sea green */
}

.character-box {
box-shadow: 0 0 20px rgba(var(--glow-color));
animation: glowPulse 3s ease-in-out infinite;
border: solid 1px  rgba(var(--glow-color));
border-radius: .4%;
}



@keyframes glowPulse {
0% { box-shadow: 0 0 20px rgba(color, 0.2); }
50% { box-shadow: 0 0 30px rgba(color, 0.4); }
100% { box-shadow: 0 0 20px rgba(color, 0.2); }
}

.stack span:nth-child(odd) { --glitch-translate: 8px; }
.stack span:nth-child(even) { --glitch-translate: -8px; }

@keyframes stack {
0% {
opacity: 0;
transform: translateX(-50%);
text-shadow: -2px 3px 0 red, 2px -3px 0 blue;
}
60% {
opacity: 0.5;
transform: translateX(50%);
}
80% {
transform: none;
opacity: 1;
text-shadow: 2px -3px 0 red, -2px 3px 0 blue;
}
100% {
text-shadow: none;
}
}

.bottom-name {
transform: rotate(0deg);
left:0; 
right:0;
top:500px;
justify-content:center;
text-align:center;
width:100%;
}

.sm-bottom-name {
transform: rotate(0deg);
left:0;
right:0;
top:370px;
justify-content:center;
text-align:center;
width:100%;
}

@keyframes glitch {
0% {
text-shadow: -2px 3px 0 red, 2px -3px 0 blue;
transform: translate(var(--glitch-translate));
}
2% {
text-shadow: 2px -3px 0 red, -2px 3px 0 blue;
}
4%, 100% {  text-shadow: none; transform: none; }
}
</style>
