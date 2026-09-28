import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { checkAuth, logout, setUser } from './slices/authSlice';
import searchReducer from './slices/searchSlice';
import watchlistReducer from './slices/watchlistSlice';

const appReducer = combineReducers({
    auth: authReducer,
    search: searchReducer,
    watchlists: watchlistReducer,
});

// Someone else may use the app next (shared device or expired session), so drop the previous user's lists and searches
const rootReducer = (state, action) => {
    const isNewLogin = setUser.match(action) && !state?.auth.isAuthenticated;
    if (isNewLogin || logout.fulfilled.match(action) || checkAuth.rejected.match(action)) {
        return appReducer({ auth: state?.auth }, action);
    }
    return appReducer(state, action);
};

export const makeStore = () => {
    return configureStore({ reducer: rootReducer });
};