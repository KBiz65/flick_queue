import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const performSearch = createAsyncThunk('search/performSearch', async (searchTerm, { rejectWithValue }) => {
    if (!searchTerm?.trim()) {
        return rejectWithValue('Search term cannot be empty');
    }

    try {
        const response = await axios.get('/api/tmdb/multiSearch', { params: { searchItem: searchTerm.trim() } });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
});

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchItem: '',
        searchData: {},
        isSearchInvalid: false,
        status: 'idle',
        error: null,
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
            .addCase(performSearch.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(performSearch.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.searchData = action.payload;
                state.isSearchInvalid = false;
            })
            .addCase(performSearch.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isSearchInvalid = true;
            });
    }
});

// Actions
export const { setSearchItem, setIsSearchInvalid } = searchSlice.actions;

// Selectors
export const selectSearchData = (state) => state.search.searchData;
export const selectSearchStatus = (state) => state.search.status;
export const selectSearchError = (state) => state.search.error;

// Reducer
export default searchSlice.reducer;