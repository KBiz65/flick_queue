import pool from '@/lib/db';
import { ApiError, createHandler } from '@/lib/api';
import { clearAuthCookie, verifyPassword } from '@/lib/auth';

// Deletes the account after checking the password. Watchlists and their items go with it (ON DELETE CASCADE).
async function deleteAccount(req, res) {
    const { password } = req.body;
    if (typeof password !== 'string' || !password) {
        throw new ApiError(422, 'Enter your password to delete your account.');
    }

    const { rows } = await pool.query('SELECT password_hash FROM users WHERE user_id = $1', [req.userId]);
    if (rows.length === 0) {
        throw new ApiError(404, 'User not found');
    }

    const isValid = await verifyPassword(password, rows[0].password_hash);
    if (!isValid) {
        throw new ApiError(422, 'Password is incorrect.');
    }

    await pool.query('DELETE FROM users WHERE user_id = $1', [req.userId]);
    clearAuthCookie(res);

    res.status(200).json({ message: 'Account deleted.' });
}

export default createHandler({ POST: deleteAccount });