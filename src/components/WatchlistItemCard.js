import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { posterUrl } from '../lib/images';

// One title on a watchlist page: poster, title, and the watched / remove controls
const WatchlistItemCard = ({ item, onToggleWatched, onRemove, isBusy }) => (
    <Box sx={{ width: { xs: 150, sm: 170 } }}>
        <Box
            component={Link}
            href={`/media/${item.type}/${item.tmdbId}`}
            sx={{
                display: 'block',
                position: 'relative',
                aspectRatio: '2 / 3',
                borderRadius: 2,
                overflow: 'hidden',
                border: 1,
                borderColor: item.watched ? 'primary.main' : 'divider',
                opacity: item.watched ? 0.55 : 1,
                transition: 'opacity 0.3s, border-color 0.3s',
            }}
        >
            <Image src={posterUrl(item.posterPath, 'w342')} alt={item.title} fill sizes="170px" style={{ objectFit: 'cover' }} />
        </Box>
        <Typography variant="subtitle2" noWrap title={item.title} sx={{ mt: 1 }}>
            {item.title}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.type === 'tv' ? 'TV show' : 'Movie'}
                {item.year ? `, ${item.year}` : ''}
            </Typography>
            <Box>
                <Tooltip title={item.watched ? 'Mark as not watched' : 'Mark as watched'}>
                    <span>
                        <IconButton size="small" color="primary" disabled={isBusy} onClick={() => onToggleWatched(item)}>
                            {item.watched ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Remove from list">
                    <span>
                        <IconButton size="small" disabled={isBusy} onClick={() => onRemove(item)}>
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Stack>
    </Box>
);

export default WatchlistItemCard;