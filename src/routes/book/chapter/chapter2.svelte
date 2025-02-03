<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter1 from "$lib/books/ValkyrieXTruck/chapter-1.svx";
const data = {
    "title": "Escape",
    "slug": "chapter-2",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter1/runacar.webp",
                "/images/books/valkyriextruck/chapters/chapter1/voidanima.webp"
           ],
    "next": null,
    "previous": "chapter-1"
}
export function bindData() {
dispatch('dataUpdate', data);
}
onMount(()=>{
bindData();
})
</script>
<Chapter1/>
