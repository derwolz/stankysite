<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter from "$lib/books/ValkyrieXTruck/chapter-3.svx";

const dispatch = createEventDispatcher();
const data = {
    "title": "The Gilded Cage",
    "slug": "chapter-3",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter3/john.webp",
                "/images/books/valkyriextruck/chapters/chapter3/runa.webp",
                "/images/books/valkyriextruck/chapters/chapter3/voidanima.webp",
                "/images/books/valkyriextruck/chapters/chapter3/church.webp"
            ],
    "imagePercs": [0,.28,.52, .60 ],
   "next": "chapter-4",
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
