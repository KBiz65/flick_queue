import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setUser } from '../store/slices/authSlice';
import { getSafeRedirect } from '../lib/redirect';
import { Card, CardContent, CardActions, TextField, Button, Typography, Box } from '@mui/material';

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
    <Box
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Card sx={{
        minWidth: 275,
        maxWidth: 400,
        backgroundColor: '#262626',
        color: '#ffffff',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#8C8C8C' },
          '&:hover fieldset': { borderColor: '#8C8C8C' },
          '&.Mui-focused fieldset': { borderColor: '#8C8C8C' },
        },
      }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="firstname"
              name="firstname"
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              id="lastname"
              name="lastname"
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              id="username"
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              helperText="At least 6 characters"
              slotProps={{ htmlInput: { minLength: 6 } }}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              error={!!signupError}
              helperText={signupError || 'At least 8 characters'}
              slotProps={{ htmlInput: { minLength: 8 } }}
            />
            <CardActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ backgroundColor: '#6BAA75' }}
              >
                Sign Up
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?
        <Button
          color="primary"
          onClick={() => setIsLoginView(true)}
          component="span"
          sx={{ textTransform: 'none', color: '#6BAA75' }}
        >
          Log In
        </Button>
      </Typography>
    </Box>
  );
}