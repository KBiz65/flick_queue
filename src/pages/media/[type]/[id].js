import React from 'react';
import SeoHead from '../../../components/SeoHead';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Box, Button, Chip, Container, Link as MuiLink, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Navbar from '../../../components/Navbar';
import { MAIN_CONTENT_ID } from '../../../components/SkipLink';
import MediaRow from '../../../components/MediaRow';
import CastRow from '../../../components/CastRow';
import WhereToWatch from '../../../components/WhereToWatch';
import { openAddDialog } from '../../../store/slices/watchlistSlice';
import { posterUrl, tmdbImage } from '../../../lib/images';
import { colors } from '../../../theme';
import { tmdbGet, getViewerSettings, toMediaCard } from '@/lib/tmdb';
import { formatDate } from '@/lib/format';

const MEDIA_TYPES = ['movie', 'tv'];

function formatRuntime(minutes) {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours ? `${hours}h ${mins}m` : `${mins}m`;
}

function plural(count, word) {
    return `${count} ${word}${count === 1 ? '' : 's'}`;
}

// Group TMDB's per-country provider lists into the sections shown under "Where to watch"
const PROVIDER_GROUPS = [
    { key: 'flatrate', label: 'Stream' },
    { key: 'free', label: 'Free' },
    { key: 'ads', label: 'Free with ads' },
    { key: 'rent', label: 'Rent' },
    { key: 'buy', label: 'Buy' },
];

function buildWhereToWatch(providersByRegion, region) {
    const available = providersByRegion?.[region] || {};
    const regionName = new Intl.DisplayNames(['en'], { type: 'region' }).of(region) || region;

    return {
        regionName,
        link: available.link || null,
        groups: PROVIDER_GROUPS.map((group) => ({
            label: group.label,
            providers: (available[group.key] || [])
                .sort((a, b) => a.display_priority - b.display_priority)
                .map((provider) => ({ id: provider.provider_id, name: provider.provider_name, logoPath: provider.logo_path })),
        })).filter((group) => group.providers.length > 0),
    };
}

const MediaDetails = ({ media, isLoggedIn }) => {
    const dispatch = useDispatch();
    const facts = [media.releaseDate, media.length].filter(Boolean);

    return (
        <>
            <SeoHead
                title={`${media.title}${media.year ? ` (${media.year})` : ''}`}
                description={media.overview || `${media.title} on FlickQueue`}
                path={`/media/${media.type}/${media.id}`}
                type={media.type === 'movie' ? 'video.movie' : 'video.tv_show'}
                image={tmdbImage(media.backdropPath, 'w1280') || tmdbImage(media.posterPath, 'w500')}
                imageAlt={media.title}
                card={media.backdropPath ? 'summary_large_image' : 'summary'}
            />
            <Navbar />

            {/* Backdrop with a soft red glow, fading into the page */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: { xs: 420, md: 620 }, zIndex: -1, overflow: 'hidden' }}>
                {media.backdropPath && (
                    <Image src={tmdbImage(media.backdropPath, 'w1280')} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                )}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(ellipse at 20% 0%, rgba(122, 30, 44, 0.45), transparent 60%),
                            linear-gradient(0deg, ${colors.theater} 0%, rgba(22, 18, 28, 0.7) 55%, rgba(22, 18, 28, 0.45) 100%)`,
                    }}
                />
            </Box>

            <Container component="main" id={MAIN_CONTENT_ID} tabIndex={-1} maxWidth="xl" sx={{ pt: { xs: 4, md: 12 }, pb: 8 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px minmax(0, 1fr)' }, gap: { xs: 4, md: 6 }, alignItems: 'end' }}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: { xs: 200, md: 300 },
                            aspectRatio: '2 / 3',
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: 1,
                            borderColor: 'divider',
                            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)',
                        }}
                    >
                        <Image src={posterUrl(media.posterPath, 'w500')} alt={media.title} fill priority sizes="(max-width: 900px) 200px, 300px" style={{ objectFit: 'cover' }} />
                    </Box>

                    <Box>
                        <Typography variant="h1">
                            {media.title}
                        </Typography>
                        {media.tagline && (
                            <Typography variant="h6" component="p" sx={{ color: 'text.secondary', fontWeight: 500, mt: 1.5 }}>
                                {media.tagline}
                            </Typography>
                        )}

                        <Stack direction="row" sx={{ mt: 2.5, alignItems: 'center', flexWrap: 'wrap', columnGap: 3, rowGap: 1 }}>
                            {media.rating > 0 && (
                                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                                    <StarIcon sx={{ color: 'primary.main' }} />
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{media.rating}</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {media.voteCount.toLocaleString('en-US')} votes
                                    </Typography>
                                </Stack>
                            )}
                            {facts.map((fact) => (
                                <Typography key={fact} sx={{ color: 'text.secondary' }}>
                                    {fact}
                                </Typography>
                            ))}
                        </Stack>

                        {media.genres.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
                                {media.genres.map((genre) => (
                                    <Chip key={genre} label={genre} variant="outlined" />
                                ))}
                            </Stack>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlaylistAddIcon />}
                            onClick={(event) => {
                                event.currentTarget.blur();
                                dispatch(openAddDialog({ tmdbId: media.id, type: media.type, title: media.title }));
                            }}
                            sx={{ mt: 3 }}
                        >
                            Add to watchlist
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 70ch) 1fr' }, gap: 6, mt: 6 }}>
                    <Box>
                        <Typography variant="h5" component="h2">
                            Overview
                        </Typography>
                        <Typography sx={{ mt: 1.5, fontSize: '1.05rem', lineHeight: 1.7 }}>
                            {media.overview || 'No overview available.'}
                        </Typography>
                    </Box>
                    <Stack spacing={4}>
                        {media.creators.people.length > 0 && (
                            <Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    {media.creators.label}
                                </Typography>
                                <Typography sx={{ mt: 0.5, fontWeight: 600 }}>
                                    {media.creators.people.map((person, index) => (
                                        <React.Fragment key={person.id}>
                                            {index > 0 && ', '}
                                            <MuiLink component={Link} href={`/person/${person.id}`} color="inherit" underline="hover">
                                                {person.name}
                                            </MuiLink>
                                        </React.Fragment>
                                    ))}
                                </Typography>
                            </Box>
                        )}
                        <WhereToWatch whereToWatch={media.whereToWatch} canChangeRegion={isLoggedIn} />
                    </Stack>
                </Box>

                {media.cast.length > 0 && (
                    <Box sx={{ mt: 7 }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            Cast
                        </Typography>
                        <CastRow cast={media.cast} />
                    </Box>
                )}

                {media.recommendations.length > 0 && (
                    <Box sx={{ mt: 7 }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            More like this
                        </Typography>
                        <MediaRow mediaArray={media.recommendations} mediaType={media.type} emptyMessage="" />
                    </Box>
                )}
            </Container>
        </>
    );
};

export async function getServerSideProps({ params, req }) {
    const { type, id } = params;

    if (!MEDIA_TYPES.includes(type) || !/^\d+$/.test(id)) {
        return { notFound: true };
    }

    let data;
    try {
        data = await tmdbGet(`/${type}/${id}`, { append_to_response: 'credits,recommendations,watch/providers' });
    } catch (error) {
        if (error.response?.status === 404) return { notFound: true };
        throw error;
    }

    const { userId, includeAdult, watchRegion } = await getViewerSettings(req.headers.cookie);
    if (data.adult && !includeAdult) {
        return { notFound: true };
    }

    const isMovie = type === 'movie';
    const releaseDate = isMovie ? data.release_date : data.first_air_date;

    const length = isMovie
        ? formatRuntime(data.runtime)
        : [
            data.number_of_seasons ? plural(data.number_of_seasons, 'season') : null,
            data.number_of_episodes ? plural(data.number_of_episodes, 'episode') : null,
        ].filter(Boolean).join(', ') || null;

    const creators = isMovie
        ? {
            label: 'Directed by',
            people: (data.credits?.crew || [])
                .filter((person) => person.job === 'Director')
                .map((person) => ({ id: person.id, name: person.name })),
        }
        : {
            label: 'Created by',
            people: (data.created_by || []).map((person) => ({ id: person.id, name: person.name })),
        };

    const media = {
        id: data.id,
        type,
        title: isMovie ? data.title : data.name,
        year: releaseDate ? releaseDate.slice(0, 4) : null,
        releaseDate: formatDate(releaseDate),
        length,
        tagline: data.tagline || null,
        overview: data.overview || null,
        rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : 0,
        voteCount: data.vote_count || 0,
        genres: (data.genres || []).map((genre) => genre.name),
        posterPath: data.poster_path || null,
        backdropPath: data.backdrop_path || null,
        creators,
        cast: (data.credits?.cast || []).slice(0, 15).map((person) => ({
            id: person.id,
            name: person.name,
            character: person.character || '',
            profilePath: person.profile_path || null,
        })),
        recommendations: (data.recommendations?.results || [])
            .filter((item) => includeAdult || !item.adult)
            .slice(0, 20)
            .map((item) => toMediaCard(item, type)),
        whereToWatch: buildWhereToWatch(data['watch/providers']?.results, watchRegion),
    };

    return { props: { media, isLoggedIn: Boolean(userId) } };
}

export default MediaDetails;