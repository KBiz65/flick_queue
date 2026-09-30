import React, { useEffect, useState } from 'react';
import SeoHead from '../../components/SeoHead';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import WatchlistCard from '../../components/WatchlistCard';
import { MAIN_CONTENT_ID } from '../../components/SkipLink';
import {
    createWatchlist,
    fetchWatchlists,
    selectWatchlistError,
    selectWatchlists,
    selectWatchlistStatus,
} from '../../store/slices/watchlistSlice';

const Watchlists = () => {
    const dispatch = useDispatch();
    const lists = useSelector(selectWatchlists);
    const status = useSelector(selectWatchlistStatus);
    const loadError = useSelector(selectWatchlistError);
    const [newListName, setNewListName] = useState('');
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        dispatch(fetchWatchlists());
    }, [dispatch]);

    const handleCreate = async (event) => {
        event.preventDefault();
        setCreateError('');

        const result = await dispatch(createWatchlist({ name: newListName }));
        if (result.error) {
            setCreateError(result.payload);
            return;
        }
        setNewListName('');
    };

    return (
        <>
            <SeoHead title="My Watchlists" />
            <Navbar />
            <Container component="main" id={MAIN_CONTENT_ID} tabIndex={-1} maxWidth="xl" sx={{ py: 5 }}>
                <Typography variant="h2" component="h1">
                    My Watchlists
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                    Group titles however you like: date night, weekend binge, or classics to catch up on.
                </Typography>

                <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 1, maxWidth: 480, mt: 3 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="New list name"
                        value={newListName}
                        onChange={(event) => setNewListName(event.target.value)}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                    />
                    <Button type="submit" variant="contained" disabled={!newListName.trim()} sx={{ whiteSpace: 'nowrap' }}>
                        Create list
                    </Button>
                </Box>
                {createError && <Alert severity="error" sx={{ mt: 2, maxWidth: 480 }}>{createError}</Alert>}

                <Box sx={{ mt: 4 }}>
                    {status === 'loading' && lists.length === 0 && <CircularProgress />}
                    {status === 'failed' && <Alert severity="error">{loadError}</Alert>}
                    {status === 'succeeded' && lists.length === 0 && (
                        <Typography sx={{ color: 'text.secondary' }}>
                            You don&apos;t have any lists yet. Create one above, or tap + on any poster to start saving titles.
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {lists.map((watchlist) => (
                            <WatchlistCard key={watchlist.id} watchlist={watchlist} />
                        ))}
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Watchlists;