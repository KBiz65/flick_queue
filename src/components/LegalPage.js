import React from 'react';
import SeoHead from './SeoHead';
import { Box, Container, Typography } from '@mui/material';
import Navbar from './Navbar';

export const LEGAL_CONTACT_EMAIL = 'support@timberfoottech.com';

// Shared layout for the privacy policy and terms of use
const LegalPage = ({ title, description, path, lastUpdated, children }) => (
    <Box>
        <SeoHead title={title} description={description} path={path} />
        <Navbar />
        <Container component="main" maxWidth="md" sx={{ py: 5 }}>
            <Typography component="h1" variant="h3">
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 4 }}>
                Last updated {lastUpdated}
            </Typography>
            <Box
                sx={{
                    '& h2': { mt: 4, mb: 1 },
                    '& p, & li': { color: 'text.secondary', lineHeight: 1.7 },
                    '& ul': { pl: 3, my: 1 },
                }}
            >
                {children}
            </Box>
        </Container>
    </Box>
);

export const Section = ({ heading, children }) => (
    <>
        <Typography variant="h6" component="h2">
            {heading}
        </Typography>
        {children}
    </>
);

export default LegalPage;