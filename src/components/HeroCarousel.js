import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import { tmdbImage } from '../lib/images';
import { colors } from '../theme';

const SLIDE_MS = 7000;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const fillBar = keyframes`
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
`;

// Full-width rotating showcase of this week's trending titles. Plays through every slide, then starts over.
// Hovering (or typing in the login form) pauses it so people can read a title before it moves on.
// Anything passed as children (the login form) sits on the right side of the hero.
const HeroCarousel = ({ slides, children }) => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const isPlaying = slides.length > 1 && !isPaused;
    const slide = slides[index];
    const nextSlide = slides[(index + 1) % slides.length];

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setTimeout(() => setIndex((current) => (current + 1) % slides.length), SLIDE_MS);
        return () => clearTimeout(timer);
    }, [index, isPlaying, slides.length]);

    return (
        <Box
            component="section"
            aria-roledescription="carousel"
            aria-label="Trending this week"
            sx={{ position: 'relative', overflow: 'hidden', minHeight: { md: 'calc(100vh - 64px)' }, display: 'flex' }}
        >
            {slide && (
                <Box key={`${slide.type}-${slide.id}`} sx={{ position: 'absolute', inset: 0, animation: `${fadeIn} 900ms ease` }}>
                    <Image
                        src={tmdbImage(slide.backdropPath, 'w1280')}
                        alt=""
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    />
                </Box>
            )}
            {/* Load the next backdrop early so the change is instant */}
            {nextSlide && nextSlide !== slide && (
                <Box sx={{ display: 'none' }}>
                    <Image src={tmdbImage(nextSlide.backdropPath, 'w1280')} alt="" fill sizes="100vw" loading="eager" />
                </Box>
            )}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(90deg, ${colors.theater} 0%, rgba(22, 18, 28, 0.75) 40%, rgba(22, 18, 28, 0.3) 100%),
                        linear-gradient(0deg, ${colors.theater} 0%, rgba(22, 18, 28, 0) 45%)`,
                }}
            />

            <Container
                maxWidth="xl"
                sx={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 400px' },
                    gap: { xs: 5, md: 8 },
                    alignItems: 'end',
                    py: { xs: 5, md: 8 },
                }}
            >
                {slide ? (
                    <Box aria-live={isPlaying ? 'off' : 'polite'} sx={{ maxWidth: 640 }}>
                        <Chip
                            size="small"
                            variant="outlined"
                            label={slide.type === 'movie' ? 'Trending movie' : 'Trending TV show'}
                            sx={{ bgcolor: 'rgba(22, 18, 28, 0.6)' }}
                        />
                        <Typography variant="h1" component="h2" sx={{ mt: 2 }}>
                            {slide.title}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center', color: 'text.secondary' }}>
                            {slide.rating > 0 && (
                                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.primary' }}>
                                    <StarIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                    <Typography sx={{ fontWeight: 700 }}>{slide.rating}</Typography>
                                </Stack>
                            )}
                            {slide.year && <Typography>{slide.year}</Typography>}
                        </Stack>
                        <Typography
                            sx={{
                                mt: 2,
                                maxWidth: '60ch',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {slide.overview}
                        </Typography>
                        <Button component={Link} href={`/media/${slide.type}/${slide.id}`} variant="outlined" size="large" sx={{ mt: 3, bgcolor: 'rgba(22, 18, 28, 0.5)' }}>
                            View details
                        </Button>

                    </Box>
                ) : (
                    <Box sx={{ maxWidth: 640 }}>
                        <Typography variant="h1" component="h2">
                            Keep track of everything you want to watch.
                        </Typography>
                    </Box>
                )}

                <Box>{children}</Box>
            </Container>
        </Box>
    );
};

export default HeroCarousel;