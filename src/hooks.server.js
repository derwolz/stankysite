// src/hooks.server.js
import { setupDatabase } from '$lib/server/db';
import { building } from '$app/environment';
import sqlite3 from 'better-sqlite3';

const db = building ? null : new sqlite3('valkyriextruck.db', {verbose: console.log, readonly: false } );

if (db) {
  // Create tables
  db.exec(`
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscription_status TEXT NOT NULL DEFAULT 'active',
    ip_address VARCHAR(45),
    signup_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmation_date TIMESTAMP NULL,
    unsubscribe_date TIMESTAMP NULL
);


`);
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.db = db;

  // Handle preflight requests
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,Content-Length,multipart/form-data',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  const response = await resolve(event);
  
  // Add CORS headers to all responses
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,Content-Length,multipart/form-data');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

