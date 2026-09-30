/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
        // TMDB already serves pre-sized images from its CDN, so skip resizing them on the server
        unoptimized: true,
    },
    // The search page used to be /searchResults. Keep old links and bookmarks working (the ?q= search carries over).
    async redirects() {
        return [{ source: '/searchResults', destination: '/search', permanent: true }];
    },
};

export default nextConfig;