import pool from './db';
import { readSessionCookie } from './auth';

// The logged-in user's id, or null. Checks the token's signature and that its version still matches the
// database, so tokens issued before a password change are rejected. Kept apart from auth.js so proxy.js
// can check signatures without loading the database.
export async function getSessionUserId(cookieHeader) {
    const session = readSessionCookie(cookieHeader);
    if (!session) return null;

    const { rows } = await pool.query('SELECT token_version FROM users WHERE user_id = $1', [session.userId]);
    return rows[0]?.token_version === session.version ? session.userId : null;
}