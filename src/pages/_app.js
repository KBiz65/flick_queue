import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { AppCacheProvider } from '@mui/material-nextjs/v16-pagesRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { makeStore } from '../store/store';
import { checkAuth } from '../store/slices/authSlice';
import AddToWatchlistDialog from '../components/AddToWatchlistDialog';
import Footer from '../components/Footer';
import SkipLink from '../components/SkipLink';
import theme from '../theme';
import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/figtree';
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
          <SkipLink />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flex: 1 }}>
              <Component {...pageProps} />
            </Box>
            <Footer />
          </Box>
          <AddToWatchlistDialog />
        </ThemeProvider>
      </Provider>
    </AppCacheProvider>
  );
}

export default MyApp;