import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import SeoHead from '../components/SeoHead';
import { Alert, Box, CircularProgress, Container, Divider, Typography, TextField, Button, FormControlLabel, MenuItem, Stack, Switch, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import AdultConfirmDialog from '../components/AdultConfirmDialog';
import DeleteAccountSection from '../components/DeleteAccountSection';
import { setUser } from '../store/slices/authSlice';
import { LIMITS, emailError, nameError, passwordError, usernameError } from '../lib/validation';

const Profile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [confirmAdult, setConfirmAdult] = useState(false);
    const [isAdultDialogOpen, setIsAdultDialogOpen] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        newPassword: '',
        confirmPassword: '',
        oldPassword: '',
        allowAdultContent: false,
        watchRegion: 'US',
    });
    const [regions, setRegions] = useState([]);
    const [formErrors, setFormErrors] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        newPassword: '',
        confirmPassword: '',
        oldPassword: '',
    });
    const [updateStatus, setUpdateStatus] = useState({
        message: '',
        isError: false,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get('/api/user/getUserData');
                setUserData({
                    username: userResponse.data.username,
                    email: userResponse.data.email,
                    firstName: userResponse.data.firstName,
                    lastName: userResponse.data.lastName,
                    newPassword: '',
                    confirmPassword: '',
                    oldPassword: '',
                    allowAdultContent: userResponse.data.allowAdultContent || false,
                    watchRegion: userResponse.data.watchRegion || 'US',
                });
                setIsLoaded(true);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    router.push({
                        pathname: '/',
                        query: { from: '/profile' },
                    });
                } else {
                    setUpdateStatus({ message: 'Could not load your profile. Please refresh.', isError: true });
                }
            }
        };
        fetchUserData();
    }, [router]);

    // Countries for the streaming availability dropdown
    useEffect(() => {
        axios
            .get('/api/tmdb/regions')
            .then((response) => setRegions(response.data.regions))
            .catch(() => setRegions([]));
    }, []);

    const showStatus = (message, isError) => {
        setUpdateStatus({ message, isError });
        setTimeout(() => {
            setUpdateStatus({ message: '', isError });
        }, 5000);
    };

    const updateUserData = async () => {
        setIsSaving(true);
        try {
            const response = await axios.post('/api/user/updateUserData', { ...userData, confirmAdult });
            const responseData = response.data;
            const newUserData = {
                username: responseData.username,
                email: responseData.email,
                firstName: responseData.firstName,
                lastName: responseData.lastName,
                newPassword: '',
                confirmPassword: '',
                oldPassword: '',
                allowAdultContent: responseData.allowAdultContent,
                watchRegion: responseData.watchRegion,
            };
            setUserData(newUserData);
            setConfirmAdult(false);
            setFormErrors({
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                newPassword: '',
                confirmPassword: '',
                oldPassword: '',
            });
            dispatch(setUser({ firstName: responseData.firstName }));
            showStatus('Changes saved.', false);
        } catch (error) {
            showStatus(error.response?.data?.message || 'Profile update failed. Please try again.', true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Turning adult titles on needs an 18+ confirmation first; turning them off doesn't
    const handleAdultToggle = (event) => {
        if (event.target.checked) {
            setIsAdultDialogOpen(true);
            return;
        }
        setUserData((prevState) => ({ ...prevState, allowAdultContent: false }));
        setConfirmAdult(false);
    };

    const handleAdultConfirm = () => {
        setUserData((prevState) => ({ ...prevState, allowAdultContent: true }));
        setConfirmAdult(true);
        setIsAdultDialogOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            firstName: nameError(userData.firstName, 'First name'),
            lastName: nameError(userData.lastName, 'Last name'),
            username: usernameError(userData.username),
            email: emailError(userData.email),
        };

        // Only treat this as a password change when a new password was typed.
        // (Browsers often auto-fill the current password field, which on its own shouldn't block saving.)
        if (userData.newPassword || userData.confirmPassword) {
            errors.newPassword = passwordError(userData.newPassword);

            if (userData.newPassword !== userData.confirmPassword) {
                errors.confirmPassword = 'New passwords do not match';
            }

            if (!userData.oldPassword) {
                errors.oldPassword = 'Enter old password to update';
            }
        }

        setFormErrors(errors);

        if (Object.values(errors).some(Boolean)) {
            showStatus('Fix the highlighted fields and try again.', true);
            return;
        }

        // If no errors, proceed with form submission
        await updateUserData();
    };

    if (!isLoaded) {
        return (
            <Box>
                <Navbar />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    {updateStatus.isError ? (
                        <Alert severity="error">{updateStatus.message}</Alert>
                    ) : (
                        <CircularProgress />
                    )}
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <SeoHead title="Profile" />
            <Navbar />
            <Container component="main" maxWidth="sm" sx={{ py: 5 }}>
                <Typography component="h1" variant="h3">
                    Profile
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                    Update your account details and preferences.
                </Typography>

                <Paper component="form" onSubmit={handleSubmit} noValidate sx={{ p: { xs: 3, sm: 4 }, mt: 4 }}>
                    <Typography variant="h6" component="h2">
                        Account
                    </Typography>
                    <Stack spacing={2.5} sx={{ mt: 2 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="First name"
                                name="firstName"
                                value={userData.firstName || ''}
                                onChange={handleInputChange}
                                error={!!formErrors.firstName}
                                helperText={formErrors.firstName}
                                slotProps={{ htmlInput: { maxLength: LIMITS.nameMax } }}
                            />
                            <TextField
                                label="Last name"
                                name="lastName"
                                value={userData.lastName || ''}
                                onChange={handleInputChange}
                                error={!!formErrors.lastName}
                                helperText={formErrors.lastName}
                                slotProps={{ htmlInput: { maxLength: LIMITS.nameMax } }}
                            />
                        </Stack>
                        <TextField
                            label="Username"
                            name="username"
                            autoComplete="username"
                            value={userData.username || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.username}
                            helperText={formErrors.username}
                            slotProps={{ htmlInput: { maxLength: LIMITS.usernameMax } }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={userData.email || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            slotProps={{ htmlInput: { maxLength: LIMITS.emailMax } }}
                        />
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" component="h2">
                        Change password
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Leave these blank to keep your current password.
                    </Typography>
                    <Stack spacing={2.5} sx={{ mt: 2 }}>
                        <TextField
                            label="Current password"
                            name="oldPassword"
                            type="password"
                            autoComplete="current-password"
                            value={userData.oldPassword || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.oldPassword}
                            helperText={formErrors.oldPassword}
                        />
                        <TextField
                            label="New password"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={userData.newPassword || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.newPassword}
                            helperText={formErrors.newPassword || 'At least 8 characters'}
                            slotProps={{ htmlInput: { maxLength: LIMITS.passwordMax } }}
                        />
                        <TextField
                            label="Confirm new password"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={userData.confirmPassword || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                            slotProps={{ htmlInput: { maxLength: LIMITS.passwordMax } }}
                        />
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" component="h2">
                        Content
                    </Typography>
                    <TextField
                        select
                        label="Country"
                        name="watchRegion"
                        value={regions.length ? userData.watchRegion : ''}
                        onChange={handleInputChange}
                        helperText="Used to show where titles are streaming, for rent, or for sale."
                        disabled={!regions.length}
                        sx={{ mt: 2 }}
                        slotProps={{ select: { MenuProps: { slotProps: { paper: { sx: { maxHeight: 360 } } } } } }}
                    >
                        {regions.map((region) => (
                            <MenuItem key={region.code} value={region.code}>
                                {region.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        sx={{ mt: 3, alignItems: 'flex-start', ml: 0, gap: 1.5 }}
                        control={
                            <Switch
                                checked={userData.allowAdultContent || false}
                                onChange={handleAdultToggle}
                                name="allowAdultContent"
                            />
                        }
                        label={
                            <Box sx={{ pt: 0.75 }}>
                                <Typography sx={{ fontWeight: 600 }}>Show adult titles</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Include adult movies and shows in search results and recommendations.
                                </Typography>
                            </Box>
                        }
                    />

                    {updateStatus.message && (
                        <Alert severity={updateStatus.isError ? 'error' : 'success'} sx={{ mt: 3 }}>
                            {updateStatus.message}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button type="submit" variant="contained" size="large" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save changes'}
                        </Button>
                    </Box>
                </Paper>

                <DeleteAccountSection />
                <AdultConfirmDialog open={isAdultDialogOpen} onConfirm={handleAdultConfirm} onCancel={() => setIsAdultDialogOpen(false)} />
            </Container>
        </Box>
    );
};

export default Profile;
