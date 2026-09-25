import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setUser, setError } from '../../store/slices/authSlice';
import { Card, CardContent, CardActions, TextField, Button, Typography, Box } from '@mui/material';

export default function LoginForm({ setIsLoginView, from }) {
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
            if (from) router.push(from) 
            else router.push('/dashboard');
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
            <Card sx={{
                minWidth: 275,
                maxWidth: 400,
                backgroundColor: '#262626',
                color: '#ffffff',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#8C8C8C', // Change the border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#8C8C8C', // Change the border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8C8C8C', // Change the border color when focused
                    },
                  },
            }}>
                <CardContent sx={{
                    '& .MuiInputBase-input': {
                        color: '#8C8C8C', // Text color
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#8C8C8C',
                        opacity: 1,
                      },
                }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Log In
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        error={!!loginError}
                        helperText={loginError}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: '#6BAA75'
                        }}
                    >
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
                    sx={{ textTransform: 'none', color: '#6BAA75' }}
                >
                    Sign Up
                </Button>
            </Typography>
        </Box>
    );
}
