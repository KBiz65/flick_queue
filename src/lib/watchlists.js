import pool from './db';
import { ApiError } from './api';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value) {
    return typeof value === 'string' && UUID_PATTERN.test(value);
}

// Every watchlist route calls this first, so users can only ever touch their own lists
export async function getOwnedWatchlist(watchlistId, userId) {
    if (!isUuid(watchlistId)) {
        throw new ApiError(404, 'Watchlist not found.');
    }

    const { rows } = await pool.query(
        'SELECT watchlist_id, name, description FROM watchlists WHERE watchlist_id = $1 AND user_id = $2',
        [watchlistId, userId]
    );

    if (rows.length === 0) {
        throw new ApiError(404, 'Watchlist not found.');
    }

    return rows[0];
}

export function validateWatchlistInput(body) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    if (!name) {
        throw new ApiError(422, 'Please give your list a name.');
    }
    if (name.length > 100) {
        throw new ApiError(422, 'List names can be up to 100 characters.');
    }

    return { name, description: description || null };
}

export function toWatchlistJson(row) {
    return {
        id: row.watchlist_id,
        name: row.name,
        description: row.description,
    };
}