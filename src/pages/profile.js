import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import { Box, CircularProgress, Container, Typography, TextField, Button, FormControlLabel, Switch, Grid, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import { setUser } from '../store/slices/authSlice';

const Profile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        newPassword: '',
        confirmPassword: '',
        oldPassword: '',
        allowAdultContent: false,
    });
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
                });
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

    const showStatus = (message, isError) => {
        setUpdateStatus({ message, isError });
        setTimeout(() => {
            setUpdateStatus({ message: '', isError });
        }, 5000);
    };

    const updateUserData = async () => {
        setIsSaving(true);
        try {
            const response = await axios.post('/api/user/updateUserData', userData);
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
            };
            setUserData(newUserData);
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
            showStatus('Profile updated successfully.', false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {};

        // Validate newPassword and confirmPassword
        if (userData.newPassword || userData.confirmPassword || userData.oldPassword) {
            if (userData.newPassword.length < 8) {
                errors.newPassword = 'New password must be at least 8 characters';
            }

            if (userData.newPassword !== userData.confirmPassword) {
                errors.confirmPassword = 'New passwords do not match';
            }

            if (!userData.oldPassword) {
                errors.oldPassword = 'Enter old password to update';
            }
        }

        if (!userData.username) errors.username = 'Username cannot be blank';
        if (!userData.email) errors.email = 'Email cannot be blank';
        if (!userData.firstName) errors.firstName = 'First name cannot be blank';
        if (!userData.lastName) errors.lastName = 'Last name cannot be blank';

        // Update the formErrors state
        setFormErrors(errors);

        // If there are any errors, prevent form submission
        if (Object.keys(errors).length > 0) {
            showStatus('Please correct errors before submitting.', true);
            return;
        }

        // If no errors, proceed with form submission
        await updateUserData();
    };

    if (!userData.username) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    {updateStatus.isError ? (
                        <Typography color="error">{updateStatus.message}</Typography>
                    ) : (
                        <CircularProgress />
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Head>
                <title>Profile | FlickQueue</title>
            </Head>
            <Navbar />
            <Container component="main" maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 2 }}>
                    <Typography component="h1" variant="h5">
                        Edit Profile
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    type="text"
                                    value={userData.username || ''}
                                    onChange={handleInputChange}
                                    error={!!formErrors.username}
                                    helperText={formErrors.username}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={userData.email || ''}
                                    onChange={handleInputChange}
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    type="text"
                                    value={userData.firstName || ''}
                                    onChange={handleInputChange}
                                    error={!!formErrors.firstName}
                                    helperText={formErrors.firstName}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    type="text"
                                    value={userData.lastName || ''}
                                    onChange={handleInputChange}
                                    error={!!formErrors.lastName}
                                    helperText={formErrors.lastName}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={userData.newPassword || ''}
                                    onChange={handleInputChange}
                                    error={!!formErrors.newPassword}
                                    helperText={formErrors.newPassword}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={userData.confirmPassword || ''}
                                    onChange={handleInputChange}
                                    error={!!formErrors.confirmPassword}
                                    helperText={formErrors.confirmPassword}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Old Password"
                                    name="oldPassword"
                                    type="password"
                                    value={userData.oldPassword || ''}
                                    onChange={handleInputChange}
                                    error={!!formErrors.oldPassword}
                                    helperText={formErrors.oldPassword}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.allowAdultContent || false}
                                            onChange={handleInputChange}
                                            name="allowAdultContent"
                                        />
                                    }
                                    label="Allow Adult Content"
                                />
                            </Grid>
                            <Grid size={12}>
                                <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Update Profile'}
                                </Button>
                            </Grid>
                            {updateStatus.message && (
                                <Box
                                    sx={{
                                        margin: '20px 0',
                                        padding: '10px',
                                        backgroundColor: updateStatus.isError ? 'error.main' : 'success.main',
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    {updateStatus.message}
                                </Box>
                            )}
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Profile;
