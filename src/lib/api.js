import { getUserIdFromRequest } from './auth';

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const UNIQUE_VIOLATION_MESSAGES = {
    users_username_lower_key: 'That username is already taken.',
    users_email_lower_key: 'That email is already in use.',
    watchlists_user_name_key: 'You already have a list with that name.',
    watchlistitems_watchlist_media_key: 'That title is already in this list.',
    ratings_user_media_key: 'You already rated this title.',
};

const READ_ONLY_METHODS = new Set(['GET', 'HEAD']);

// Axios errors carry the request config, including the TMDB api_key, so log only a summary of them
function describeError(error) {
    if (error.isAxiosError) {
        return `${error.message} (${error.config?.method?.toUpperCase()} ${error.config?.url})`;
    }
    return error;
}

// Browsers send Origin on cross-site requests. If it's there, it has to be this site.
function isSameOrigin(req) {
    const origin = req.headers.origin;
    if (!origin) return true;
    try {
        return new URL(origin).host === req.headers.host;
    } catch {
        return false;
    }
}

// The app only ever sends JSON. Plain HTML forms from other sites can't, so anything else is rejected.
function isJsonOrEmpty(req) {
    const contentType = req.headers['content-type'];
    if (contentType) {
        return contentType.split(';')[0].trim().toLowerCase() === 'application/json';
    }
    return !Number(req.headers['content-length']) && !req.headers['transfer-encoding'];
}

export function createHandler(methods, { auth = true } = {}) {
    return async function handler(req, res) {
        const method = methods[req.method];

        if (!method) {
            res.setHeader('Allow', Object.keys(methods));
            return res.status(405).json({ message: 'Method not allowed.' });
        }

        if (!READ_ONLY_METHODS.has(req.method)) {
            if (!isSameOrigin(req)) {
                return res.status(403).json({ message: 'Request blocked.' });
            }
            if (!isJsonOrEmpty(req)) {
                return res.status(415).json({ message: 'Requests must be sent as JSON.' });
            }
        }

        if (auth) {
            const userId = getUserIdFromRequest(req);
            if (!userId) {
                return res.status(401).json({ message: 'Please log in to continue.' });
            }
            req.userId = userId;
        }

        try {
            await method(req, res);
        } catch (error) {
            if (error instanceof ApiError) {
                return res.status(error.status).json({ message: error.message });
            }
            if (error.code === '23505') {
                const message = UNIQUE_VIOLATION_MESSAGES[error.constraint] || 'That already exists.';
                return res.status(409).json({ message });
            }
            console.error(`${req.method} ${req.url} failed:`, describeError(error));
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }
    };
}