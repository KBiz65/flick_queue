import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, Box, Typography } from '@mui/material';
import { tmdbImage } from '../lib/images';

// Top-billed cast on a title page: photo, actor name, character. Each person links to their page.
const CastRow = ({ cast }) => (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, scrollbarWidth: 'thin' }}>
        {cast.map((person) => (
            <Box
                key={person.id}
                component={Link}
                href={`/person/${person.id}`}
                sx={{ width: 120, flexShrink: 0, display: 'block', '&:hover .castName': { color: 'primary.main' } }}
            >
                <Box sx={{ position: 'relative', aspectRatio: '2 / 3', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
                    {person.profilePath ? (
                        <Image src={tmdbImage(person.profilePath, 'w185')} alt={person.name} fill sizes="120px" style={{ objectFit: 'cover' }} />
                    ) : (
                        <Avatar variant="square" sx={{ width: '100%', height: '100%', fontSize: 36, bgcolor: 'divider', color: 'text.secondary' }}>
                            {person.name.charAt(0)}
                        </Avatar>
                    )}
                </Box>
                <Typography className="castName" variant="subtitle2" sx={{ mt: 1, lineHeight: 1.3 }}>
                    {person.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.3 }}>
                    {person.character}
                </Typography>
            </Box>
        ))}
    </Box>
);

export default CastRow;