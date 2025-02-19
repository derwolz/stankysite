<script>
import { onMount, mount } from 'svelte';
import CommentButton from './commentbutton.svelte';
import { writable } from 'svelte/store';

export let chapterSlug;
let components = [];
// Move show states to component level
let showStates = [];

onMount(() => {
    const paragraphs = document.querySelectorAll('.markdown-content p');
    
    // Initialize show states for each paragraph
    showStates = Array.from(paragraphs).map(() => writable(false));
    
    components = Array.from(paragraphs).map((p, index) => {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'relative';
        p.parentNode.insertBefore(wrapper, p);
        wrapper.appendChild(p);

        // Mount component with reactive show property
        const component = mount(CommentButton, {
            target: wrapper,
            props: {
                paragraphIndex: index,
                chapterSlug,
                show: false // Initial value
            }
        });

        // Subscribe to the store and update component props
        showStates[index].subscribe(value => {
            component.$set({ show: value });
        });
        console.log("addEventListener adding");
        // Add hover events
        p.addEventListener('mouseenter', () => {
            console.log("hello", p);
            showStates[index].set(true);
        });
        
        p.addEventListener('mouseleave', () => {
            showStates[index].set(false);
        });

        return component;
    });

    // Cleanup function
    return () => {
        components.forEach(component => {
            if (component.$destroy) component.$destroy();
        });
    };
});
</script>

