import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Ask the server who is logged in (the auth cookie is httpOnly, so the browser can't read it directly)
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/user/getUserData');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post('/api/auth/logout');
});

const initialState = {
  firstName: '',
  isAuthenticated: false,
  isAuthChecked: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isAuthenticated = true;
      state.isAuthChecked = true;
      state.firstName = action.payload.firstName;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.firstName = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        authSlice.caseReducers.setUser(state, action);
      })
      .addCase(checkAuth.rejected, (state) => {
        authSlice.caseReducers.logoutUser(state);
      })
      .addCase(logout.fulfilled, (state) => {
        authSlice.caseReducers.logoutUser(state);
      });
  },
});

// Export actions
export const { setUser, logoutUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;