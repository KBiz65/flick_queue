import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Card, CardActionArea, CardContent, LinearProgress, Typography } from '@mui/material';
import { tmdbImage } from '../lib/images';

// A clickable list preview: a 2x2 mosaic of recent posters, the name, and watched progress
const WatchlistCard = ({ watchlist }) => {
    const posters = watchlist.previewPosters.slice(0, 4);
    const progress = watchlist.itemCount ? (watchlist.watchedCount / watchlist.itemCount) * 100 : 0;

    return (
        <Card sx={{ width: 220, flexShrink: 0 }}>
            <CardActionArea component={Link} href={`/watchlists/${watchlist.id}`}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', height: 165, bgcolor: 'background.default' }}>
                    {[0, 1, 2, 3].map((index) =>
                        posters[index] ? (
                            <Box key={index} sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Image src={tmdbImage(posters[index], 'w185')} alt="" fill sizes="110px" style={{ objectFit: 'cover' }} />
                            </Box>
                        ) : (
                            <Box key={index} sx={{ bgcolor: 'divider' }} />
                        )
                    )}
                </Box>
                <CardContent>
                    <Typography variant="subtitle1" noWrap>
                        {watchlist.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {watchlist.itemCount === 0
                            ? 'No titles yet'
                            : `${watchlist.watchedCount} of ${watchlist.itemCount} watched`}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} sx={{ mt: 1.5 }} aria-label={`${watchlist.name} watched progress`} />
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default WatchlistCard;