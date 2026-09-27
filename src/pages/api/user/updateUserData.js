import pool from '@/lib/db';
import { createHandler } from '@/lib/api';
import { verifyPassword, hashPassword } from '@/lib/auth';

async function updateUserData(req, res) {
    const { email, username, firstName, lastName, allowAdultContent, oldPassword, newPassword, confirmPassword } = req.body;

    // Basic validation for required fields
    if (!email?.trim() || !username?.trim() || !firstName?.trim() || !lastName?.trim() || typeof allowAdultContent !== 'boolean') {
        return res.status(422).json({ message: 'Missing required fields' });
    }

    if (!email.includes('@') || username.trim().length < 6) {
        return res.status(422).json({ message: 'Enter a valid email and a username of at least 6 characters.' });
    }

    const userQuery = await pool.query('SELECT password_hash FROM users WHERE user_id = $1', [req.userId]);
    if (userQuery.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    const user = userQuery.rows[0];

    // Initialize an array to hold dynamic parameters for query
    let queryParams = [email.trim().toLowerCase(), username.trim(), firstName.trim(), lastName.trim(), allowAdultContent];
    let updateQueryBase =
        'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, allow_adult_content = $5';
    let updateQueryEnd = ' WHERE user_id = $6';

    // Handle password change if any password field is filled in
    if (oldPassword || newPassword || confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(422).json({ message: 'Fill in all three password fields to change your password.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(422).json({ message: 'New passwords do not match.' });
        }

        if (newPassword.length < 8) {
            return res.status(422).json({ message: 'New password must be at least 8 characters.' });
        }

        const isOldPasswordValid = await verifyPassword(oldPassword, user.password_hash);
        if (!isOldPasswordValid) {
            return res.status(422).json({ message: 'Old password is incorrect.' });
        }

        // Hash new password and prepare query for updating password
        const hashedNewPassword = await hashPassword(newPassword);
        queryParams.push(hashedNewPassword);
        updateQueryBase += ', password_hash = $6';
        updateQueryEnd = ' WHERE user_id = $7'; // userId placeholder moves because of the added password_hash
    }

    // Add userId to the end of the queryParams
    queryParams.push(req.userId);

    // Finalize the updateQuery and return the saved values
    const updateQuery =
        updateQueryBase + updateQueryEnd + ' RETURNING username, email, first_name, last_name, allow_adult_content';

    const { rows } = await pool.query(updateQuery, queryParams);
    const updatedUser = rows[0];

    res.status(200).json({
        message: 'User updated successfully.',
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        allowAdultContent: updatedUser.allow_adult_content,
    });
}

export default createHandler({ POST: updateUserData });