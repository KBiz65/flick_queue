// Only allow redirects to pages inside FlickQueue (blocks "?from=https://evil.com" style links)
export function getSafeRedirect(from) {
    if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) {
        return from;
    }
    return '/dashboard';
}