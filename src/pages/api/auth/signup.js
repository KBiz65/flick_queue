import pool from '@/lib/db';
import { ApiError, createHandler } from '@/lib/api';
import { hashPassword, setAuthCookie } from '@/lib/auth';
import { emailError, firstError, nameError, passwordError, usernameError } from '@/lib/validation';

// Duplicate usernames and emails are caught by the database's unique indexes (see createHandler)
async function signup(req, res) {
    const { firstName, lastName, email, username, password } = req.body;

    const message = firstError(
        nameError(firstName, 'First name'),
        nameError(lastName, 'Last name'),
        emailError(email),
        usernameError(username),
        passwordError(password)
    );
    if (message) {
        throw new ApiError(422, message);
    }

    const hashedPassword = await hashPassword(password);

    const { rows } = await pool.query(
        'INSERT INTO users(first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, first_name, token_version',
        [firstName.trim(), lastName.trim(), email.trim().toLowerCase(), username.trim(), hashedPassword]
    );
    const newUser = rows[0];

    // Log the new user in right away
    setAuthCookie(res, newUser.user_id, newUser.token_version);

    res.status(201).json({ firstName: newUser.first_name });
}

export default createHandler({ POST: signup }, { auth: false });