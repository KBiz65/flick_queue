import pool from '@/lib/db';
import { createHandler } from '@/lib/api';
import { validateWatchlistInput, toWatchlistJson } from '@/lib/watchlists';

// Optional ?tmdbId=550&type=movie tells the Add to Watchlist dialog which lists already contain that title
async function getWatchlists(req, res) {
    const tmdbId = /^\d+$/.test(req.query.tmdbId || '') ? Number(req.query.tmdbId) : null;
    const type = req.query.type === 'movie' || req.query.type === 'tv' ? req.query.type : null;

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
        [req.userId, tmdbId, type]
    );

    res.status(200).json({
        watchlists: rows.map((row) => ({
            ...toWatchlistJson(row),
            itemCount: row.item_count,
            watchedCount: row.watched_count,
            previewPosters: row.preview_posters || [],
            mediaItemId: row.media_item_id,
        })),
    });
}

async function createWatchlist(req, res) {
    const { name, description } = validateWatchlistInput(req.body);

    const { rows } = await pool.query(
        'INSERT INTO watchlists (user_id, name, description) VALUES ($1, $2, $3) RETURNING watchlist_id, name, description',
        [req.userId, name, description]
    );

    res.status(201).json({
        watchlist: { ...toWatchlistJson(rows[0]), itemCount: 0, watchedCount: 0, previewPosters: [], mediaItemId: null },
    });
}

export default createHandler({ GET: getWatchlists, POST: createWatchlist });