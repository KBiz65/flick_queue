import { Pool } from 'pg';

function createPool() {
    if (process.env.DATABASE_URL) {
        return new Pool({ connectionString: process.env.DATABASE_URL });
    }

    return new Pool({
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT) || 5432,
    });
}

const pool = globalThis.flickQueuePool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
    globalThis.flickQueuePool = pool;
}

export default pool;