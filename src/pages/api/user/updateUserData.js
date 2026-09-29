import pool from '@/lib/db';
import { ApiError, createHandler } from '@/lib/api';
import { verifyPassword, hashPassword, setAuthCookie } from '@/lib/auth';
import { emailError, firstError, nameError, passwordError, usernameError } from '@/lib/validation';

async function updateUserData(req, res) {
    const { email, username, firstName, lastName, allowAdultContent, confirmAdult, watchRegion, oldPassword, newPassword, confirmPassword } = req.body;

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

    const userQuery = await pool.query('SELECT email, password_hash, allow_adult_content FROM users WHERE user_id = $1', [req.userId]);
    if (userQuery.rows.length === 0) {
        throw new ApiError(404, 'User not found');
    }

    const user = userQuery.rows[0];
    const newEmail = email.trim().toLowerCase();
    const isChangingEmail = newEmail !== user.email.toLowerCase();

    // Handle a password change only when a new password was sent.
    // A current password on its own (often browser auto-fill) is ignored.
    const isChangingPassword = Boolean(newPassword || confirmPassword);

    if (isChangingPassword) {
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
    }

    // The email is how an account will be recovered, so changing it needs the current password too
    if (isChangingEmail && !oldPassword) {
        throw new ApiError(422, 'Enter your current password to change your email.');
    }

    if (isChangingEmail || isChangingPassword) {
        const isOldPasswordValid = await verifyPassword(String(oldPassword), user.password_hash);
        if (!isOldPasswordValid) {
            throw new ApiError(422, 'Current password is incorrect.');
        }
    }

    const params = [newEmail, username.trim(), firstName.trim(), lastName.trim(), allowAdultContent, watchRegion];
    const setClauses = ['email = $1', 'username = $2', 'first_name = $3', 'last_name = $4', 'allow_adult_content = $5', 'watch_region = $6'];

    // Turning adult titles on requires the 18+ confirmation from the profile page, and records when it was given
    const isTurningOnAdult = allowAdultContent && !user.allow_adult_content;
    if (isTurningOnAdult) {
        if (confirmAdult !== true) {
            throw new ApiError(422, 'Confirm you are 18 or older to show adult titles.');
        }
        setClauses.push("adult_confirmed_at = (now() AT TIME ZONE 'utc')");
    }

    // A new password ends every other session by bumping token_version
    if (isChangingPassword) {
        params.push(await hashPassword(newPassword));
        setClauses.push(`password_hash = $${params.length}`, 'token_version = token_version + 1');
    }

    params.push(req.userId);

    const { rows } = await pool.query(
        `UPDATE users SET ${setClauses.join(', ')} WHERE user_id = $${params.length}
        RETURNING username, email, first_name, last_name, allow_adult_content, watch_region, token_version`,
        params
    );
    const updatedUser = rows[0];

    // Keep this device logged in with a token for the new version
    if (isChangingPassword) {
        setAuthCookie(res, req.userId, updatedUser.token_version);
    }

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