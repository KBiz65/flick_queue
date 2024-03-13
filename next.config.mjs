/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        { source: '/login', destination: '/loginAndSignup/login' },
        { source: '/signup', destination: '/loginAndSignup/signup' },
        { source: '/dashboard', destination: '/userDashboard/dashboard'}
      ];
    },
  };
  
  export default nextConfig;
  