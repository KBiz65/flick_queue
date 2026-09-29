import React, { useEffect, useState } from 'react';
import SeoHead from '../../components/SeoHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import Navbar from '../../components/Navbar';
import WatchlistItemCard from '../../components/WatchlistItemCard';
import { LIMITS } from '../../lib/validation';

const FILTERS = {
    all: () => true,
    toWatch: (item) => !item.watched,
    watched: (item) => item.watched,
};

const WatchlistDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [watchlist, setWatchlist] = useState(null);
    const [items, setItems] = useState([]);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState('');
    const [filter, setFilter] = useState('all');
    const [busyItemId, setBusyItemId] = useState(null);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [renameValues, setRenameValues] = useState({ name: '', description: '' });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;

        // Ignore a response that arrives after the user has moved to a different list
        let isCurrent = true;
        axios
            .get(`/api/watchlists/${id}`)
            .then((response) => {
                if (!isCurrent) return;
                setWatchlist(response.data.watchlist);
                setItems(response.data.items);
            })
            .catch((error) => {
                if (isCurrent) setLoadError(error.response?.data?.message || 'Could not load this list.');
            });

        return () => {
            isCurrent = false;
        };
    }, [router.isReady, id]);

    const handleToggleWatched = async (item) => {
        setActionError('');
        setBusyItemId(item.id);
        try {
            const response = await axios.patch(`/api/watchlists/${id}/items/${item.id}`, { watched: !item.watched });
            setItems((current) =>
                current.map((existing) => (existing.id === item.id ? { ...existing, watched: response.data.item.watched } : existing))
            );
        } catch (error) {
            setActionError(error.response?.data?.message || 'Could not update that title.');
        } finally {
            setBusyItemId(null);
        }
    };

    const handleRemove = async (item) => {
        setActionError('');
        setBusyItemId(item.id);
        try {
            await axios.delete(`/api/watchlists/${id}/items/${item.id}`);
            setItems((current) => current.filter((existing) => existing.id !== item.id));
        } catch (error) {
            setActionError(error.response?.data?.message || 'Could not remove that title.');
        } finally {
            setBusyItemId(null);
        }
    };

    const openRename = () => {
        setRenameValues({ name: watchlist.name, description: watchlist.description || '' });
        setIsRenameOpen(true);
    };

    const handleRename = async (event) => {
        event.preventDefault();
        setActionError('');
        try {
            const response = await axios.put(`/api/watchlists/${id}`, renameValues);
            setWatchlist(response.data.watchlist);
            setIsRenameOpen(false);
        } catch (error) {
            setActionError(error.response?.data?.message || 'Could not rename this list.');
            setIsRenameOpen(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/watchlists/${id}`);
            router.push('/watchlists');
        } catch (error) {
            setActionError(error.response?.data?.message || 'Could not delete this list.');
            setIsDeleteOpen(false);
        }
    };

    if (loadError) {
        return (
            <>
                <Navbar />
                <Container maxWidth="xl" sx={{ mt: 3 }}>
                    <Alert severity="error">{loadError}</Alert>
                    <Button component={Link} href="/watchlists" sx={{ mt: 2 }}>
                        Back to My Watchlists
                    </Button>
                </Container>
            </>
        );
    }

    if (!watchlist) {
        return (
            <>
                <Navbar />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            </>
        );
    }

    const watchedCount = items.filter((item) => item.watched).length;
    const visibleItems = items.filter(FILTERS[filter]);

    return (
        <>
            <SeoHead title={watchlist.name} />
            <Navbar />
            <Container maxWidth="xl" sx={{ py: 5 }}>
                <Button component={Link} href="/watchlists" size="small" sx={{ mb: 2, ml: -1.5 }}>
                    Back to My Watchlists
                </Button>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                    <Box>
                        <Typography variant="h2" component="h1">
                            {watchlist.name}
                        </Typography>
                        {watchlist.description && (
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                {watchlist.description}
                            </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {items.length === 0 ? 'No titles yet' : `${watchedCount} of ${items.length} watched`}
                        </Typography>
                        {items.length > 0 && (
                            <LinearProgress
                                variant="determinate"
                                value={(watchedCount / items.length) * 100}
                                sx={{ mt: 1, width: 220 }}
                                aria-label="Watched progress"
                            />
                        )}
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={openRename}>
                            Rename
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => setIsDeleteOpen(true)}>
                            Delete list
                        </Button>
                    </Stack>
                </Stack>

                {actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}

                {items.length > 0 && (
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={filter}
                        onChange={(event, value) => value && setFilter(value)}
                        sx={{ mt: 3 }}
                    >
                        <ToggleButton value="all">All ({items.length})</ToggleButton>
                        <ToggleButton value="toWatch">To Watch ({items.length - watchedCount})</ToggleButton>
                        <ToggleButton value="watched">Watched ({watchedCount})</ToggleButton>
                    </ToggleButtonGroup>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 4 }}>
                    {visibleItems.map((item) => (
                        <WatchlistItemCard
                            key={item.id}
                            item={item}
                            isBusy={busyItemId === item.id}
                            onToggleWatched={handleToggleWatched}
                            onRemove={handleRemove}
                        />
                    ))}
                </Box>

                {items.length === 0 && (
                    <Typography sx={{ color: 'text.secondary', mt: 3 }}>
                        Search for a movie or show and tap + on its poster to add it here.
                    </Typography>
                )}
                {items.length > 0 && visibleItems.length === 0 && (
                    <Typography sx={{ color: 'text.secondary', mt: 3 }}>Nothing here for this filter.</Typography>
                )}
            </Container>

            <Dialog open={isRenameOpen} onClose={() => setIsRenameOpen(false)} fullWidth maxWidth="xs">
                <Box component="form" onSubmit={handleRename}>
                    <DialogTitle>Rename list</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="dense"
                            value={renameValues.name}
                            onChange={(event) => setRenameValues({ ...renameValues, name: event.target.value })}
                            slotProps={{ htmlInput: { maxLength: LIMITS.listNameMax } }}
                        />
                        <TextField
                            label="Description (optional)"
                            fullWidth
                            margin="dense"
                            multiline
                            minRows={2}
                            value={renameValues.description}
                            onChange={(event) => setRenameValues({ ...renameValues, description: event.target.value })}
                            slotProps={{ htmlInput: { maxLength: LIMITS.listDescriptionMax } }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsRenameOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={!renameValues.name.trim()}>
                            Save
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <DialogTitle>Delete &quot;{watchlist.name}&quot;?</DialogTitle>
                <DialogContent>
                    <Typography>This removes the list and all {items.length} titles in it. This can&apos;t be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WatchlistDetail;