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
            <Container maxWidth="xl" sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1, overflowX: 'auto', overflowY: 'hidden' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Search Results for &quot;{currentSearch}&quot;
                    </Typography>
                    {status === 'loading' && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {status === 'failed' && (
                        <Typography variant="body1" color="error">
                            {error || 'Search failed. Please try again.'}
                        </Typography>
                    )}
                    {status === 'succeeded' && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Movies
                            </Typography>
                            <MediaRow mediaArray={allMovies} emptyMessage="No movies found." />
                            <Typography variant="h6" gutterBottom>
                                TV Shows
                            </Typography>
                            <MediaRow mediaArray={allTV} emptyMessage="No TV shows found." />
                        </>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default AllMedia;