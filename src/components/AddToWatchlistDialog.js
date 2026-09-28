import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    addToWatchlist,
    closeAddDialog,
    createWatchlist,
    fetchWatchlists,
    removeFromWatchlist,
    selectDialogMedia,
    selectWatchlistError,
    selectWatchlists,
    selectWatchlistStatus,
} from '../store/slices/watchlistSlice';

const DEFAULT_LIST_NAME = 'My Watchlist';

// Rendered once in _app. Any poster's + button (or the title page button) opens it for a title.
const AddToWatchlistDialog = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const media = useSelector(selectDialogMedia);
    const lists = useSelector(selectWatchlists);
    const status = useSelector(selectWatchlistStatus);
    const loadError = useSelector(selectWatchlistError);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
    const [newListName, setNewListName] = useState('');
    const [busyListId, setBusyListId] = useState(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const handleClose = () => {
        dispatch(closeAddDialog());
        setNewListName('');
        setError('');
        setNotice('');
    };

    // When the dialog opens: send logged-out users to log in, otherwise load their lists
    useEffect(() => {
        if (!media || !isAuthChecked) return;

        if (!isAuthenticated) {
            dispatch(closeAddDialog());
            router.push({ pathname: '/', query: { from: router.asPath } });
            return;
        }

        const loadLists = async () => {
            const result = await dispatch(fetchWatchlists(media));
            if (!fetchWatchlists.fulfilled.match(result) || result.payload.length > 0) return;

            // First time saving anything: create "My Watchlist" and add the title to it
            const created = await dispatch(createWatchlist({ name: DEFAULT_LIST_NAME }));
            if (createWatchlist.fulfilled.match(created)) {
                await dispatch(addToWatchlist({ watchlistId: created.payload.id, tmdbId: media.tmdbId, type: media.type }));
                setNotice(`Added to ${DEFAULT_LIST_NAME}.`);
            }
        };
        loadLists();
    }, [media, isAuthChecked, isAuthenticated, dispatch, router]);

    const handleToggle = async (list) => {
        setError('');
        setNotice('');
        setBusyListId(list.id);

        const result = list.mediaItemId
            ? await dispatch(removeFromWatchlist({ watchlistId: list.id, itemId: list.mediaItemId }))
            : await dispatch(addToWatchlist({ watchlistId: list.id, tmdbId: media.tmdbId, type: media.type }));

        if (result.error) setError(result.payload);
        setBusyListId(null);
    };

    const handleCreate = async (event) => {
        event.preventDefault();
        setError('');
        setNotice('');

        const created = await dispatch(createWatchlist({ name: newListName }));
        if (created.error) {
            setError(created.payload);
            return;
        }

        const added = await dispatch(addToWatchlist({ watchlistId: created.payload.id, tmdbId: media.tmdbId, type: media.type }));
        if (added.error) {
            setError(added.payload);
            return;
        }

        setNewListName('');
        setNotice(`Added to ${created.payload.name}.`);
    };

    return (
        <Dialog open={Boolean(media) && isAuthenticated} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Add &quot;{media?.title}&quot; to...</DialogTitle>
            <DialogContent>
                {status === 'failed' ? (
                    <Alert severity="error">{loadError}</Alert>
                ) : status !== 'succeeded' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : (
                    <Stack>
                        {lists.map((list) => (
                            <FormControlLabel
                                key={list.id}
                                control={
                                    <Checkbox
                                        checked={Boolean(list.mediaItemId)}
                                        disabled={busyListId === list.id}
                                        onChange={() => handleToggle(list)}
                                    />
                                }
                                label={
                                    <Typography>
                                        {list.name}{' '}
                                        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                                            ({list.itemCount})
                                        </Typography>
                                    </Typography>
                                }
                            />
                        ))}
                    </Stack>
                )}

                <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="New list name"
                        value={newListName}
                        onChange={(event) => setNewListName(event.target.value)}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                    />
                    <Button type="submit" variant="outlined" disabled={!newListName.trim()}>
                        Create
                    </Button>
                </Box>

                {notice && <Alert severity="success" sx={{ mt: 2 }}>{notice}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddToWatchlistDialog;