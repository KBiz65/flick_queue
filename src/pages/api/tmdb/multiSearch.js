import axios from 'axios';
import pool from '@/lib/db';
import { createHandler } from '@/lib/api';
import { getUserIdFromRequest } from '@/lib/auth';

// Logged-out visitors never see adult results; logged-in users follow their profile setting
async function allowsAdultContent(req) {
    const userId = getUserIdFromRequest(req);
    if (!userId) return false;

    const { rows } = await pool.query('SELECT allow_adult_content FROM users WHERE user_id = $1', [userId]);
    return rows[0]?.allow_adult_content === true;
}

async function handler(req, res) {
    const apiKey = process.env.TMDB_API_KEY;
    const searchItem = req.query.searchItem?.trim();

    if (!searchItem) {
        return res.status(400).json({ message: 'Please enter a search term.' });
    }

    const page = Number(req.query.page) || 1;
    const includeAdult = await allowsAdultContent(req);

    const response = await axios.get('https://api.themoviedb.org/3/search/multi', {
        params: {
            api_key: apiKey,
            query: searchItem,
            include_adult: includeAdult,
            language: 'en-US',
            page,
        },
    });

    // Only movies and TV shows can go on a watchlist, so drop people results
    const results = response.data.results.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );

    res.status(200).json({ ...response.data, results });
}

export default createHandler({ GET: handler }, { auth: false });