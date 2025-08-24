
// src/routes/api/config/+server.js
import { json } from '@sveltejs/kit';
import { BOOK_SITE_API_KEY } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    return json({
        apiKey: BOOK_SITE_API_KEY
    });
}
