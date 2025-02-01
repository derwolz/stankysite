// src/routes/books/[book]/[chapter]/+page.server.js
import { getChapter } from '$lib/server/markdown.server.js';

export async function load({ params }) {
    const { book, chapter } = params;
    const content = await getChapter(book, chapter);
    console.log("content", content);
    
    return content;
}
