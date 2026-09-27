import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, ImageList, ImageListItem, IconButton, Tooltip, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';

// A horizontal, scrollable row of posters. Used on search results, the dashboard, and title pages.
const MediaRow = ({ mediaArray, emptyMessage, mediaType }) => {
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
            {mediaArray.map((item) => {
              const itemType = item.media_type || mediaType;

              return (
              <ImageListItem key={`${itemType}-${item.id}`} sx={{
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
                <Box component={Link} href={`/media/${itemType}/${item.id}`} sx={{
                    width: '185px',
                    height: '278px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                }}>
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
                          onClick={(event) => event.preventDefault()}
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
              );
            })}
          </ImageList>
          <IconButton aria-label="forward_arrow" size="large" onClick={() => scrollRow(1)}>
            <ArrowForwardIosIcon color="primary" />
          </IconButton>
        </Box>
    );
};

export default MediaRow;