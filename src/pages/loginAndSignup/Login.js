import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setUser, setError } from '../../store/slices/authSlice';
import { Card, CardContent, CardActions, TextField, Button, Typography, Box } from '@mui/material';

export default function LoginForm({ setIsLoginView }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');
	const dispatch = useDispatch();
	const router = useRouter();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoginError('');
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setLoginError(errorData.message || 'Login failed');
				return;
			}

			const userData = await response.json();
			dispatch(setUser(userData));
			router.push('/dashboard'); // Adjust the redirect path as needed
		} catch (error) {
			console.error('An error occurred during login:', error.message);
			setLoginError('Login failed due to a network error');
		}
	};

	return (
		<Box
			sx={{
        mt: 8, // Adjust this value based on your Navbar's size and page layout
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
			}}
		>
			<Card sx={{ minWidth: 275, maxWidth: 400 }}>
				<CardContent>
					<Typography variant="h5" component="h2" gutterBottom>
						Log In
					</Typography>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						margin="normal"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
					<TextField
						label="Password"
						type="password"
						variant="outlined"
						fullWidth
						margin="normal"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						error={!!loginError}
						helperText={loginError}
					/>
				</CardContent>
				<CardActions>
					<Button fullWidth variant="contained" onClick={handleSubmit}>
						Log In
					</Button>
				</CardActions>
			</Card>
			<Typography variant="body2" sx={{ mt: 2 }}>
				Don&apos;t have an account?
				<Button
					color="primary"
					onClick={() => setIsLoginView(false)}
					component="span"
					style={{ textTransform: 'none' }}
				>
					Sign Up
				</Button>
			</Typography>
		</Box>
	);
}
