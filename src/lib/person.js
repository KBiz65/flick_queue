import { tmdbGetCached, toMediaCard } from './tmdb';

const PERSON_TTL_MS = 10 * 60 * 1000;

// Shared by the person page and its full-credits API route, so "Show all" usually reuses the cached response
export function getPersonWithCredits(personId) {
    return tmdbGetCached(`/person/${personId}`, { append_to_response: 'combined_credits' }, PERSON_TTL_MS);
}

// Merge cast and crew credits into one entry per title, with every role they had on it
function mergeCredits(combinedCredits, includeAdult) {
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

// Every credit newest first (titles without a date yet go to the top), plus their 10 best-known titles by TMDB votes
export function buildFilmography(combinedCredits, includeAdult) {
    const entries = mergeCredits(combinedCredits, includeAdult);

    const credits = [...entries]
        .sort((a, b) => (b.date || '9999').localeCompare(a.date || '9999'))
        .map(({ raw, date, roles }) => ({
            id: raw.id,
            type: raw.media_type,
            title: raw.title || raw.name,
            year: date.slice(0, 4) || null,
            role: roles.join(', '),
        }));

    const knownForTitles = [...entries]
        .sort((a, b) => (b.raw.vote_count || 0) - (a.raw.vote_count || 0))
        .slice(0, 10)
        .map(({ raw }) => toMediaCard(raw, raw.media_type));

    return { credits, knownForTitles };
}