import { pool } from '../../../db/index'; // Adjust path as necessary
import { verifyPassword } from '../../../utils/auth-utils'; // Function to compare password with hashed password
import { sign } from 'jsonwebtoken'; // npm install jsonwebtoken
import { serialize } from 'cookie'; // npm install cookie

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(422).json({ message: 'Invalid input' });
    }

    try {
        const client = await pool.connect();
        const { rows } = await client.query(
            'SELECT * FROM users WHERE username = $1', 
            [username]
        );

        if (rows.length === 0) {
            client.release();
            return res.status(401).json({ message: 'User not found.' });
        }

        const user = rows[0];
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            client.release();
            return res.status(403).json({ message: 'Incorrect password.' });
        }

        // Assuming you have a secret key for JWT
        const token = sign(
            { email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set HTTP-only cookie
        res.setHeader('Set-Cookie', serialize('auth', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', sameSite: 'strict', path: '/' }));

        client.release();
        res.status(200).json({ message: 'Logged in successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
}
