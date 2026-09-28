import axios from 'axios';
import pool from './db';
import { getUserIdFromCookieHeader } from './auth';

const tmdb = axios.create({ baseURL: 'https://api.themoviedb.org/3' });

export async function tmdbGet(path, params = {}) {
    const response = await tmdb.get(path, {
        params: { api_key: process.env.TMDB_API_KEY, language: 'en-US', ...params },
    });
    return response.data;
}

const DEFAULT_WATCH_REGION = 'US';

// The viewer's content settings. Logged-out visitors get safe defaults: no adult titles, US streaming availability.
export async function getViewerSettings(cookieHeader) {
    const defaults = { includeAdult: false, watchRegion: DEFAULT_WATCH_REGION };
    const userId = getUserIdFromCookieHeader(cookieHeader);
    if (!userId) return defaults;

    const { rows } = await pool.query('SELECT allow_adult_content, watch_region FROM users WHERE user_id = $1', [userId]);
    if (rows.length === 0) return defaults;

    return {
        includeAdult: rows[0].allow_adult_content === true,
        watchRegion: rows[0].watch_region || DEFAULT_WATCH_REGION,
    };
}

export async function allowsAdultContent(cookieHeader) {
    const { includeAdult } = await getViewerSettings(cookieHeader);
    return includeAdult;
}

// Trim a TMDB list item down to what a poster row needs (keeps page props small)
export function toMediaCard(item, fallbackType) {
    return {
        id: item.id,
        media_type: item.media_type || fallbackType,
        title: item.title || null,
        name: item.name || null,
        poster_path: item.poster_path || null,
        year: (item.release_date || item.first_air_date || '').slice(0, 4) || null,
    };
}