// TMDB image URLs in one place. Sizes: w185 and w342 for posters, w780 and w1280 for backdrops.
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const FALLBACK_POSTER = '/ImageNotAvailable.png';

export function tmdbImage(path, size = 'w342') {
    return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
}

export function posterUrl(path, size = 'w342') {
    return tmdbImage(path, size) || FALLBACK_POSTER;
}