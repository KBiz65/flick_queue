import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setUser } from '../store/slices/authSlice';
import { getSafeRedirect } from '../lib/redirect';
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';

export default function Signup({ setIsLoginView, from }) {
  const [signupError, setSignupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit action
    setSignupError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    // Send the form data to your API route
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignupError(data.message || 'Signup failed');
        return;
      }

      // Signup also logs the user in, so go straight to the app
      dispatch(setUser(data));
      router.push(getSafeRedirect(from));
    } catch {
      setSignupError('Signup failed due to a network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 3, sm: 4 }, border: 1, borderColor: 'divider', bgcolor: 'rgba(33, 27, 41, 0.92)', backdropFilter: 'blur(12px)' }}>
      <Typography variant="h4" component="h1">
        Create your account
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1 }}>
        Save movies and shows to watchlists and track what you&apos;ve watched.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2}>
            <TextField id="firstname" name="firstname" label="First name" autoComplete="given-name" required />
            <TextField id="lastname" name="lastname" label="Last name" autoComplete="family-name" required />
          </Stack>
          <TextField id="email" name="email" label="Email" type="email" autoComplete="email" required />
          <TextField
            id="username"
            name="username"
            label="Username"
            autoComplete="username"
            required
            helperText="At least 6 characters"
            slotProps={{ htmlInput: { minLength: 6 } }}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            helperText="At least 8 characters"
            slotProps={{ htmlInput: { minLength: 8 } }}
          />
          {signupError && <Alert severity="error">{signupError}</Alert>}
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </Stack>
      </Box>
      <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
        Already have an account?{' '}
        <Link component="button" type="button" onClick={() => setIsLoginView(true)} sx={{ fontWeight: 700, verticalAlign: 'baseline' }}>
          Log in
        </Link>
      </Typography>
    </Paper>
  );
}