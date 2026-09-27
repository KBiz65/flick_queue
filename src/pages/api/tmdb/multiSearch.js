import { createHandler } from '@/lib/api';
import { tmdbGet, allowsAdultContent } from '@/lib/tmdb';

async function handler(req, res) {
    const searchItem = req.query.searchItem?.trim();

    if (!searchItem) {
        return res.status(400).json({ message: 'Please enter a search term.' });
    }

    const page = Number(req.query.page) || 1;
    const includeAdult = await allowsAdultContent(req.headers.cookie);

    const data = await tmdbGet('/search/multi', {
        query: searchItem,
        include_adult: includeAdult,
        page,
    });

    // Only movies and TV shows can go on a watchlist, so drop people results
    const results = data.results.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );

    res.status(200).json({ ...data, results });
}

export default createHandler({ GET: handler }, { auth: false });