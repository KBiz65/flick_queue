import React from 'react';
import Image from 'next/image';
import { Box, Container, Link as MuiLink, Stack, Typography } from '@mui/material';

// TMDB's terms require their logo and disclaimer on the site, and watch provider data requires crediting JustWatch
const Footer = () => {
    return (
        <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1.5, md: 3 }}
                    sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                >
                    <MuiLink
                        href="https://www.themoviedb.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="The Movie Database (TMDB)"
                        sx={{ display: 'flex', flexShrink: 0 }}
                    >
                        <Image src="/tmdb-logo.svg" alt="TMDB" width={70} height={30} />
                    </MuiLink>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Streaming availability data provided by{' '}
                        <MuiLink href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer" color="inherit">
                            JustWatch
                        </MuiLink>
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        © 2026 FlickQueue
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;