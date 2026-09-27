import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const errorMessage = (error, fallback) => error.response?.data?.message || fallback;

// Pass { tmdbId, type } to also learn which lists already contain that title (used by the Add dialog)
export const fetchWatchlists = createAsyncThunk('watchlists/fetchAll', async (media, { rejectWithValue }) => {
    try {
        const params = media ? { tmdbId: media.tmdbId, type: media.type } : {};
        const response = await axios.get('/api/watchlists', { params });
        return response.data.watchlists;
    } catch (error) {
        return rejectWithValue(errorMessage(error, 'Could not load your watchlists.'));
    }
});

export const createWatchlist = createAsyncThunk('watchlists/create', async ({ name, description }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/watchlists', { name, description });
        return response.data.watchlist;
    } catch (error) {
        return rejectWithValue(errorMessage(error, 'Could not create the list.'));
    }
});

export const addToWatchlist = createAsyncThunk('watchlists/addItem', async ({ watchlistId, tmdbId, type }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/watchlists/${watchlistId}/items`, { tmdbId, type });
        return { watchlistId, itemId: response.data.item.id };
    } catch (error) {
        return rejectWithValue(errorMessage(error, 'Could not add the title.'));
    }
});

export const removeFromWatchlist = createAsyncThunk('watchlists/removeItem', async ({ watchlistId, itemId }, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/watchlists/${watchlistId}/items/${itemId}`);
        return { watchlistId, itemId };
    } catch (error) {
        return rejectWithValue(errorMessage(error, 'Could not remove the title.'));
    }
});

const initialState = {
    lists: [],
    status: 'idle',
    error: null,
    // The Add to Watchlist dialog is rendered once in _app; any poster can open it for a title
    dialogMedia: null,
};

export const watchlistSlice = createSlice({
    name: 'watchlists',
    initialState,
    reducers: {
        openAddDialog(state, action) {
            state.dialogMedia = action.payload;
        },
        closeAddDialog(state) {
            state.dialogMedia = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWatchlists.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWatchlists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.lists = action.payload;
            })
            .addCase(fetchWatchlists.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createWatchlist.fulfilled, (state, action) => {
                state.lists.push(action.payload);
            })
            .addCase(addToWatchlist.fulfilled, (state, action) => {
                const list = state.lists.find((item) => item.id === action.payload.watchlistId);
                if (list) {
                    list.mediaItemId = action.payload.itemId;
                    list.itemCount += 1;
                }
            })
            .addCase(removeFromWatchlist.fulfilled, (state, action) => {
                const list = state.lists.find((item) => item.id === action.payload.watchlistId);
                if (list) {
                    list.mediaItemId = null;
                    list.itemCount = Math.max(0, list.itemCount - 1);
                }
            });
    },
});

export const { openAddDialog, closeAddDialog } = watchlistSlice.actions;

export const selectWatchlists = (state) => state.watchlists.lists;
export const selectWatchlistStatus = (state) => state.watchlists.status;
export const selectWatchlistError = (state) => state.watchlists.error;
export const selectDialogMedia = (state) => state.watchlists.dialogMedia;

export default watchlistSlice.reducer;