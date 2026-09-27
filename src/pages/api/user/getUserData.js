import pool from '@/lib/db';
import { createHandler } from '@/lib/api';

async function getUserData(req, res) {
    const { rows } = await pool.query(
        'SELECT username, email, first_name, last_name, allow_adult_content FROM users WHERE user_id = $1',
        [req.userId]
    );

    if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    res.status(200).json({
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        allowAdultContent: user.allow_adult_content,
    });
}

export default createHandler({ GET: getUserData });