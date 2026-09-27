import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import searchReducer from './slices/searchSlice';
import watchlistReducer from './slices/watchlistSlice';

export const makeStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
        search: searchReducer,
        watchlists: watchlistReducer,
      },
    });
}