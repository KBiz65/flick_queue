import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import MediaRow from '../components/MediaRow';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, CircularProgress } from '@mui/material';
import { performSearch, loadMoreResults, setSearchItem, selectSearch } from '../store/slices/searchSlice';

const AllMedia = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const search = useSelector(selectSearch);
    const currentSearch = typeof router.query.q === 'string' ? router.query.q.trim() : '';

    // Run the search from the URL so refreshing or sharing the page works
    useEffect(() => {
        if (!router.isReady || !currentSearch) return;
        dispatch(setSearchItem(currentSearch));
        dispatch(performSearch(currentSearch));
    }, [router.isReady, currentSearch, dispatch]);

    // Stored results can belong to an earlier search until the new one starts
    const isThisSearch = search.query === currentSearch;
    const status = isThisSearch ? search.status : 'loading';
    const allMovies = search.results.filter((mediaObj) => mediaObj.media_type === 'movie');
    const allTV = search.results.filter((mediaObj) => mediaObj.media_type === 'tv');
    const hasMore = search.page < search.totalPages;

    if (router.isReady && !currentSearch) {
        return (
            <>
                <SeoHead title="Search" />
                <Navbar />
                <Container maxWidth="xl" sx={{ py: 5 }}>
                    <Typography variant="h2" component="h1">
                        Search
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 2 }}>
                        Type a movie or TV show title in the search box above.
                    </Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <SeoHead title={currentSearch || 'Search'} />
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
                    <Alert
                        severity="error"
                        sx={{ mt: 3, maxWidth: 560 }}
                        action={
                            <Button color="inherit" size="small" onClick={() => dispatch(performSearch(currentSearch))}>
                                Try again
                            </Button>
                        }
                    >
                        {search.error}
                    </Alert>
                )}
                {status === 'succeeded' && (
                    <>
                        <Box component="section" sx={{ mt: 5 }}>
                            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                                Movies
                            </Typography>
                            <MediaRow mediaArray={allMovies} emptyMessage="No movies match this search." wrap />
                        </Box>
                        <Box component="section" sx={{ mt: 5 }}>
                            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                                TV shows
                            </Typography>
                            <MediaRow mediaArray={allTV} emptyMessage="No TV shows match this search." wrap />
                        </Box>

                        {search.loadMoreStatus === 'failed' && (
                            <Alert severity="error" sx={{ mt: 3, maxWidth: 560 }}>
                                {search.loadMoreError}
                            </Alert>
                        )}
                        {hasMore && (
                            <Button
                                variant="outlined"
                                onClick={() => dispatch(loadMoreResults())}
                                disabled={search.loadMoreStatus === 'loading'}
                                sx={{ mt: 4 }}
                            >
                                {search.loadMoreStatus === 'loading' ? 'Loading...' : 'Load more results'}
                            </Button>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

export default AllMedia;