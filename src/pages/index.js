import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from './shared/Navbar';
import LoginForm from './loginAndSignup/Login';
import SignupForm from './loginAndSignup/Signup';
import { Container, Grid, Typography } from '@mui/material';

export default function Home() {
    const [isLoginView, setIsLoginView] = useState(true);
    const router = useRouter();
    const { from } = router.query;

    return (
        <div>
            <Head>
                <title>FlickQueue</title>
                <meta name="description" content="Browse your favorite movies" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    alignItems="center"
                    style={{ minHeight: 'calc(100vh - 40px)' }}
                >
                    {/* Information Column */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" component="h1" gutterBottom>
                            Welcome to FlickQueue
                        </Typography>
                        <Typography variant="h5">Your ultimate movie and TV show tracking app.</Typography>
                        {/* Additional content */}
                    </Grid>

                    {/* Form Column */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isLoginView ? (
                            <LoginForm setIsLoginView={setIsLoginView} from={from} />
                        ) : (
                            <SignupForm setIsLoginView={setIsLoginView} from={from} />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
