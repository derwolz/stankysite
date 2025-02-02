// src/routes/api/subscribe/+server.js

import { error, json } from '@sveltejs/kit';
import { actions } from "$lib/db";

export async function POST({ request, locals }) {  // Add locals parameter
    try {
        // Pass both request and locals to the subscribe function
        const result = await actions.subscribe({ request, locals });
        
        if (result.error) {
            // Handle any error states from the action
            throw error(400, result.error);
        }

        // Return success response
        return json({ success: true, data: result });

    } catch (err) {
        console.error('Subscription error:', err);
        
        // Return proper error response
        return json(
            { 
                success: false, 
                error: err.message || 'Subscription failed'
            }, 
            { status: 400 }
        );
    }
}

