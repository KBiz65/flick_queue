import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../shared/Navbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ImageList, ImageListItem, IconButton, Tooltip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { selectSearchItem, selectSearchData } from '../../store/slices/searchSlice';

const AllMedia = () => {
    const searchData = useSelector(selectSearchData);
    const searchItem = useSelector(selectSearchItem);
    const [allMovies, setAllMovies] = useState([]);
    const [allTV, setAllTV] = useState([]);
    const [allOther, setAllOther] = useState([]);
    const [currentSearch, setCurrentSearch] = useState('');

    useEffect(() => {
        setAllMovies([]);
        setAllTV([]);
        setAllOther([]);

        if (searchData?.results?.length > 0) {
            setCurrentSearch(searchItem);
        }
        searchData?.results?.forEach((mediaObj) => {
            switch (mediaObj.media_type) {
                case 'movie':
                    setAllMovies((prevMovies) => [...prevMovies, mediaObj]);
                    break;
                case 'tv':
                    setAllTV((prevTV) => [...prevTV, mediaObj]);
                    break;
                default:
                    setAllOther((prevOther) => [...prevOther, mediaObj]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData]);

    useEffect(() => {
        console.log('allMovies: ', allMovies);
        console.log('allTV: ', allTV);
        console.log('allOther: ', allOther);
    }, [allMovies, allTV, allOther]);

    const renderMedia = (mediaArray) => (
        <Box sx={{ display: 'flex', overflowX: 'hidden', alignItems: 'center' }}>
            <IconButton aria-label="back_arrow" size="large">
                <ArrowBackIosNewIcon color="primary" />
            </IconButton>
            <ImageList sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: '16px', '&::-webkit-scrollbar': { display: 'none' } }}>
                {mediaArray.map((item, index) => (
                    <ImageListItem key={index} sx={{
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
                            <img
                                src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                                alt={item.title || item.name}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid gray', borderRadius: '5px' }}
                            />
                            <Box className="mediaActions" sx={{
                                position: 'absolute',
                                bottom: 0,
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-evenly',
                                opacity: 0,
                                transition: 'opacity 0.3s',
                            }}>
                                <Tooltip title="Add to Watchlist">
                                    <IconButton color="primary"
                                        sx={{
                                            backgroundColor: '#080101',
                                            '&:hover': {
                                                backgroundColor: '#080101', // Keeps the background color the same
                                                color: '#ffffff',
                                            },
                                        }}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="View Details">
                                    <IconButton color="primary"
                                    sx={{
                                        backgroundColor: '#080101',
                                        '&:hover': {
                                            backgroundColor: '#080101', // Keeps the background color the same
                                            color: '#ffffff',
                                        },
                                    }}>
                                        <VisibilityIcon />
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
            <IconButton aria-label="forward_arrow" size="large">
                <ArrowForwardIosIcon color="primary" />
            </IconButton>
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 8, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
            <Navbar />
            <Box sx={{ flexGrow: 1, overflowX: 'auto', overflowY: 'hidden' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Search Results for &quot;{currentSearch}&quot;
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Movies
                </Typography>
                {renderMedia(allMovies)}
                <Typography variant="h6" gutterBottom>
                    TV Shows
                </Typography>
                {renderMedia(allTV)}
            </Box>
        </Container>
    );
};

export default AllMedia;
