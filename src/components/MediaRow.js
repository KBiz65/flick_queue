import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { openAddDialog } from '../store/slices/watchlistSlice';
import { posterUrl } from '../lib/images';

const POSTER_WIDTH = { xs: 130, sm: 170 };

const arrowSx = (side) => ({
    position: 'absolute',
    top: { xs: 88, sm: 118 },
    [side]: 4,
    transform: 'translateY(-50%)',
    zIndex: 2,
    bgcolor: 'rgba(22, 18, 28, 0.85)',
    border: 1,
    borderColor: 'divider',
    opacity: 0,
    transition: 'opacity 0.2s',
    '&:hover': { bgcolor: 'background.paper' },
    '&:focus-visible': { opacity: 1 },
    '@media (hover: none)': { display: 'none' },
});

// A horizontal, scrollable row of posters, used on the dashboard and title pages.
// With wrap, posters flow onto more lines instead (search results, where Load more adds to the end).
const MediaRow = ({ mediaArray, emptyMessage, mediaType, wrap = false }) => {
    const rowRef = useRef(null);
    const dispatch = useDispatch();

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
        <Box sx={{ position: 'relative', '&:hover .rowArrow': { opacity: 1 } }}>
            {!wrap && (
                <IconButton className="rowArrow" aria-label="Scroll left" onClick={() => scrollRow(-1)} sx={arrowSx('left')}>
                    <ChevronLeftIcon />
                </IconButton>
            )}
            <Box
                ref={rowRef}
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: wrap ? 'wrap' : 'nowrap',
                    overflowX: wrap ? 'visible' : 'auto',
                    scrollSnapType: wrap ? 'none' : 'x proximity',
                    pb: 1,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {mediaArray.map((item) => {
                    const itemType = item.media_type || mediaType;
                    const title = item.title || item.name;
                    const year = item.year || (item.release_date || item.first_air_date || '').slice(0, 4);

                    return (
                        <Box
                            key={`${itemType}-${item.id}`}
                            sx={{ width: POSTER_WIDTH, flexShrink: 0, scrollSnapAlign: 'start', '&:hover .mediaActions, &:focus-within .mediaActions': { opacity: 1 } }}
                        >
                            <Box
                                component={Link}
                                href={`/media/${itemType}/${item.id}`}
                                sx={{
                                    display: 'block',
                                    position: 'relative',
                                    aspectRatio: '2 / 3',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    border: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Image
                                    src={posterUrl(item.poster_path, 'w342')}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 600px) 130px, 170px"
                                    style={{ objectFit: 'cover' }}
                                />
                                <Tooltip title="Add to watchlist">
                                    <IconButton
                                        className="mediaActions"
                                        aria-label={`Add ${title} to a watchlist`}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.currentTarget.blur();
                                            dispatch(openAddDialog({ tmdbId: item.id, type: itemType, title }));
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            '&:hover': { bgcolor: 'primary.main' },
                                            '@media (hover: none)': { opacity: 1 },
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography
                                variant="subtitle2"
                                title={title}
                                sx={{
                                    mt: 1,
                                    lineHeight: 1.3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {title}
                            </Typography>
                            {year && (
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {year}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>
            {!wrap && (
                <IconButton className="rowArrow" aria-label="Scroll right" onClick={() => scrollRow(1)} sx={arrowSx('right')}>
                    <ChevronRightIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default MediaRow;