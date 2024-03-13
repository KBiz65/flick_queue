import React from 'react';
import { Card, CardContent, CardActions, TextField, Button, Typography, Box } from '@mui/material';

export default function Signup({ setIsLoginView }) {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit action

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

      if (!response.ok) {
        console.error("Signup failed");
        // You could also update the UI to reflect the error
        return;
      }

      console.log("Signup successful");
      // Redirect to login page or another appropriate action
    } catch (error) {
      console.error("An error occurred during signup:", error);
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
      <Card sx={{ minWidth: 275, maxWidth: 400 }}>
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
              inputProps={{ minLength: 6 }}
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
              inputProps={{ minLength: 8 }}
            />
            <CardActions>
              <Button type="submit" fullWidth variant="contained">
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
					style={{ textTransform: 'none' }}
				>
					Log In
				</Button>
			</Typography>
    </Box>
  );
}
