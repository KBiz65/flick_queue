import pool from '@/lib/db';
import { DUMMY_PASSWORD_HASH, verifyPassword, setAuthCookie } from '@/lib/auth';

export default async function login(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(422).json({ message: 'Invalid input' });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username.trim()]);

        const user = rows[0];
        const passwordMatches = await verifyPassword(password, user ? user.password_hash : DUMMY_PASSWORD_HASH);
        const isValid = Boolean(user) && passwordMatches;

        if (!isValid) {
            return res.status(401).json({ message: 'Incorrect username or password.' });
        }

        // Set HTTP-only auth cookie
        setAuthCookie(res, user.user_id);

        res.status(200).json({ firstName: user.first_name });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}