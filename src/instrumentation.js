// Runs once when the server starts. A missing or weak JWT secret is logged here and the app refuses to serve pages.
export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') return;
    const { getSecret } = await import('./lib/auth');
    getSecret();
}