import jwt from 'jsonwebtoken';
import pool from '../../../db/index';

export default async function getUserData(req, res) {
    const token = req.cookies.FlickQueueAuth;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { userId } = decoded;
        const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        res.status(200).json({
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            allowAdultContent: user.allow_adult_content || false
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
}
