import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authReducer from '../store/slices/authSlice';
import searchReducer from '../store/slices/searchSlice';

const makeStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
        search: searchReducer,
      },
    });
}

export const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV === 'development' });
