import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Chip, Container, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
// Anything passed as children (the login form) sits on the right side of the hero.
const HeroCarousel = ({ slides, children }) => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const isPlaying = slides.length > 1 && !isPaused && !prefersReducedMotion;
    const slide = slides[index];
    const nextSlide = slides[(index + 1) % slides.length];

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setTimeout(() => setIndex((current) => (current + 1) % slides.length), SLIDE_MS);
        return () => clearTimeout(timer);
    }, [index, isPlaying, slides.length]);

    const goTo = (step) => setIndex((current) => (current + step + slides.length) % slides.length);

    return (
        <Box
            component="section"
            aria-roledescription="carousel"
            aria-label="Trending this week"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
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

                        <Stack direction="row" spacing={1} sx={{ mt: 4, alignItems: 'center' }}>
                            <IconButton aria-label="Previous title" onClick={() => goTo(-1)} sx={{ border: 1, borderColor: 'divider' }}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton aria-label="Next title" onClick={() => goTo(1)} sx={{ border: 1, borderColor: 'divider' }}>
                                <ChevronRightIcon />
                            </IconButton>
                            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 56, textAlign: 'center' }}>
                                {index + 1} / {slides.length}
                            </Typography>
                            <Box sx={{ flexGrow: 1, maxWidth: 160, height: 3, borderRadius: 999, bgcolor: 'divider', overflow: 'hidden' }}>
                                <Box
                                    key={`${index}-${isPlaying}`}
                                    sx={{
                                        height: '100%',
                                        bgcolor: 'primary.main',
                                        transformOrigin: 'left',
                                        transform: isPlaying ? undefined : 'scaleX(0)',
                                        animation: isPlaying ? `${fillBar} ${SLIDE_MS}ms linear forwards` : 'none',
                                    }}
                                />
                            </Box>
                        </Stack>
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