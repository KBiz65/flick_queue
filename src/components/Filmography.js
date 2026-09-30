import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Box, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export const INITIAL_COUNT = 25;

const FILTERS = {
    all: () => true,
    movie: (credit) => credit.type === 'movie',
    tv: (credit) => credit.type === 'tv',
};

// Every credit for a person, newest first, filterable by movies or TV.
// For very long filmographies the page sends only the first few credits; the rest load when needed.
const Filmography = ({ personId, credits, counts }) => {
    const [filter, setFilter] = useState('all');
    const [showAll, setShowAll] = useState(false);
    const [fullCredits, setFullCredits] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    const loaded = fullCredits || credits;
    const isComplete = loaded.length === counts.all;

    const loadAll = async () => {
        if (isComplete || isLoading) return true;
        setIsLoading(true);
        setLoadError('');
        try {
            const response = await axios.get(`/api/tmdb/person/${personId}/credits`);
            setFullCredits(response.data.credits);
            return true;
        } catch {
            setLoadError('Could not load the full filmography. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // A movie or TV filter needs the whole list to be accurate
    const handleFilterChange = (event, value) => {
        if (!value) return;
        setFilter(value);
        if (value !== 'all') loadAll();
    };

    const handleToggleShowAll = async () => {
        if (showAll) {
            setShowAll(false);
            return;
        }
        if (await loadAll()) setShowAll(true);
    };

    const filtered = loaded.filter(FILTERS[filter]);
    const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
    const total = counts[filter];

    return (
        <Box>
            <ToggleButtonGroup
                exclusive
                size="small"
                value={filter}
                onChange={handleFilterChange}
                aria-label="Filter credits"
            >
                <ToggleButton value="all">All ({counts.all})</ToggleButton>
                <ToggleButton value="movie">Movies ({counts.movie})</ToggleButton>
                <ToggleButton value="tv">TV ({counts.tv})</ToggleButton>
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

            {isLoading && visible.length < Math.min(total, INITIAL_COUNT) && <CircularProgress size={24} sx={{ mt: 2 }} />}

            {loadError && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {loadError}
                </Typography>
            )}

            {total > INITIAL_COUNT && (
                <Button onClick={handleToggleShowAll} disabled={isLoading} sx={{ mt: 2 }}>
                    {showAll ? 'Show fewer' : `Show all ${total}`}
                </Button>
            )}
        </Box>
    );
};

export default Filmography;