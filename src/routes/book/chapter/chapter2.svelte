<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter2 from "$lib/books/ValkyrieXTruck/chapter-2.svx";
export let parentData;
const dispatch = createEventDispatcher();
const data = {
    "title": "Escape",
    "slug": "chapter-2",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter2/Max1.webp",
                "/images/books/valkyriextruck/chapters/chapter2/doctor.webp",
                "/images/books/valkyriextruck/chapters/chapter2/hallway.webp",
                "/images/books/valkyriextruck/chapters/chapter2/officer.webp"
           ],
    "imagePercs": [0,.18,.48, .80 ],
    "next": "chapter-3",
    "previous": "chapter-1"
}
export function bindData() {
dispatch('bindData', data);
}

onMount(()=>{

bindData();
})
</script>
<Chapter2/>
