<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter1 from "$lib/books/ValkyrieXTruck/chapter-1.svx";
const dispatch = createEventDispatcher();
export let changeImage;
let data = {
    "title": "Girl hits boy",
    "slug": "chapter-1",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter1/runacar.webp",
                "/images/books/valkyriextruck/chapters/chapter1/voidanima.webp"
            ],
    "imagePercs": [0,.75],
    "next" : "chapter-2",
    "previous": null
}
export function bindData(d) {
dispatch('bindData', d);
}
onMount(()=>{
    bindData(data)

})

</script>
<Chapter1 changeImage={changeImage}/>

