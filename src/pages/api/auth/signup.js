import pool from '@/lib/db';
import { hashPassword, setAuthCookie } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstname, lastname, email, username, password } = req.body;
  // Basic validation
  if (
    !firstname || firstname.trim().length === 0 ||
    !lastname || lastname.trim().length === 0 ||
    !email || !email.includes('@') ||
    !username || username.trim().length < 6 ||
    !password || password.trim().length < 8
  ) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  try {
    // Check if username or email exists
    const { rows } = await pool.query(
      'SELECT username, email FROM users WHERE username = $1 OR email = $2',
      [normalizedUsername, normalizedEmail]
    );
    if (rows.some((row) => row.username === normalizedUsername)) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    if (rows.length > 0) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user
    const { rows: newRows } = await pool.query(
      'INSERT INTO users(first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, first_name',
      [firstname.trim(), lastname.trim(), normalizedEmail, normalizedUsername, hashedPassword]
    );
    const newUser = newRows[0];

    // Log the new user in right away
    setAuthCookie(res, newUser.user_id);

    res.status(201).json({ firstName: newUser.first_name });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}