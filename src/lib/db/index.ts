// src/lib/db/index.ts
import Database from 'better-sqlite3';
import { fail } from '@sveltejs/kit';


/** @type {import('./$types').Actions} */
export const actions = {
  subscribe: async ({ request, locals }) =>{
    const data = await request.formData();
    const email = data.get('email');
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!email) {
      return fail(400, {email, missing: true});
    }
    try {
      const stmt = locals.db.prepare(`
INSERT INTO email_subscriptions (id, email, ip_address)
VALUES (?, ?, ?)
`);
      const id = Date.now()
      stmt.run(id, email, ip);
      return {success: true}
    } catch (error) {
      console.error('Subscription error:', error);
      return fail(500, {email, error: true});
    }
  },

  unsubscribe: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get('email');

    if (!email) {
      return fail(400, { missing: true });
    }

    try {
      const stmt = locals.db.prepare(`
UPDATE email_subscriptions 
SET subscription_status = 'unsubscribed',
unsubscribe_date = CURRENT_TIMESTAMP
WHERE email = ?
`);

      const result = stmt.run(email);

      if (result.changes === 0) {
	return fail(404, { email, notFound: true });
      }

      return { success: true };
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return fail(500, { error: true });
    }
  }
};


