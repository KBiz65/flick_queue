import { getUserIdFromRequest } from './auth';

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const UNIQUE_VIOLATION_MESSAGES = {
    users_username_key: 'That username is already taken.',
    users_email_key: 'That email is already in use.',
    watchlists_user_name_key: 'You already have a list with that name.',
    watchlistitems_watchlist_media_key: 'That title is already in this list.',
    ratings_user_media_key: 'You already rated this title.',
};

export function createHandler(methods, { auth = true } = {}) {
    return async function handler(req, res) {
        const method = methods[req.method];

        if (!method) {
            res.setHeader('Allow', Object.keys(methods));
            return res.status(405).json({ message: 'Method not allowed.' });
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
            console.error(`${req.method} ${req.url} failed:`, error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }
    };
}