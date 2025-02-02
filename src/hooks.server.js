// src/hooks.server.js
import { setupDatabase } from '$lib/server/db';
import { building } from '$app/environment';
import sqlite3 from 'better-sqlite3';

const db = building ? null : new sqlite3('valkyriextruck.db', {verbose: console.log } );

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
  const response = await resolve(event);
   response.headers.append('Access-Control-Allow-Origin', '*');
  response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

