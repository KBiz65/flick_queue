import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';
import { setUser } from '../store/slices/authSlice';
import { getSafeRedirect } from '../lib/redirect';
import { LIMITS, emailError, firstError, nameError, passwordError, usernameError } from '../lib/validation';
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';

export default function SignupForm({ setIsLoginView, from }) {
  const [signupError, setSignupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit action
    setSignupError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    const validationError = firstError(
      nameError(firstName, 'First name'),
      nameError(lastName, 'Last name'),
      emailError(email),
      usernameError(username),
      passwordError(password)
    );
    if (validationError) {
      setSignupError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', { firstName, lastName, email, username, password });

      // Signup also logs the user in, so go straight to the app
      dispatch(setUser(response.data));
      router.push(getSafeRedirect(from));
    } catch (error) {
      // No response means the request never reached the server
      setSignupError(error.response ? error.response.data?.message || 'Signup failed' : 'Signup failed due to a network error');
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
            <TextField id="firstName" name="firstName" label="First name" autoComplete="given-name" required slotProps={{ htmlInput: { maxLength: LIMITS.nameMax } }} />
            <TextField id="lastName" name="lastName" label="Last name" autoComplete="family-name" required slotProps={{ htmlInput: { maxLength: LIMITS.nameMax } }} />
          </Stack>
          <TextField id="email" name="email" label="Email" type="email" autoComplete="email" required slotProps={{ htmlInput: { maxLength: LIMITS.emailMax } }} />
          <TextField
            id="username"
            name="username"
            label="Username"
            autoComplete="username"
            required
            helperText="6 to 30 characters: letters, numbers, _ and ."
            slotProps={{ htmlInput: { minLength: LIMITS.usernameMin, maxLength: LIMITS.usernameMax } }}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            helperText="At least 8 characters"
            slotProps={{ htmlInput: { minLength: LIMITS.passwordMin, maxLength: LIMITS.passwordMax } }}
          />
          {signupError && <Alert severity="error">{signupError}</Alert>}
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
          <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            By creating an account, you agree to the{' '}
            <Link component={NextLink} href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link component={NextLink} href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>
            .
          </Typography>
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