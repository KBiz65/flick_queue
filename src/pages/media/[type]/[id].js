import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Avatar, Box, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Navbar from '../../../components/Navbar';
import MediaRow from '../../../components/MediaRow';
import { tmdbGet, allowsAdultContent, toMediaCard } from '@/lib/tmdb';

const MEDIA_TYPES = ['movie', 'tv'];
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function formatDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

function formatRuntime(minutes) {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours ? `${hours}h ${mins}m` : `${mins}m`;
}

function plural(count, word) {
    return `${count} ${word}${count === 1 ? '' : 's'}`;
}

const CastRow = ({ cast }) => (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {cast.map((person) => (
            <Box key={person.id} sx={{ minWidth: 120, maxWidth: 120, textAlign: 'center' }}>
                {person.profilePath ? (
                    <Image
                        src={`${TMDB_IMAGE_BASE}/w185${person.profilePath}`}
                        alt={person.name}
                        width={120}
                        height={180}
                        style={{ borderRadius: '5px', objectFit: 'cover' }}
                    />
                ) : (
                    <Avatar variant="rounded" sx={{ width: 120, height: 180, fontSize: 32 }}>
                        {person.name.charAt(0)}
                    </Avatar>
                )}
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                    {person.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {person.character}
                </Typography>
            </Box>
        ))}
    </Box>
);

const MediaDetails = ({ media }) => {
    const facts = [media.releaseDate, media.length].filter(Boolean);

    return (
        <>
            <Head>
                <title>{`${media.title}${media.year ? ` (${media.year})` : ''} | FlickQueue`}</title>
                <meta name="description" content={media.overview || media.title} />
            </Head>
            <Navbar />
            {media.backdropPath && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 600,
                        zIndex: -1,
                        backgroundImage: `linear-gradient(to bottom, rgba(8, 1, 1, 0.6), #080101), url(${TMDB_IMAGE_BASE}/w1280${media.backdropPath})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                    }}
                />
            )}
            <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4, lg: 3 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            src={media.posterPath ? `${TMDB_IMAGE_BASE}/w500${media.posterPath}` : '/ImageNotAvailable.png'}
                            alt={media.title}
                            width={342}
                            height={513}
                            priority
                            style={{ width: '100%', maxWidth: 342, height: 'auto', borderRadius: '8px', border: '1px solid gray' }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Typography variant="h3" component="h1">
                            {media.title}
                            {media.year && (
                                <Typography component="span" variant="h4" sx={{ color: 'text.secondary', ml: 2 }}>
                                    ({media.year})
                                </Typography>
                            )}
                        </Typography>

                        {media.tagline && (
                            <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 1 }}>
                                {media.tagline}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            {media.rating > 0 && (
                                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                    <StarIcon sx={{ color: '#F5C518' }} />
                                    <Typography variant="h6">{media.rating}</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        ({media.voteCount.toLocaleString('en-US')} votes)
                                    </Typography>
                                </Stack>
                            )}
                            {facts.map((fact) => (
                                <Typography key={fact} variant="body1" sx={{ color: 'text.secondary' }}>
                                    {fact}
                                </Typography>
                            ))}
                        </Stack>

                        {media.genres.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
                                {media.genres.map((genre) => (
                                    <Chip key={genre} label={genre} variant="outlined" color="primary" />
                                ))}
                            </Stack>
                        )}

                        <Typography variant="h6" sx={{ mt: 3 }}>
                            Overview
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, maxWidth: 900, lineHeight: 1.7 }}>
                            {media.overview || 'No overview available.'}
                        </Typography>

                        {media.creators.names.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    {media.creators.label}
                                </Typography>
                                <Typography variant="body1">{media.creators.names.join(', ')}</Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>

                {media.cast.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" gutterBottom>
                            Cast
                        </Typography>
                        <CastRow cast={media.cast} />
                    </Box>
                )}

                {media.recommendations.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" gutterBottom>
                            More Like This
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
        data = await tmdbGet(`/${type}/${id}`, { append_to_response: 'credits,recommendations' });
    } catch (error) {
        if (error.response?.status === 404) return { notFound: true };
        throw error;
    }

    const includeAdult = await allowsAdultContent(req.headers.cookie);
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
        ].filter(Boolean).join(' · ') || null;

    const creators = isMovie
        ? {
            label: 'Directed by',
            names: (data.credits?.crew || []).filter((person) => person.job === 'Director').map((person) => person.name),
        }
        : {
            label: 'Created by',
            names: (data.created_by || []).map((person) => person.name),
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
    };

    return { props: { media } };
}

export default MediaDetails;