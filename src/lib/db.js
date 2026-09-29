import { Pool } from 'pg';

// Postgres is shared with other apps on the server, so keep this app's share of connections small
const POOL_SETTINGS = {
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};

function createPool() {
    const pool = process.env.DATABASE_URL
        ? new Pool({ connectionString: process.env.DATABASE_URL, ...POOL_SETTINGS })
        : new Pool({
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            port: Number(process.env.DATABASE_PORT) || 5432,
            ...POOL_SETTINGS,
        });

    // An idle connection can drop (for example, a Postgres restart). Log it instead of crashing the process.
    pool.on('error', (error) => {
        console.error('Postgres idle client error:', error.message);
    });

    return pool;
}

const pool = globalThis.flickQueuePool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
    globalThis.flickQueuePool = pool;
}

export default pool;