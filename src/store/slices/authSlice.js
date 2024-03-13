import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  isAuthenticated: false,
  watchLists: [], // Array of watchlists each with an array of watchListItems
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isAuthenticated = true;
      state.firstName = action.payload.firstName; // Assuming firstName is part of the payload
      state.watchLists = action.payload.watchLists; // Assuming watchLists are part of the payload
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.firstName = '';
      state.watchLists = [];
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
