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

    useEffect(() => {
        const fetchUserData = async () => {
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
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.newPassword !== userData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        updateUserData(userData); 
        router.push('/dashboard'); 
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
                                    value={userData.username}
                                    onChange={handleInputChange}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={userData.firstName}
                                    onChange={handleInputChange}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={userData.lastName}
                                    onChange={handleInputChange}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    name="newPassword"
                                    value={userData.newPassword}
                                    onChange={handleInputChange}
                                    type="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    value={userData.confirmPassword}
                                    onChange={handleInputChange}
                                    type="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Old Password"
                                    name="oldPassword"
                                    value={userData.oldPassword}
                                    onChange={handleInputChange}
                                    type="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.allowAdultContent}
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
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Profile;
