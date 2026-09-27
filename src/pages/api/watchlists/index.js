import pool from '@/lib/db';
import { createHandler } from '@/lib/api';
import { getWatchlistSummaries, validateWatchlistInput, toWatchlistJson } from '@/lib/watchlists';

// Optional ?tmdbId=550&type=movie tells the Add to Watchlist dialog which lists already contain that title
async function getWatchlists(req, res) {
    const tmdbId = /^\d+$/.test(req.query.tmdbId || '') ? Number(req.query.tmdbId) : null;
    const type = req.query.type === 'movie' || req.query.type === 'tv' ? req.query.type : null;

    const watchlists = await getWatchlistSummaries(req.userId, tmdbId, type);

    res.status(200).json({ watchlists });
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