<script>
import {onMount} from 'svelte';
import Chapter1 from "$lib/books/ValkyrieXTruck/chapter-1.svx";
const data = {
    "title": "Girl hits boy",
    "slug": "chapter-1",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter1/runacar.webp",
                "/images/books/valkyriextruck/chapters/chapter1/voidanima.webp"
            ]
}
function bindData(){
dispatch('bindData', data);
}
onMount(()=>{
bindData()
})
</script>
<Chapter1/>
