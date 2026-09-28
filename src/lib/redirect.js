const FALLBACK = '/dashboard';
const CHECK_ORIGIN = 'https://flickqueue.invalid';

// Only allow redirects to pages inside FlickQueue. Blocks "?from=https://evil.com", "//evil.com",
// and tricks like "/%09/evil.com" or "/\evil.com" that browsers turn into another site.
export function getSafeRedirect(from) {
    if (typeof from !== 'string' || !from.startsWith('/') || /[\\\s]/.test(from)) {
        return FALLBACK;
    }

    try {
        const url = new URL(from, CHECK_ORIGIN);
        if (url.origin !== CHECK_ORIGIN) {
            return FALLBACK;
        }
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return FALLBACK;
    }
}