<script>
import { onMount } from 'svelte';

export let paragraphIndex;
export let chapterSlug;
export let show = false;

let showComments = false;
let comments = [];
let newComment = '';
let userName = '';
let loading = false;

async function loadComments() {
    loading = true;
    try {
        const response = await fetch(`/api/comments/${chapterSlug}/${paragraphIndex}`);
        comments = await response.json();
    } catch (err) {
        console.error('Failed to load comments:', err);
    }
    loading = false;
}

async function submitComment() {
    if (!newComment.trim() || !userName.trim()) return;
    
    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chapter: chapterSlug,
                paragraphIndex,
                name: userName,
                comment: newComment
            })
        });
        
        if (response.ok) {
            await loadComments();
            newComment = '';
        }
    } catch (err) {
        console.error('Failed to submit comment:', err);
    }
}

function toggleComments() {
    showComments = !showComments;
    if (showComments) {
        loadComments();
    }
}

onMount(() => {
    // Initial setup if needed
});
</script>
{#if !show}
<div class="absolute " >
    <button 
        class="absolute  -left-8 top-0 opacity-100 bg-gray-800 hover:opacity-100 transition-opacity"
        on:click={toggleComments}
    >
        💬
    </button>
    
    {#if showComments}
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white p-4 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold">Comments</h3>
                    <button class="text-gray-500" on:click={toggleComments}>✕</button>
                </div>
                
                {#if loading}
                    <div class="text-center">Loading...</div>
                {:else}
                    <div class="space-y-4 mb-4">
                        {#each comments as comment}
                            <div class="border-b pb-2">
                                <div class="font-bold">{comment.name}</div>
                                <div>{comment.comment}</div>
                                <div class="text-sm text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
                
                <div class="space-y-2">
                    <input
                        type="text"
                        bind:value={userName}
                        placeholder="Your name"
                        class="w-full p-2 border rounded"
                    />
                    <textarea
                        bind:value={newComment}
                        placeholder="Add a comment..."
                        class="w-full p-2 border rounded"
                        rows="3"
                    ></textarea>
                    <button
                        on:click={submitComment}
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={!newComment.trim() || !userName.trim()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
{/if}
