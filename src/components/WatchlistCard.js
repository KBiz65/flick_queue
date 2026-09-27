import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';

// A clickable list preview: a 2x2 mosaic of recent posters, the name, and watched progress
const WatchlistCard = ({ watchlist }) => {
    const posters = watchlist.previewPosters.slice(0, 4);

    return (
        <Card sx={{ width: 220, flexShrink: 0 }}>
            <CardActionArea component={Link} href={`/watchlists/${watchlist.id}`}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        height: 165,
                        backgroundColor: '#1a1a1a',
                    }}
                >
                    {[0, 1, 2, 3].map((index) =>
                        posters[index] ? (
                            <Box key={index} sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Image
                                    src={`https://image.tmdb.org/t/p/w185${posters[index]}`}
                                    alt=""
                                    fill
                                    sizes="110px"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        ) : (
                            <Box key={index} sx={{ border: '1px solid #262626' }} />
                        )
                    )}
                </Box>
                <CardContent>
                    <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
                        {watchlist.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {watchlist.itemCount === 0
                            ? 'Empty'
                            : `${watchlist.watchedCount} of ${watchlist.itemCount} watched`}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default WatchlistCard;