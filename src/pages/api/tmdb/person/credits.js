import { ApiError, createHandler } from '@/lib/api';
import { allowsAdultContent } from '@/lib/tmdb';
import { buildFilmography, getPersonWithCredits } from '@/lib/person';

// The full filmography, for people with too many credits to send with the page itself
async function getCredits(req, res) {
    const { id } = req.query;
    if (typeof id !== 'string' || !/^\d+$/.test(id)) {
        throw new ApiError(404, 'Person not found.');
    }

    let data;
    try {
        data = await getPersonWithCredits(id);
    } catch (error) {
        if (error.response?.status === 404) throw new ApiError(404, 'Person not found.');
        throw error;
    }

    const includeAdult = await allowsAdultContent(req.headers.cookie);
    if (data.adult && !includeAdult) {
        throw new ApiError(404, 'Person not found.');
    }

    const { credits } = buildFilmography(data.combined_credits, includeAdult);
    res.status(200).json({ credits });
}

export default createHandler({ GET: getCredits }, { auth: false });