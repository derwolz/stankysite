<script>
import { onMount } from 'svelte';

  export let zeroed = false;
  export let direction = 'right';
  export let duration = 500;
  export let trigger = false;
  export let endAnimation = false;
  export let triggerEnd;
  let isWiping = false;
  let isQueued = false;
  let skipTransition = false;
  let current;


$: if (trigger && !isWiping && !isQueued) {
  startWipe();
} else if (trigger && isWiping && !isQueued) {
  isQueued = true
  setTimeout(()=>{
  startWipe()
    isQueued = false;
  },duration);
}

function startWipe() {
  skipTransition = false;
  isWiping = true;
zeroed = false;  
  setTimeout(() =>{
  triggerEnd()
  }, duration/1.7);
  setTimeout(() => {
    isWiping = false;
    skipTransition = true;
    endAnimation = true;
  }, duration);
}


  $: oppositeDirection = {
    right: 'left',
    left: 'right',
    up: 'down',
    down: 'up'
  }[direction];

  $: transform = {
    right: `translateX(-200%) scale(${isWiping ? 2.0 : 1})`,
    left: `translateX(200%) scale(${isWiping ? 2.0 : 1})`,
    up: `translateY(200%) scale(${isWiping ? 2.0 : 1})`,
    down: `translateY(-200%) scale(${isWiping ? 2.0 : 1})`
  };

  $: wipeStyle = `
transform: ${isWiping ? transform[oppositeDirection] : zeroed ? "none" :  transform[direction]};
transition: ${skipTransition ? 'none' : `transform ${duration}ms ease-in, opacity ${duration/2}ms ease-in`};
transform-origin: center;
`;
</script>

<div class="wiper text-black" style={wipeStyle}>
  <slot></slot>
</div>

<style>
.wiper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  overflow: hidden;
}
.reveal {
  width: 100%;
  height: 100%;
}
</style>
