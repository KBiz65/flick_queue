import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setUser, setError } from '../store/slices/authSlice'; // Adjust based on actual actions

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Extract error message from response and update state accordingly
        const errorData = await response.json();
        dispatch(setError(errorData.message || 'Login failed'));
        return; // Exit early if there's an error
      }

      const userData = await response.json();
      dispatch(setUser(userData));

      // Redirect user to dashboard or another appropriate page
      router.push('/dashboard');
    } catch (error) {
      console.error("An error occurred during login:", error.message);
      dispatch(setError('Login failed due to a network error'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
}
