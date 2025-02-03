// src/lib/server/markdown.js
import { error } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import { readFileSync } from 'node:fs';
import { join } from 'path';

 function getMetadataJSON(book) {
    try{
        const data = JSON.parse(readFileSync(`src/lib/books/${book}/metadata.json`, 'utf-8'));
        return data;
    } catch (loadingError) {
        console.error("failed to load metadata", loadingError);
        throw error(404, "Book not found");
    }
}

async function getContent(book, chapter) {
    try {
        // Read the raw markdown file instead of importing it
        const rawContent = readFileSync(`src/lib/books/${book}/${chapter}.svx`, 'utf-8');
        // Compile the markdown to HTML
        const compiled = await compile(rawContent, {
            extensions: ['.svx', '.md']
        });
        return compiled?.code || ''; // Return the compiled HTML string
    } catch (loadingError) {
        console.error("failed to load content", loadingError);
        throw error(404, "Chapter not found");
     
    }
}

export async function getAbout() {
    try {
        const rawContent = readFileSync(`${"src/lib/about.svx"}`, 'utf-8');
        const compiled = await compile(rawContent, {
            extensions: ['.svx', '.md']
            });
        return compiled?.code || '';
    } catch (loadingError) {
        console.error("failed to load content", loadingError);
        throw error(404, "You done messed up a a ron");
    }
}

export async function getChapter(book, chapter) {
    try {
        const metadata = getMetadataJSON(book);
        const content = await getContent(book, chapter);
        return {
            metadata: {
                title: metadata.chapters[chapter].title,
                bookTitle: metadata.title,
                author: metadata.author,
                description: metadata.description,
                images: metadata.chapters[chapter].images
            },
            content: content,
            navigation: {
                current: chapter,
                released: Object.keys(metadata.chapters).length,
                planned: metadata.planned,
                total: metadata.totalChapters,
                index: parseInt(chapter.replace('chapter-','')),
                next: parseInt(chapter.replace('chapter-', '')) < metadata.totalChapters 
                    ? `chapter-${parseInt(chapter.replace('chapter-', '')) + 1}` 
                    : null,
                previous: parseInt(chapter.replace('chapter-', '')) > 1
                    ? `chapter-${parseInt(chapter.replace('chapter-', '')) - 1}`
                    : null
            }
        };
    } catch (e) {
        console.error('Error in getChapter:', e);
        throw error(404, `Failed to load chapter: ${e.message}`);
    }
}


