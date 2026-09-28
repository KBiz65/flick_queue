import pool from '@/lib/db';
import { createHandler } from '@/lib/api';
import { getUserIdFromRequest } from '@/lib/auth';

// Tells the browser who is logged in. Always 200, so logged-out visitors don't see a 401 error in the console.
async function session(req, res) {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(200).json({ user: null });
    }

    const { rows } = await pool.query('SELECT first_name FROM users WHERE user_id = $1', [userId]);
    const user = rows[0] ? { firstName: rows[0].first_name } : null;

    res.status(200).json({ user });
}

export default createHandler({ GET: session }, { auth: false });