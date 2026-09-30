import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setUser } from '../store/slices/authSlice';
import { getSafeRedirect } from '../lib/redirect';
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';

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
            const response = await axios.post('/api/auth/login', { username, password });
            dispatch(setUser(response.data));
            router.push(getSafeRedirect(from));
        } catch (error) {
            // No response means the request never reached the server
            setLoginError(error.response ? error.response.data?.message || 'Login failed' : 'Login failed due to a network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper sx={{ p: { xs: 3, sm: 4 }, border: 1, borderColor: 'divider', bgcolor: 'rgba(33, 27, 41, 0.92)', backdropFilter: 'blur(12px)' }}>
            <Typography variant="h4" component="h1">
                Welcome back
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                Log in to see your watchlists and recommendations.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Username"
                        value={username}
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {loginError && <Alert severity="error">{loginError}</Alert>}
                    <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Log in'}
                    </Button>
                </Stack>
            </Box>
            <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                New to FlickQueue?{' '}
                <Link component="button" type="button" onClick={() => setIsLoginView(false)} sx={{ fontWeight: 700, verticalAlign: 'baseline' }}>
                    Create an account
                </Link>
            </Typography>
        </Paper>
    );
}