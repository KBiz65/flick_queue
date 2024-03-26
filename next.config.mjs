/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            { source: '/home', destination: '/' },
            { source: '/login', destination: '/loginAndSignup/login' },
            { source: '/signup', destination: '/loginAndSignup/signup' },
            { source: '/dashboard', destination: '/user/dashboard' },
            { source: '/profile', destination: '/user/profile' },
            { source: '/searchResults', destination: '/searches/allMedia' }
        ];
    },
};

export default nextConfig;
