<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter from "$lib/books/ValkyrieXTruck/chapter-6.svx";
const dispatch = createEventDispatcher();
const data = {
    "title": "Oasis",
    "slug": "chapter-6",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter6/road.webp",
                "/images/books/valkyriextruck/chapters/chapter6/littleamerica.webp",
                "/images/books/valkyriextruck/chapters/chapter6/runaphone.webp",
                "/images/books/valkyriextruck/chapters/chapter6/runagun.webp",
                "/images/books/valkyriextruck/chapters/chapter6/runashower.webp",
                "/images/books/valkyriextruck/chapters/chapter6/runaicecream.webp",
                "/images/books/valkyriextruck/chapters/chapter6/runaicecream2.webp"
            ],
    "imagePercs": [0,.10,.33, .63, .75, .84, .97 ],
    "next" : "chapter-7",
    "previous": "chapter-5"
}
function bindData(){
dispatch('bindData', data);
}
onMount(()=>{
bindData()
})
</script>
<Chapter/>
