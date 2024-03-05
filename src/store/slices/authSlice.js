import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  isAuthenticated: false,
  user: null, // May contain additional user info beyond firstName
  error: null,
  watchLists: [], // Array of watchlist objects
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isAuthenticated = true;
      state.firstName = action.payload.firstName; // Assuming firstName is part of the payload
      state.watchLists = action.payload.watchLists; // Assuming watchLists are part of the payload
      state.user = action.payload; // Assuming payload contains user info
      state.error = null;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.firstName = '';
      state.watchLists = [];
      state.user = null;
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    // Add any other reducers for managing watchLists etc., as necessary
  },
  // Consider adding extraReducers if you're handling async thunks
});

// Export actions
export const { setUser, logoutUser, setError } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
