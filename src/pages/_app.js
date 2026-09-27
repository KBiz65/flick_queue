import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { AppCacheProvider } from '@mui/material-nextjs/v16-pagesRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { makeStore } from '../store/store';
import { checkAuth } from '../store/slices/authSlice';
import AddToWatchlistDialog from '../components/AddToWatchlistDialog';
import theme from '../theme';
import '../styles/globals.css';

function AuthCheck() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return null;
}

function MyApp(props) {
  const { Component, pageProps } = props;
  const [store] = useState(makeStore);

  return (
    <AppCacheProvider {...props}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthCheck />
          <Component {...pageProps} />
          <AddToWatchlistDialog />
        </ThemeProvider>
      </Provider>
    </AppCacheProvider>
  );
}

export default MyApp;