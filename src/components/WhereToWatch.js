import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Link as MuiLink, Stack, Tooltip, Typography } from '@mui/material';
import { tmdbImage } from '../lib/images';

// Streaming, rental, and purchase options for one country. Data comes from JustWatch through TMDB,
// which requires crediting JustWatch and linking to TMDB's watch page rather than directly to each service.
const WhereToWatch = ({ whereToWatch, canChangeRegion }) => {
    const { regionName, link, groups } = whereToWatch;

    return (
        <Box>
            <Typography variant="h6" component="h2">
                Where to watch
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                In {regionName}
                {canChangeRegion && (
                    <>
                        {' '}
                        <MuiLink component={Link} href="/profile" sx={{ fontWeight: 600 }}>
                            Change
                        </MuiLink>
                    </>
                )}
            </Typography>

            {groups.length === 0 ? (
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                    Not available to stream, rent, or buy in {regionName} right now.
                </Typography>
            ) : (
                <Stack spacing={2} sx={{ mt: 2 }}>
                    {groups.map((group) => (
                        <Box key={group.label}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                {group.label}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {group.providers.map((provider) => (
                                    <Tooltip key={provider.id} title={provider.name}>
                                        <Box
                                            {...(link
                                                ? { component: 'a', href: link, target: '_blank', rel: 'noopener noreferrer' }
                                                : { component: 'div' })}
                                            aria-label={`${group.label} on ${provider.name}`}
                                            sx={{
                                                position: 'relative',
                                                width: 44,
                                                height: 44,
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                border: 1,
                                                borderColor: 'divider',
                                                display: 'block',
                                            }}
                                        >
                                            <Image src={tmdbImage(provider.logoPath, 'w92')} alt={provider.name} fill sizes="44px" />
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Stack>
            )}

            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                Streaming data from{' '}
                <MuiLink href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer" color="inherit">
                    JustWatch
                </MuiLink>
            </Typography>
        </Box>
    );
};

export default WhereToWatch;