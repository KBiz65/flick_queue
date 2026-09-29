import React, { useState } from 'react';
import SeoHead from '../../components/SeoHead';
import Image from 'next/image';
import { Avatar, Box, Button, Container, Stack, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import MediaRow from '../../components/MediaRow';
import Filmography from '../../components/Filmography';
import { tmdbImage } from '../../lib/images';
import { formatDate } from '@/lib/format';
import { tmdbGet, allowsAdultContent, toMediaCard } from '@/lib/tmdb';

const BIO_PREVIEW_LENGTH = 700;

const DEPARTMENT_LABELS = {
    Acting: 'Acting',
    Directing: 'Directing',
    Writing: 'Writing',
    Production: 'Producing',
    Sound: 'Music and sound',
    Camera: 'Cinematography',
    Editing: 'Editing',
    Creator: 'Creating',
};

function yearsBetween(start, end) {
    const from = new Date(start);
    const to = end ? new Date(end) : new Date();
    let years = to.getUTCFullYear() - from.getUTCFullYear();
    const hadBirthday =
        to.getUTCMonth() > from.getUTCMonth() ||
        (to.getUTCMonth() === from.getUTCMonth() && to.getUTCDate() >= from.getUTCDate());
    if (!hadBirthday) years -= 1;
    return years;
}

const Fact = ({ label, children }) => (
    <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {label}
        </Typography>
        <Typography sx={{ fontWeight: 600 }}>{children}</Typography>
    </Box>
);

const PersonDetails = ({ person }) => {
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const isBioLong = person.biography.length > BIO_PREVIEW_LENGTH;
    const bio = isBioLong && !isBioExpanded ? `${person.biography.slice(0, BIO_PREVIEW_LENGTH).trimEnd()}...` : person.biography;

    return (
        <>
            <SeoHead
                title={person.name}
                description={person.biography || `${person.name} on FlickQueue`}
                path={`/person/${person.id}`}
                type="profile"
                image={tmdbImage(person.profilePath, 'h632')}
                imageAlt={person.name}
                card="summary"
            />
            <Navbar />
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px minmax(0, 1fr)' }, gap: { xs: 4, md: 6 } }}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: { xs: 200, md: 300 },
                            aspectRatio: '2 / 3',
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: 1,
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                        }}
                    >
                        {person.profilePath ? (
                            <Image src={tmdbImage(person.profilePath, 'h632')} alt={person.name} fill priority sizes="(max-width: 900px) 200px, 300px" style={{ objectFit: 'cover' }} />
                        ) : (
                            <Avatar variant="square" sx={{ width: '100%', height: '100%', fontSize: 72, bgcolor: 'divider', color: 'text.secondary' }}>
                                {person.name.charAt(0)}
                            </Avatar>
                        )}
                    </Box>

                    <Box>
                        <Typography variant="h1">{person.name}</Typography>

                        <Stack direction="row" sx={{ mt: 3, flexWrap: 'wrap', columnGap: 5, rowGap: 2 }}>
                            {person.knownFor && <Fact label="Known for">{person.knownFor}</Fact>}
                            {person.born && <Fact label="Born">{person.born}</Fact>}
                            {person.placeOfBirth && <Fact label="Birthplace">{person.placeOfBirth}</Fact>}
                            {person.died && <Fact label="Died">{person.died}</Fact>}
                        </Stack>

                        <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
                            Biography
                        </Typography>
                        {person.biography ? (
                            <>
                                {bio.split('\n').filter(Boolean).map((paragraph, index) => (
                                    <Typography key={index} sx={{ mt: 1.5, maxWidth: '70ch', lineHeight: 1.7 }}>
                                        {paragraph}
                                    </Typography>
                                ))}
                                {isBioLong && (
                                    <Button size="small" onClick={() => setIsBioExpanded(!isBioExpanded)} sx={{ mt: 1, ml: -1.5 }}>
                                        {isBioExpanded ? 'Show less' : 'Read more'}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>No biography available.</Typography>
                        )}
                    </Box>
                </Box>

                {person.knownForTitles.length > 0 && (
                    <Box component="section" sx={{ mt: 7 }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            Best known work
                        </Typography>
                        <MediaRow mediaArray={person.knownForTitles} emptyMessage="" />
                    </Box>
                )}

                {person.credits.length > 0 && (
                    <Box component="section" sx={{ mt: 7 }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            Filmography
                        </Typography>
                        <Filmography credits={person.credits} />
                    </Box>
                )}
            </Container>
        </>
    );
};

// Merge cast and crew credits into one entry per title, with every role they had on it
function buildCredits(combinedCredits, includeAdult) {
    const byTitle = new Map();
    const allowed = (credit) => (credit.media_type === 'movie' || credit.media_type === 'tv') && (includeAdult || !credit.adult);

    const addRole = (credit, role) => {
        const key = `${credit.media_type}-${credit.id}`;
        const date = credit.release_date || credit.first_air_date || '';
        if (!byTitle.has(key)) {
            byTitle.set(key, { raw: credit, date, roles: [] });
        }
        if (role && !byTitle.get(key).roles.includes(role)) byTitle.get(key).roles.push(role);
    };

    (combinedCredits?.cast || []).filter(allowed).forEach((credit) => {
        const episodes = credit.media_type === 'tv' && credit.episode_count ? ` (${credit.episode_count} episode${credit.episode_count === 1 ? '' : 's'})` : '';
        addRole(credit, credit.character ? `as ${credit.character}${episodes}` : '');
    });
    (combinedCredits?.crew || []).filter(allowed).forEach((credit) => addRole(credit, credit.job));

    return [...byTitle.values()];
}

export async function getServerSideProps({ params, req }) {
    if (!/^\d+$/.test(params.id)) return { notFound: true };

    let data;
    try {
        data = await tmdbGet(`/person/${params.id}`, { append_to_response: 'combined_credits' });
    } catch (error) {
        if (error.response?.status === 404) return { notFound: true };
        throw error;
    }

    const includeAdult = await allowsAdultContent(req.headers.cookie);
    if (data.adult && !includeAdult) return { notFound: true };

    const entries = buildCredits(data.combined_credits, includeAdult);

    // Newest first; titles without a date yet (announced projects) go to the top
    const credits = [...entries]
        .sort((a, b) => (b.date || '9999').localeCompare(a.date || '9999'))
        .map(({ raw, date, roles }) => ({
            id: raw.id,
            type: raw.media_type,
            title: raw.title || raw.name,
            year: date.slice(0, 4) || null,
            role: roles.join(', '),
        }));

    // Their best-known work: the credits with the most votes on TMDB
    const knownForTitles = [...entries]
        .sort((a, b) => (b.raw.vote_count || 0) - (a.raw.vote_count || 0))
        .slice(0, 10)
        .map(({ raw }) => toMediaCard(raw, raw.media_type));

    const person = {
        id: data.id,
        name: data.name,
        profilePath: data.profile_path || null,
        biography: data.biography || '',
        knownFor: DEPARTMENT_LABELS[data.known_for_department] || data.known_for_department || null,
        born: data.birthday
            ? `${formatDate(data.birthday)}${data.deathday ? '' : ` (age ${yearsBetween(data.birthday)})`}`
            : null,
        died: data.deathday
            ? `${formatDate(data.deathday)}${data.birthday ? ` (aged ${yearsBetween(data.birthday, data.deathday)})` : ''}`
            : null,
        placeOfBirth: data.place_of_birth || null,
        knownForTitles,
        credits,
    };

    return { props: { person } };
}

export default PersonDetails;