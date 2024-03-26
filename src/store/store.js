import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from './slices/authSlice';
import searchReducer from './slices/searchSlice';

// Initialize the store
const makeStore = () => configureStore({
  reducer: {
    // Reducers go here
    auth: authReducer,
    search: searchReducer,
  },
});

// Export an enhanced version of the store that works with Next.js
export const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV === 'development' });
