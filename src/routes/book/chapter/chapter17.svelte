<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter from "$lib/books/ValkyrieXTruck/chapter-5.svx";
const dispatch = createEventDispatcher();
const data = {
    "title": "Oasis",
    "slug": "chapter-5",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter5/road.webp",
                "/images/books/valkyriextruck/chapters/chapter5/littleamerica.webp",
                "/images/books/valkyriextruck/chapters/chapter5/runaphone.webp",
                "/images/books/valkyriextruck/chapters/chapter5/runagun.webp",
                "/images/books/valkyriextruck/chapters/chapter5/runashower.webp",
                "/images/books/valkyriextruck/chapters/chapter5/runaicecream.webp",
                "/images/books/valkyriextruck/chapters/chapter5/runaicecream2.webp"
            ],
    "imagePercs": [0,.10,.33, .63, .75, .84, .97 ],
    "next" : null,
    "previous": "chapter-4"
}
function bindData(){
dispatch('bindData', data);
}
onMount(()=>{
bindData()
})
</script>
<Chapter/>
