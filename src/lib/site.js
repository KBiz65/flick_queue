export const SITE_NAME = 'FlickQueue';
export const SITE_URL = 'https://flickqueue.timberfoottech.com';
export const DEFAULT_DESCRIPTION = 'Discover movies and TV shows, save them to watchlists, and see where to stream them.';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

export function absoluteUrl(path) {
    return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`;
}

export function truncate(text, max = 160) {
    if (!text || text.length <= max) return text;
    const cut = text.slice(0, max - 3);
    return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:]+$/, '')}...`;
}