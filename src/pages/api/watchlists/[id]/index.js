import pool from '@/lib/db';
import { createHandler } from '@/lib/api';
import { getOwnedWatchlist, validateWatchlistInput, toWatchlistJson } from '@/lib/watchlists';

async function getWatchlist(req, res) {
    const watchlist = await getOwnedWatchlist(req.query.id, req.userId);

    const { rows } = await pool.query(
        `SELECT wi.watchlist_item_id, wi.watched, wi.added_at, m.tmdb_id, m.type, m.title, m.poster_path, m.release_date, m.vote_average
        FROM watchlistitems wi
        JOIN media m ON m.media_id = wi.media_id
        WHERE wi.watchlist_id = $1
        ORDER BY wi.added_at DESC`,
        [watchlist.watchlist_id]
    );

    res.status(200).json({
        watchlist: toWatchlistJson(watchlist),
        items: rows.map((row) => ({
            id: row.watchlist_item_id,
            watched: row.watched,
            addedAt: row.added_at,
            tmdbId: row.tmdb_id,
            type: row.type,
            title: row.title,
            posterPath: row.poster_path,
            year: row.release_date ? row.release_date.getUTCFullYear() : null,
            voteAverage: row.vote_average === null ? null : Number(row.vote_average),
        })),
    });
}

async function updateWatchlist(req, res) {
    const watchlist = await getOwnedWatchlist(req.query.id, req.userId);
    const { name, description } = validateWatchlistInput(req.body);

    const { rows } = await pool.query(
        'UPDATE watchlists SET name = $1, description = $2 WHERE watchlist_id = $3 RETURNING watchlist_id, name, description',
        [name, description, watchlist.watchlist_id]
    );

    res.status(200).json({ watchlist: toWatchlistJson(rows[0]) });
}

async function deleteWatchlist(req, res) {
    const watchlist = await getOwnedWatchlist(req.query.id, req.userId);

    // Items are removed automatically by ON DELETE CASCADE
    await pool.query('DELETE FROM watchlists WHERE watchlist_id = $1', [watchlist.watchlist_id]);

    res.status(200).json({ message: 'Watchlist deleted.' });
}

export default createHandler({ GET: getWatchlist, PUT: updateWatchlist, DELETE: deleteWatchlist });