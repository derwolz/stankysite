// src/routes/api/subscribe/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Email validation helper
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
    try {
        const { email, source = 'website' } = await request.json();
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            return json({ 
                error: 'Invalid email address' 
            }, { status: 400 });
        }

        // Get client IP address
        const ipAddress = getClientAddress();

        // Store consent data (customize based on your needs)
        const consentData = JSON.stringify({
            timestamp: new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: request.headers.get('user-agent'),
            consent_version: '1.0'
        });

        // Check if email already exists
        const existing = await platform.env.DB.prepare(
            'SELECT id, status FROM email_subscribers WHERE email = ?'
        )
        .bind(email)
        .first();

        if (existing) {
            if (existing.status === 'unsubscribed') {
                // Resubscribe if previously unsubscribed
                await platform.env.DB.prepare(
                    `UPDATE email_subscribers 
                     SET status = 'active', updated_at = CURRENT_TIMESTAMP 
                     WHERE email = ?`
                )
                .bind(email)
                .run();

                return json({ 
                    message: 'Subscription renewed successfully' 
                });
            }
            
            return json({ 
                error: 'Email already subscribed' 
            }, { status: 400 });
        }

        // Insert new subscriber
        const { success } = await platform.env.DB.prepare(
            `INSERT INTO email_subscribers (
                email, status, source, ip_address, consent_data
            ) VALUES (?, 'active', ?, ?, ?)`
        )
        .bind(email, source, ipAddress, consentData)
        .run();

        if (!success) {
            throw new Error('Failed to insert subscriber');
        }

        return json({ 
            message: 'Successfully subscribed' 
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return json({ 
            error: 'Failed to process subscription' 
        }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request, platform }) => {
    return json({error: "Not available"},{status:500});
    try {
        const { email } = await request.json();

        if (!email || !isValidEmail(email)) {
            return json({ 
                error: 'Invalid email address' 
            }, { status: 400 });
        }

        // Update subscriber status to unsubscribed
        const { success } = await platform.env.DB.prepare(
            `UPDATE email_subscribers 
             SET status = 'unsubscribed', 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE email = ?`
        )
        .bind(email)
        .run();

        if (!success) {
            return json({ 
                error: 'Email not found' 
            }, { status: 404 });
        }

        return json({ 
            message: 'Successfully unsubscribed' 
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        return json({ 
            error: 'Failed to process unsubscribe request' 
        }, { status: 500 });
    }
};

// Optional: Endpoint to get subscription status
export const GET: RequestHandler = async ({ url, platform }) => {

    return json({error: "Not available"},{status:500});
    try {
        const email = url.searchParams.get('email');

        if (!email || !isValidEmail(email)) {
            return json({ 
                error: 'Invalid email address' 
            }, { status: 400 });
        }

        const subscriber = await platform.env.DB.prepare(
            'SELECT status, subscribed_at FROM email_subscribers WHERE email = ?'
        )
        .bind(email)
        .first();

        if (!subscriber) {
            return json({ 
                error: 'Email not found' 
            }, { status: 404 });
        }

        return json(subscriber);

    } catch (error) {
        console.error('Status check error:', error);
        return json({ 
            error: 'Failed to check subscription status' 
        }, { status: 500 });
    }
};
