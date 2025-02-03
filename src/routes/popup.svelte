<script>
import { fade, fly } from 'svelte/transition';
import { createEventDispatcher, onMount } from 'svelte';

// Set up our event dispatcher for communicating with parent components
const dispatch = createEventDispatcher();

// State management
let email = '';
let isValid = false;
let errorMessage = '';
let isVisible = true;

// Email validation using a regular expression
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle form submission
function handleSubmit() {
    if (validateEmail(email)) {
        dispatch('submit', { email });
        closePopup();
    } else {
        errorMessage = 'Please enter a valid email address';
    }
}

// Handle input changes
function handleInput(event) {
    email = event.target.value;
    isValid = validateEmail(email);
    if (isValid) {
        errorMessage = '';
    }
}

// Close the popup
function closePopup() {
    isVisible = false;
    dispatch('close');
}

// Handle keyboard events for accessibility
function handleKeydown(event) {
    if (event.key === 'Escape') {
        closePopup();
    }
}
let inputElement;
onMount(()=>{
inputElement.focus();
})
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if isVisible}
    <!-- Overlay -->
    <div 
        class="fixed font-tech inset-0 bg-black/50 flex items-center justify-center z-50"
        transition:fade
        on:click|self={closePopup}
        role="dialog"
        aria-labelledby="popup-title"
    >
        <!-- Popup content -->

        <div
            class="reveal bg-gray-900 p-6 h-72 w-full shadow-xl flex justify-center items-center"
        >
            
            <div class="max-w-md w-full uninvis " >
                <div class="flex justify-between items-center mb-4">
                    <h2 id="popup-title" class="text-xl font-semibold">What happen's next?</h2>
                    <button
                        on:click={closePopup}
                        class="text-gray-500 hover:text-gray-700"
                        aria-label="Close popup"
                    >
                        ×
                    </button>
                </div>

                <p class="text-gray-600 mb-4">
                    Stay updated with our latest news and updates.
                </p>

                <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            bind:value={email}
                            bind:this={inputElement}
                            on:input={handleInput}
                            class="w-full px-3 py-2 text-gray-800 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your@email.com"
                            required
                        />
                        {#if errorMessage}
                            <p class="text-red-500 text-sm mt-1" role="alert">
                                {errorMessage}
                            </p>
                        {/if}
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button
                            type="button"
                            on:click={closePopup}
                            class="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-orange-200 text-black hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            disabled={!isValid}
                        >
                            Join
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    </div>
{/if}
<style>
.reveal {
  animation: wipeIn 0.2s ease-in forwards, wipeY 0.3s ease-in-out forwards 0.4s;
  transform-origin: left;
    background:rgb(17, 24, 39);
  transform: scaleY(0.01);
}
.uninvis {
    opacity: 0;
    animation: show .2s ease-in forwards .8s;
}
@keyframes show {
from {
    opacity: 0;
}
to {
    opacity: 1;
}
}
@keyframes wipeY {
from {
transform: scaleY(0.01) scaleX(1);
}
to {
transform: scaleY(1) scaleX(1);
}
}
@keyframes wipeIn {
  from {
    transform: scaleX(0) scaleY(0.01);
  }
  to {
    transform: scaleX(1) scaleY(0.01);
  }
}
.font-tech {
font-family: var(--font-tech);
}
</style>
