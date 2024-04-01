import jwt from 'jsonwebtoken';
import pool from '../../../db/index'; // Adjust path as necessary
import { verifyPassword } from '../../../utils/auth-utils'; // Function to compare password with hashed password
import { serialize } from 'cookie'; // npm install cookie

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
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        // Assuming you have a secret key for JWT
        const token = jwt.sign(
            { userId: user.user_id, username: user.username, firstName: user.first_name, lastName: user.last_name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set HTTP-only cookie
        res.setHeader('Set-Cookie', serialize('FlickQueueAuth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
            maxAge: 3600000 // 1hr
        }));

        res.status(200).json({ firstName: user.first_name, watchLists: user.watchLists || [{ 'watchList 1': [] }, { 'watchList 2': [] }] });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
}
