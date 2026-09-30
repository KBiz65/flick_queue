import React from 'react';
import { Box } from '@mui/material';

// Every page's <main> uses this id, so keyboard users can jump past the navbar
export const MAIN_CONTENT_ID = 'main-content';

// Hidden until it gets keyboard focus (the first Tab on any page), then shown at the top left
const SkipLink = () => (
    <Box
        component="a"
        href={`#${MAIN_CONTENT_ID}`}
        sx={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: (theme) => theme.zIndex.tooltip + 1,
            px: 2,
            py: 1,
            borderRadius: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 700,
            transform: 'translateY(-150%)',
            '&:focus': { transform: 'translateY(0)' },
        }}
    >
        Skip to main content
    </Box>
);

export default SkipLink;