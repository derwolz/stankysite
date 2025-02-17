<script>
import {onMount, createEventDispatcher} from 'svelte';
import Chapter from "$lib/books/ValkyrieXTruck/chapter-4.svx";
const dispatch = createEventDispatcher();
const data = {
    "title": "Depature",
    "slug": "chapter-4",
    "images": [
                "/images/books/valkyriextruck/chapters/chapter4/max.webp",
                "/images/books/valkyriextruck/chapters/chapter4/barbara.webp",
                "/images/books/valkyriextruck/chapters/chapter4/sally.webp",
                "/images/books/valkyriextruck/chapters/chapter4/runa.webp",
                "/images/books/valkyriextruck/chapters/chapter4/house.webp"
            ],
    "imagePercs": [0,.10,.27, .51, .69 ],
    "next": null,
    "previous": "chapter-3"
}
function bindData(){
dispatch('bindData', data);
}
onMount(()=>{
bindData()
})
</script>
<Chapter/>
