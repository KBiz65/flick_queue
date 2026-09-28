import pool from '@/lib/db';
import { ApiError, createHandler } from '@/lib/api';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { emailError, firstError, nameError, passwordError, usernameError } from '@/lib/validation';

async function updateUserData(req, res) {
    const { email, username, firstName, lastName, allowAdultContent, watchRegion, oldPassword, newPassword, confirmPassword } = req.body;

    const message = firstError(
        nameError(firstName, 'First name'),
        nameError(lastName, 'Last name'),
        usernameError(username),
        emailError(email)
    );
    if (message) {
        throw new ApiError(422, message);
    }

    if (typeof allowAdultContent !== 'boolean') {
        throw new ApiError(422, 'Choose whether to show adult titles.');
    }

    // Two-letter country code, like US or GB
    if (typeof watchRegion !== 'string' || !/^[A-Z]{2}$/.test(watchRegion)) {
        throw new ApiError(422, 'Choose a country for streaming availability.');
    }

    const userQuery = await pool.query('SELECT password_hash FROM users WHERE user_id = $1', [req.userId]);
    if (userQuery.rows.length === 0) {
        throw new ApiError(404, 'User not found');
    }

    const user = userQuery.rows[0];

    const queryParams = [email.trim().toLowerCase(), username.trim(), firstName.trim(), lastName.trim(), allowAdultContent, watchRegion];
    let updateQueryBase =
        'UPDATE users SET email = $1, username = $2, first_name = $3, last_name = $4, allow_adult_content = $5, watch_region = $6';
    let updateQueryEnd = ' WHERE user_id = $7';

    // Handle a password change only when a new password was sent.
    // A current password on its own (often browser auto-fill) is ignored.
    if (newPassword || confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
            throw new ApiError(422, 'Fill in all three password fields to change your password.');
        }

        if (newPassword !== confirmPassword) {
            throw new ApiError(422, 'New passwords do not match.');
        }

        const newPasswordMessage = passwordError(newPassword);
        if (newPasswordMessage) {
            throw new ApiError(422, newPasswordMessage);
        }

        const isOldPasswordValid = await verifyPassword(String(oldPassword), user.password_hash);
        if (!isOldPasswordValid) {
            throw new ApiError(422, 'Old password is incorrect.');
        }

        const hashedNewPassword = await hashPassword(newPassword);
        queryParams.push(hashedNewPassword);
        updateQueryBase += ', password_hash = $7';
        updateQueryEnd = ' WHERE user_id = $8'; // userId placeholder moves because of the added password_hash
    }

    queryParams.push(req.userId);

    const updateQuery =
        updateQueryBase + updateQueryEnd + ' RETURNING username, email, first_name, last_name, allow_adult_content, watch_region';

    const { rows } = await pool.query(updateQuery, queryParams);
    const updatedUser = rows[0];

    res.status(200).json({
        message: 'User updated successfully.',
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        allowAdultContent: updatedUser.allow_adult_content,
        watchRegion: updatedUser.watch_region,
    });
}

export default createHandler({ POST: updateUserData });