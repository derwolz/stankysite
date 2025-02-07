// routes/api/comments/+server.js
import { json } from '@sveltejs/kit';
import db from '../../../server/db.js';

export async function GET({ params }) {
    const { chapter, paragraphIndex } = params;
    
    const comments = db.prepare(`
        SELECT * FROM comments 
        WHERE chapter = ? AND paragraph_index = ?
        ORDER BY timestamp DESC
    `).all(chapter, paragraphIndex);
    
    return json(comments);
}

export async function POST({ request }) {
    const { chapter, paragraphIndex, name, comment } = await request.json();
    
    try {
        db.prepare(`
            INSERT INTO comments (chapter, paragraph_index, name, comment)
            VALUES (?, ?, ?, ?)
        `).run(chapter, paragraphIndex, name, comment);
        
        return json({ success: true });
    } catch (error) {
        return json({ error: 'Failed to save comment' }, { status: 500 });
    }
}
