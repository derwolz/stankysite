<script>
import { onMount, mount } from 'svelte';
import CommentButton from './commentbutton.svelte';
import { writable } from 'svelte/store';

export let chapterSlug;
let components = [];

onMount(() => {
    const paragraphs = document.querySelectorAll('.markdown-content p');
    paragraphs.forEach((p, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative';
        
        p.parentNode.insertBefore(wrapper, p);
        wrapper.appendChild(p);
        
        const showState = writable(false);
        
        const component = mount(CommentButton, {
            target: wrapper,
            props: {
                paragraphIndex: index,
                chapterSlug,
                show: false
            }
        });
        
        p.addEventListener('mouseenter', function() {
            console.log("Mouse has entered");
            this.component = component;
            console.log("what is this?",this.component, component)
            this.show = false;
        });
        
        p.addEventListener('mouseleave', () => {
        });
        
        components.push(component);
    });
    
    return () => {
        components.forEach(component => {
            if (component.target) component.target.remove();
        });
    };
});
</script>
