import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import MediaRow from '../components/MediaRow';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import {
    performSearch,
    setSearchItem,
    selectSearchData,
    selectSearchStatus,
    selectSearchError,
} from '../store/slices/searchSlice';

const AllMedia = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchData = useSelector(selectSearchData);
    const status = useSelector(selectSearchStatus);
    const error = useSelector(selectSearchError);
    const currentSearch = typeof router.query.q === 'string' ? router.query.q : '';

    // Run the search from the URL so refreshing or sharing the page works
    useEffect(() => {
        if (!router.isReady || !currentSearch) return;
        dispatch(setSearchItem(currentSearch));
        dispatch(performSearch(currentSearch));
    }, [router.isReady, currentSearch, dispatch]);

    const results = searchData?.results || [];
    const allMovies = results.filter((mediaObj) => mediaObj.media_type === 'movie');
    const allTV = results.filter((mediaObj) => mediaObj.media_type === 'tv');

    return (
        <>
            <Head>
                <title>{currentSearch ? `${currentSearch} | FlickQueue` : 'Search | FlickQueue'}</title>
            </Head>
            <Navbar />
            <Container maxWidth="xl" sx={{ py: 5 }}>
                <Typography variant="h2" component="h1">
                    Results for &ldquo;{currentSearch}&rdquo;
                </Typography>
                {status === 'loading' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress />
                    </Box>
                )}
                {status === 'failed' && (
                    <Typography variant="body1" color="error" sx={{ mt: 3 }}>
                        {error || 'Search failed. Please try again.'}
                    </Typography>
                )}
                {status === 'succeeded' && (
                    <>
                        <Box component="section" sx={{ mt: 5 }}>
                            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                                Movies
                            </Typography>
                            <MediaRow mediaArray={allMovies} emptyMessage="No movies match this search." />
                        </Box>
                        <Box component="section" sx={{ mt: 5 }}>
                            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                                TV shows
                            </Typography>
                            <MediaRow mediaArray={allTV} emptyMessage="No TV shows match this search." />
                        </Box>
                    </>
                )}
            </Container>
        </>
    );
};

export default AllMedia;