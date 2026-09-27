import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import WatchlistCard from '../../components/WatchlistCard';
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
            <Head>
                <title>My Watchlists | FlickQueue</title>
            </Head>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Watchlists
                </Typography>

                <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 1, maxWidth: 480, mt: 2 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="New list name"
                        value={newListName}
                        onChange={(event) => setNewListName(event.target.value)}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                    />
                    <Button type="submit" variant="contained" disabled={!newListName.trim()} sx={{ whiteSpace: 'nowrap' }}>
                        Create List
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