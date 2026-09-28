import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

const INITIAL_COUNT = 25;

const FILTERS = {
    all: () => true,
    movie: (credit) => credit.type === 'movie',
    tv: (credit) => credit.type === 'tv',
};

// Every credit for a person, newest first, filterable by movies or TV
const Filmography = ({ credits }) => {
    const [filter, setFilter] = useState('all');
    const [showAll, setShowAll] = useState(false);

    const filtered = credits.filter(FILTERS[filter]);
    const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
    const movieCount = credits.filter(FILTERS.movie).length;
    const tvCount = credits.length - movieCount;

    return (
        <Box>
            <ToggleButtonGroup
                exclusive
                size="small"
                value={filter}
                onChange={(event, value) => value && setFilter(value)}
                aria-label="Filter credits"
            >
                <ToggleButton value="all">All ({credits.length})</ToggleButton>
                <ToggleButton value="movie">Movies ({movieCount})</ToggleButton>
                <ToggleButton value="tv">TV ({tvCount})</ToggleButton>
            </ToggleButtonGroup>

            <Box component="ol" sx={{ listStyle: 'none', mt: 2, maxWidth: 820 }}>
                {visible.map((credit) => (
                    <Box
                        component="li"
                        key={`${credit.type}-${credit.id}`}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '56px minmax(0, 1fr)',
                            gap: 2,
                            py: 1.5,
                            borderBottom: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                            {credit.year || 'TBA'}
                        </Typography>
                        <Box>
                            <Typography
                                component={Link}
                                href={`/media/${credit.type}/${credit.id}`}
                                sx={{ fontWeight: 600, '&:hover': { color: 'primary.main' } }}
                            >
                                {credit.title}
                            </Typography>
                            {credit.type === 'tv' && (
                                <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                                    TV
                                </Typography>
                            )}
                            {credit.role && (
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {credit.role}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>

            {filtered.length > INITIAL_COUNT && (
                <Button onClick={() => setShowAll(!showAll)} sx={{ mt: 2 }}>
                    {showAll ? 'Show fewer' : `Show all ${filtered.length}`}
                </Button>
            )}
        </Box>
    );
};

export default Filmography;