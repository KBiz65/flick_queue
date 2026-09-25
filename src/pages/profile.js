import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, FormControlLabel, Switch, Grid, Paper } from '@mui/material';
import Navbar from '../shared/Navbar';

const Profile = () => {
    const router = useRouter();
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
                const userResponse = await axios.get('/api/user/getUserData', { withCredentials: true });
                console.log('userResponse: ', userResponse);
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
                    console.log('User is not authenticated');
                    router.push({
                        pathname: '/home',
                        query: { from: '/profile' },
                    });
                } else {
                    console.log('error: ', error);
                }
            }
        };
        fetchUserData();
    }, [router]);

    const updateUserData = async () => {
        try {
            const response = await axios.post('/api/user/updateUserData', userData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
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
            router.push('/profile');
        } catch (error) {
            console.log('error: ', error);
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
        if (userData.newPassword || userData.confirmPassword) {
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

        // If there are any errors, prevent form submission
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setUpdateStatus({ message: 'Please correct errors before submitting.', isError: true });
            setTimeout(() => {
                setUpdateStatus({ message: '', isError: true });
            }, 5000);
            return;
        }

        // If no errors, proceed with form submission
        updateUserData();
        setUpdateStatus({ message: 'Profile updated successfully.', isError: false });
        setTimeout(() => {
            setUpdateStatus({ message: '', isError: false });
        }, 5000);
        router.push('/profile');
    };

    if (!userData.username) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 12, mb: 2 }}>
                    <Typography component="h1" variant="h5">
                        Edit Profile
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" color="primary">
                                    Update Profile
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
