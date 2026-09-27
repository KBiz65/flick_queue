import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CircularProgress, ImageList, ImageListItem, IconButton, Tooltip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import {
    performSearch,
    setSearchItem,
    selectSearchData,
    selectSearchStatus,
    selectSearchError,
} from '../store/slices/searchSlice';

const MediaRow = ({ mediaArray, emptyMessage }) => {
    const rowRef = useRef(null);

    // Scroll the row by most of its visible width, in either direction
    const scrollRow = (direction) => {
        const row = rowRef.current;
        if (!row) return;
        row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: 'smooth' });
    };

    if (mediaArray.length === 0) {
        return (
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                {emptyMessage}
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', overflowX: 'hidden', alignItems: 'center' }}>
          <IconButton aria-label="back_arrow" size="large" onClick={() => scrollRow(-1)}>
            <ArrowBackIosNewIcon color="primary" />
          </IconButton>
          <ImageList ref={rowRef} sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: '16px', '&::-webkit-scrollbar': { display: 'none' } }}>
            {mediaArray.map((item) => (
              <ImageListItem key={`${item.media_type}-${item.id}`} sx={{
                  minWidth: '200px',
                  height: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  position: 'relative',
                  '&:hover .mediaActions': {
                      opacity: 1,
                  }
              }}>
                <Box sx={{
                    width: '185px',
                    height: '278px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                }}
                onClick={() => {/* Navigate to the item's main page */}}>
                  <Image
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : '/ImageNotAvailable.png'}
                    alt={item.title || item.name}
                    width={185}
                    height={278}
                    style={{ border: '1px solid gray', borderRadius: '5px', objectFit: 'cover' }}
                  />
                  <Box className="mediaActions" sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%', // Take up the full width of the image
                      height: '100%', // Take up the full height of the image, making the whole image clickable
                  }}>
                    <Tooltip title="Add to Watchlist">
                      <IconButton color="primary"
                          sx={{
                              position: 'absolute',
                              bottom: 16,
                              right: 16,
                              backgroundColor: '#080101',
                              '&:hover': {
                                  backgroundColor: '#080101', // Keeps the background color the same
                                  color: '#ffffff',
                              },
                          }}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography gutterBottom variant="subtitle1" component="div" sx={{
                    textAlign: 'center',
                    maxWidth: '185px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.25',
                }}>
                  {item.title || item.name}
                </Typography>
              </ImageListItem>
            ))}
          </ImageList>
          <IconButton aria-label="forward_arrow" size="large" onClick={() => scrollRow(1)}>
            <ArrowForwardIosIcon color="primary" />
          </IconButton>
        </Box>
    );
};

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