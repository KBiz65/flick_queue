import pool from '@/lib/db';
import { createHandler } from '@/lib/api';
import { clearAuthCookie, hasAuthCookie, readSessionCookie } from '@/lib/auth';

// Tells the browser who is logged in. Always 200, so logged-out visitors don't see a 401 error in the console.
async function session(req, res) {
    const token = readSessionCookie(req.headers.cookie);
    if (!token) {
        if (hasAuthCookie(req.headers.cookie)) clearAuthCookie(res);
        return res.status(200).json({ user: null });
    }

    // Same token_version check as lib/session.js, done in the query that already loads the name
    const { rows } = await pool.query('SELECT first_name, token_version FROM users WHERE user_id = $1', [token.userId]);
    const isCurrent = rows[0]?.token_version === token.version;
    const user = isCurrent ? { firstName: rows[0].first_name } : null;

    // A token from before a password change still has a valid signature, so proxy.js would keep treating it
    // as logged in. Removing it here stops that.
    if (!isCurrent) clearAuthCookie(res);

    res.status(200).json({ user });
}

export default createHandler({ GET: session }, { auth: false });