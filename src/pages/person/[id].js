import React, { useState } from 'react';
import SeoHead from '../../components/SeoHead';
import Image from 'next/image';
import { Avatar, Box, Button, Container, Stack, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
import MediaRow from '../../components/MediaRow';
import { MAIN_CONTENT_ID } from '../../components/SkipLink';
import Filmography, { INITIAL_COUNT } from '../../components/Filmography';
import { tmdbImage } from '../../lib/images';
import { formatDate } from '@/lib/format';
import { allowsAdultContent } from '@/lib/tmdb';
import { buildFilmography, getPersonWithCredits } from '@/lib/person';

const BIO_PREVIEW_LENGTH = 700;

// Above this many credits, the page sends only the first screenful and the rest load on request
const FULL_CREDITS_LIMIT = 100;

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
            <Container component="main" id={MAIN_CONTENT_ID} tabIndex={-1} maxWidth="xl" sx={{ py: 6 }}>
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

                {person.creditCounts.all > 0 && (
                    <Box component="section" sx={{ mt: 7 }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                            Filmography
                        </Typography>
                        <Filmography personId={person.id} credits={person.credits} counts={person.creditCounts} />
                    </Box>
                )}
            </Container>
        </>
    );
};

export async function getServerSideProps({ params, req }) {
    if (!/^\d+$/.test(params.id)) return { notFound: true };

    let data;
    try {
        data = await getPersonWithCredits(params.id);
    } catch (error) {
        if (error.response?.status === 404) return { notFound: true };
        throw error;
    }

    const includeAdult = await allowsAdultContent(req.headers.cookie);
    if (data.adult && !includeAdult) return { notFound: true };

    const { credits, knownForTitles } = buildFilmography(data.combined_credits, includeAdult);
    const movieCount = credits.filter((credit) => credit.type === 'movie').length;
    const creditCounts = { all: credits.length, movie: movieCount, tv: credits.length - movieCount };

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
        // Very long filmographies would make the page data heavy, so send only what's shown first
        credits: credits.length > FULL_CREDITS_LIMIT ? credits.slice(0, INITIAL_COUNT) : credits,
        creditCounts,
    };

    return { props: { person } };
}

export default PersonDetails;