import { createHandler } from '@/lib/api';
import { tmdbGet } from '@/lib/tmdb';

// Countries TMDB has streaming data for, sorted by name. The list rarely changes, so keep it for a day.
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
let cachedRegions = null;
let cachedAt = 0;

async function getRegions(req, res) {
    if (!cachedRegions || Date.now() - cachedAt > ONE_DAY_MS) {
        const data = await tmdbGet('/watch/providers/regions');
        cachedRegions = data.results
            .map((region) => ({ code: region.iso_3166_1, name: region.english_name }))
            .sort((a, b) => a.name.localeCompare(b.name));
        cachedAt = Date.now();
    }

    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).json({ regions: cachedRegions });
}

export default createHandler({ GET: getRegions }, { auth: false });