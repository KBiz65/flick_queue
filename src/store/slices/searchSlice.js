import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// TMDB never returns more than 500 pages of search results
const MAX_PAGES = 500;

async function fetchResultsPage(query, page) {
    const response = await axios.get('/api/tmdb/multiSearch', { params: { searchItem: query, page } });
    return response.data;
}

function errorMessage(error) {
    return error.response?.data?.message || 'Search failed. Please check your connection and try again.';
}

// A new search replaces the current results
export const performSearch = createAsyncThunk('search/performSearch', async (query, { rejectWithValue }) => {
    try {
        return await fetchResultsPage(query, 1);
    } catch (error) {
        return rejectWithValue(errorMessage(error));
    }
});

// The next page of the current search, added below what's already shown
export const loadMoreResults = createAsyncThunk(
    'search/loadMoreResults',
    async (_, { getState, rejectWithValue }) => {
        const { query, page } = getState().search;
        try {
            return { query, data: await fetchResultsPage(query, page + 1) };
        } catch (error) {
            return rejectWithValue(errorMessage(error));
        }
    },
    {
        condition: (_, { getState }) => {
            const { status, loadMoreStatus, page, totalPages } = getState().search;
            return status === 'succeeded' && loadMoreStatus !== 'loading' && page < totalPages;
        },
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchItem: '',
        // Only set when someone submits an empty search box
        isSearchInvalid: false,
        query: '',
        results: [],
        page: 0,
        totalPages: 0,
        status: 'idle',
        error: null,
        loadMoreStatus: 'idle',
        loadMoreError: null,
        requestId: null,
    },
    reducers: {
        setSearchItem: (state, action) => {
            state.searchItem = action.payload;
        },
        setIsSearchInvalid: (state, action) => {
            state.isSearchInvalid = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(performSearch.pending, (state, action) => {
                state.query = action.meta.arg;
                state.requestId = action.meta.requestId;
                state.status = 'loading';
                state.error = null;
                state.results = [];
                state.page = 0;
                state.totalPages = 0;
                state.loadMoreStatus = 'idle';
                state.loadMoreError = null;
            })
            // Responses to an older search that finish late are ignored
            .addCase(performSearch.fulfilled, (state, action) => {
                if (action.meta.requestId !== state.requestId) return;
                state.status = 'succeeded';
                state.results = action.payload.results;
                state.page = action.payload.page;
                state.totalPages = Math.min(action.payload.total_pages || 0, MAX_PAGES);
            })
            .addCase(performSearch.rejected, (state, action) => {
                if (action.meta.requestId !== state.requestId) return;
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(loadMoreResults.pending, (state) => {
                state.loadMoreStatus = 'loading';
                state.loadMoreError = null;
            })
            .addCase(loadMoreResults.fulfilled, (state, action) => {
                if (action.payload.query !== state.query) return;
                const seen = new Set(state.results.map((item) => `${item.media_type}-${item.id}`));
                const newResults = action.payload.data.results.filter((item) => !seen.has(`${item.media_type}-${item.id}`));
                state.results.push(...newResults);
                state.page = action.payload.data.page;
                state.loadMoreStatus = 'idle';
            })
            .addCase(loadMoreResults.rejected, (state, action) => {
                state.loadMoreStatus = 'failed';
                state.loadMoreError = action.payload;
            });
    },
});

// Actions
export const { setSearchItem, setIsSearchInvalid } = searchSlice.actions;

// Selectors
export const selectSearch = (state) => state.search;

// Reducer
export default searchSlice.reducer;