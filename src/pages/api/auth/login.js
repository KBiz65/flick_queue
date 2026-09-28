import pool from '@/lib/db';
import { ApiError, createHandler } from '@/lib/api';
import { DUMMY_PASSWORD_HASH, verifyPassword, setAuthCookie } from '@/lib/auth';

// Usernames match regardless of capitalization ("kevinb" logs into "KevinB")
async function login(req, res) {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
        throw new ApiError(422, 'Enter your username and password.');
    }

    const { rows } = await pool.query(
        'SELECT user_id, first_name, password_hash FROM users WHERE lower(username) = lower($1)',
        [username.trim()]
    );

    const user = rows[0];
    const passwordMatches = await verifyPassword(password, user ? user.password_hash : DUMMY_PASSWORD_HASH);

    if (!user || !passwordMatches) {
        throw new ApiError(401, 'Incorrect username or password.');
    }

    setAuthCookie(res, user.user_id);

    res.status(200).json({ firstName: user.first_name });
}

export default createHandler({ POST: login }, { auth: false });