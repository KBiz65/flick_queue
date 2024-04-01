import { parseCookies } from 'nookies';
import jwt  from 'jsonwebtoken';
import pool from '../../../db/index';
import { verifyPassword, hashPassword } from '../../../utils/auth-utils';

export default async function updateUserData(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Parse cookies from the request
    const cookies = parseCookies({ req });
    const token = cookies.FlickQueueAuth;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token not found' });
    }

    const { email, username, firstName, lastName, allowAdultContent, oldPassword, newPassword, confirmPassword } = req.body;

    // Basic validation for required fields
    if (!email || !username || !firstName || !lastName || allowAdultContent === undefined) {
        return res.status(422).json({ message: 'Missing required fields' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const userQuery = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userQuery.rows[0];

        // Initialize an array to hold dynamic parameters for query
        let queryParams = [email, username, firstName, lastName, allowAdultContent];
        let updateQueryBase =
            'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, allow_adult_content = $5';
        let updateQueryEnd = ' WHERE user_id = $6';

        // Handle password change if all password fields are present and valid
        if (newPassword && confirmPassword && oldPassword) {
            if (newPassword !== confirmPassword) {
                return res.status(422).json({ message: 'New passwords do not match.' });
            }

            const isOldPasswordValid = await verifyPassword(oldPassword, user.password_hash);
            if (!isOldPasswordValid) {
                return res.status(401).json({ message: 'Old password is incorrect.' });
            }

            // Hash new password and prepare query for updating password
            const hashedNewPassword = await hashPassword(newPassword);
            queryParams.push(hashedNewPassword);
            updateQueryBase += ', password_hash = $6';
            updateQueryEnd = ' WHERE user_id = $7'; // Adjust the userId placeholder position due to the added password_hash
        }

        // Add userId to the end of the queryParams
        queryParams.push(userId);

        // Finalize the updateQuery by merging the base and the end
        const updateQuery = updateQueryBase + updateQueryEnd;

        // Execute update query with dynamic parameters
        await pool.query(updateQuery, queryParams);

        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.', error: error.message });
    }
}
