import pool from '@/lib/db';
import { createHandler, ApiError } from '@/lib/api';
import { getOwnedWatchlist, isUuid } from '@/lib/watchlists';

async function updateItem(req, res) {
    const watchlist = await getOwnedWatchlist(req.query.id, req.userId);
    const { itemId } = req.query;

    if (typeof req.body.watched !== 'boolean') {
        throw new ApiError(422, 'watched must be true or false.');
    }

    const { rows } = isUuid(itemId)
        ? await pool.query(
            'UPDATE watchlistitems SET watched = $1 WHERE watchlist_item_id = $2 AND watchlist_id = $3 RETURNING watchlist_item_id, watched',
            [req.body.watched, itemId, watchlist.watchlist_id]
        )
        : { rows: [] };

    if (rows.length === 0) {
        throw new ApiError(404, 'That title is not in this list.');
    }

    res.status(200).json({ item: { id: rows[0].watchlist_item_id, watched: rows[0].watched } });
}

async function removeItem(req, res) {
    const watchlist = await getOwnedWatchlist(req.query.id, req.userId);
    const { itemId } = req.query;

    const { rowCount } = isUuid(itemId)
        ? await pool.query('DELETE FROM watchlistitems WHERE watchlist_item_id = $1 AND watchlist_id = $2', [
            itemId,
            watchlist.watchlist_id,
        ])
        : { rowCount: 0 };

    if (rowCount === 0) {
        throw new ApiError(404, 'That title is not in this list.');
    }

    res.status(200).json({ message: 'Removed from list.' });
}

export default createHandler({ PATCH: updateItem, DELETE: removeItem });