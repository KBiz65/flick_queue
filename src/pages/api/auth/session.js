import pool from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth';

// Tells the browser who is logged in. Always 200, so logged-out visitors don't see a 401 error in the console.
export default async function session(req, res) {

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(200).json({ user: null });
    }

    try {
        const { rows } = await pool.query('SELECT first_name FROM users WHERE user_id = $1', [userId]);
        const user = rows[0] ? { firstName: rows[0].first_name } : null;

        res.status(200).json({ user });
    } catch (error) {
        console.error('Session check failed:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}