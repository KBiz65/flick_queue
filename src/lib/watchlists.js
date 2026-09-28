import pool from './db';
import { ApiError } from './api';
import { LIMITS } from './validation';

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
    if (name.length > LIMITS.listNameMax) {
        throw new ApiError(422, `List names can be up to ${LIMITS.listNameMax} characters.`);
    }
    if (description.length > LIMITS.listDescriptionMax) {
        throw new ApiError(422, `Descriptions can be up to ${LIMITS.listDescriptionMax} characters.`);
    }

    return { name, description: description || null };
}

// Lists with counts and preview posters. Pass tmdbId + type to learn which lists already contain that title.
export async function getWatchlistSummaries(userId, tmdbId = null, type = null) {
    const { rows } = await pool.query(
        `SELECT
            w.watchlist_id,
            w.name,
            w.description,
            COUNT(wi.watchlist_item_id)::int AS item_count,
            COUNT(wi.watchlist_item_id) FILTER (WHERE wi.watched)::int AS watched_count,
            (ARRAY_AGG(m.poster_path ORDER BY wi.added_at DESC) FILTER (WHERE m.poster_path IS NOT NULL))[1:4] AS preview_posters,
            MAX(wi.watchlist_item_id::text) FILTER (WHERE m.tmdb_id = $2::int AND m.type = $3::text) AS media_item_id
        FROM watchlists w
        LEFT JOIN watchlistitems wi ON wi.watchlist_id = w.watchlist_id
        LEFT JOIN media m ON m.media_id = wi.media_id
        WHERE w.user_id = $1
        GROUP BY w.watchlist_id
        ORDER BY w.created_at`,
        [userId, tmdbId, type]
    );

    return rows.map((row) => ({
        ...toWatchlistJson(row),
        itemCount: row.item_count,
        watchedCount: row.watched_count,
        previewPosters: row.preview_posters || [],
        mediaItemId: row.media_item_id,
    }));
}

export function toWatchlistJson(row) {
    return {
        id: row.watchlist_id,
        name: row.name,
        description: row.description,
    };
}