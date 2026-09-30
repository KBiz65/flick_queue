import React from 'react';
import Link from 'next/link';
import { Button, Container, Typography } from '@mui/material';
import SeoHead from './SeoHead';
import Navbar from './Navbar';

// Shared layout for the 404 and 500 pages
const ErrorPage = ({ code, title, message }) => (
    <>
        <SeoHead title={title} />
        <Navbar />
        <Container component="main" maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
            <Typography
                aria-hidden="true"
                sx={{ fontFamily: '"Big Shoulders Display Variable", sans-serif', fontWeight: 800, fontSize: { xs: '5rem', md: '7rem' }, lineHeight: 1, color: 'primary.main' }}
            >
                {code}
            </Typography>
            <Typography variant="h3" component="h1" sx={{ mt: 2 }}>
                {title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 2, maxWidth: '50ch', mx: 'auto' }}>{message}</Typography>
            <Button component={Link} href="/" variant="contained" size="large" sx={{ mt: 4 }}>
                Go to FlickQueue home
            </Button>
        </Container>
    </>
);

export default ErrorPage;