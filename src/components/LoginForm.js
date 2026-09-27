import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setUser } from '../store/slices/authSlice';
import { getSafeRedirect } from '../lib/redirect';
import { Card, CardContent, CardActions, TextField, Button, Typography, Box } from '@mui/material';

export default function LoginForm({ setIsLoginView, from }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');
        setIsSubmitting(true);
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
            router.push(getSafeRedirect(from));
        } catch {
            setLoginError('Login failed due to a network error');
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
                <form onSubmit={handleSubmit}>
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
                            autoComplete="username"
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
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            error={!!loginError}
                            helperText={loginError}
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                backgroundColor: '#6BAA75'
                            }}
                        >
                            Log In
                        </Button>
                    </CardActions>
                </form>
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