<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter1 from "$lib/books/ValkyrieXTruck/chapter-1.svx";
const dispatch = createEventDispatcher();
let data = {
    "title": "Girl hits boy",
    "slug": "chapter-1",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter1/runacar.webp",
                "/images/books/valkyriextruck/chapters/chapter1/voidanima.webp"
            ],
    "next" : null,
    "previous": null
}
export function bindData(d) {
dispatch('bindData', d);
}
onMount(()=>{
    console.log("mounting", data);
    bindData(data)

})
</script>
<Chapter1/>
