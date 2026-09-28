/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
        // TMDB already serves pre-sized images from its CDN, so skip resizing them on the server
        unoptimized: true,
    },
};

export default nextConfig;