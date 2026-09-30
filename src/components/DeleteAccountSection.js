import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { logout } from '../store/slices/authSlice';

// Bottom of the profile page. Asks for the password, deletes the account, then logs out.
const DeleteAccountSection = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleClose = () => {
        if (isDeleting) return;
        setIsOpen(false);
        setPassword('');
        setError('');
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        setError('');
        setIsDeleting(true);
        try {
            await axios.delete('/api/user', { data: { password } });
            await dispatch(logout());
            router.push('/');
        } catch (deleteError) {
            setError(deleteError.response?.data?.message || 'Could not delete your account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <Paper sx={{ p: { xs: 3, sm: 4 }, mt: 4, border: 1, borderColor: 'error.dark' }}>
            <Typography variant="h6" component="h2">
                Delete account
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Permanently deletes your account and all of your watchlists. This can&apos;t be undone.
            </Typography>
            <Button variant="outlined" color="error" onClick={() => setIsOpen(true)} sx={{ mt: 2 }}>
                Delete my account
            </Button>

            <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="xs">
                <Box component="form" onSubmit={handleDelete}>
                    <DialogTitle>Delete your account?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your account and all of your watchlists will be deleted right away. Enter your password to confirm.
                        </DialogContentText>
                        <TextField
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            fullWidth
                            margin="dense"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoFocus
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="error" disabled={!password || isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete account'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Paper>
    );
};

export default DeleteAccountSection;