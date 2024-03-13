import { hashPassword } from '../../../utils/auth-utils';
import pool from '../../../db/index'; // Adjusted for direct import

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstname, lastname, email, username, password } = req.body;
  // Basic validation
  if (
    !firstname ||	firstname.trim().length === 0 ||
    !lastname || lastname.trim().length === 0 ||
    !email || !email.includes('@') ||
    !username || username.trim().length < 6 ||
    !password || password.trim().length < 8
  ) {
    return res.status(422).json({ message: 'Invalid input' });
  }

  try {
    // Check if username exists
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length > 0) {
      return res.status(422).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user
    await pool.query('INSERT INTO users(first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5)', [
      firstname,
      lastname,
      email,
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.error(error);
  }
}
