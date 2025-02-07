<script>
import {onMount} from 'svelte';
import Chapter from "$lib/books/ValkyrieXTruck/chapter-3.svx";

const data = {
    "title": "The Gilded Cage",
    "slug": "chapter-3",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter1/runacar.webp",
                "/images/books/valkyriextruck/chapters/chapter1/voidanima.webp"
            ],
   "next": null,
    "previous": "chapter-2"
}
function bindData(){
dispatch('bindData', data);
}
onMount(()=>{
bindData();
})
</script>
<Chapter/>
