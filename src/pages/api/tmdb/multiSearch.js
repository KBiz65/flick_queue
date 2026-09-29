import { createHandler } from '@/lib/api';
import { tmdbGet, allowsAdultContent } from '@/lib/tmdb';

// TMDB returns at most 500 pages of search results
const MAX_PAGE = 500;

function parsePage(value) {
    if (value === undefined) return 1;
    if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
    return Math.min(Math.max(Number(value), 1), MAX_PAGE);
}

async function handler(req, res) {
    const searchItem = typeof req.query.searchItem === 'string' ? req.query.searchItem.trim() : '';

    if (!searchItem) {
        return res.status(400).json({ message: 'Please enter a search term.' });
    }

    const page = parsePage(req.query.page);
    if (page === null) {
        return res.status(400).json({ message: 'Page must be a whole number.' });
    }

    const includeAdult = await allowsAdultContent(req.headers.cookie);

    const data = await tmdbGet('/search/multi', {
        query: searchItem,
        include_adult: includeAdult,
        page,
    });

    // Only movies and TV shows can go on a watchlist, so drop people results.
    // Adult titles are filtered here too, since TMDB's include_adult flag isn't always reliable.
    const results = data.results.filter(
        (item) => (item.media_type === 'movie' || item.media_type === 'tv') && (includeAdult || !item.adult)
    );

    res.status(200).json({ ...data, results });
}

export default createHandler({ GET: handler }, { auth: false });