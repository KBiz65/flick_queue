import pool from '@/lib/db';
import { createHandler, ApiError } from '@/lib/api';
import { getOwnedWatchlist } from '@/lib/watchlists';
import { tmdbGet, allowsAdultContent } from '@/lib/tmdb';

// Look the title up on TMDB (never trust title data sent from the browser) and save it to the media table once
async function saveMedia(tmdbId, type, cookieHeader) {
    let data;
    try {
        data = await tmdbGet(`/${type}/${tmdbId}`);
    } catch (error) {
        if (error.response?.status === 404) throw new ApiError(404, 'Title not found.');
        throw error;
    }

    if (data.adult && !(await allowsAdultContent(cookieHeader))) {
        throw new ApiError(404, 'Title not found.');
    }

    const isMovie = type === 'movie';
    const { rows } = await pool.query(
        `INSERT INTO media (tmdb_id, type, title, original_title, overview, release_date, poster_path,
            backdrop_path, popularity, vote_average, vote_count, original_language)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (tmdb_id, type) DO UPDATE SET
            title = EXCLUDED.title,
            original_title = EXCLUDED.original_title,
            overview = EXCLUDED.overview,
            release_date = EXCLUDED.release_date,
            poster_path = EXCLUDED.poster_path,
            backdrop_path = EXCLUDED.backdrop_path,
            popularity = EXCLUDED.popularity,
            vote_average = EXCLUDED.vote_average,
            vote_count = EXCLUDED.vote_count,
            original_language = EXCLUDED.original_language
        RETURNING media_id`,
        [
            data.id,
            type,
            isMovie ? data.title : data.name,
            isMovie ? data.original_title : data.original_name,
            data.overview || null,
            (isMovie ? data.release_date : data.first_air_date) || null,
            data.poster_path || null,
            data.backdrop_path || null,
            data.popularity ?? null,
            data.vote_average ?? null,
            data.vote_count ?? null,
            data.original_language || null,
        ]
    );

    return rows[0].media_id;
}

async function addItem(req, res) {
    const watchlist = await getOwnedWatchlist(req.query.id, req.userId);
    const { tmdbId, type } = req.body;

    if (!Number.isInteger(tmdbId) || tmdbId <= 0 || (type !== 'movie' && type !== 'tv')) {
        throw new ApiError(422, 'A valid tmdbId and type (movie or tv) are required.');
    }

    const mediaId = await saveMedia(tmdbId, type, req.headers.cookie);

    const { rows } = await pool.query(
        'INSERT INTO watchlistitems (watchlist_id, media_id) VALUES ($1, $2) RETURNING watchlist_item_id, watched',
        [watchlist.watchlist_id, mediaId]
    );

    res.status(201).json({ item: { id: rows[0].watchlist_item_id, watched: rows[0].watched } });
}

export default createHandler({ POST: addItem });