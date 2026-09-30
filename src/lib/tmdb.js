import axios from 'axios';
import pool from './db';
import { readSessionCookie } from './auth';

const tmdb = axios.create({ baseURL: 'https://api.themoviedb.org/3', timeout: 8000 });

export async function tmdbGet(path, params = {}) {
    const response = await tmdb.get(path, {
        params: { api_key: process.env.TMDB_API_KEY, language: 'en-US', ...params },
    });
    return response.data;
}

// Short-lived in-memory cache for TMDB data that's the same for every visitor (trending lists,
// recommendations, person pages). Requests for the same data at the same moment share one TMDB call,
// and failed calls aren't cached. Callers get the shared object, so they must not modify it.
const MAX_CACHE_ENTRIES = 500;
const cache = new Map();

function cacheKey(path, params) {
    const sorted = Object.keys(params).sort().map((key) => [key, String(params[key])]);
    return `${path}?${new URLSearchParams(sorted)}`;
}

export function tmdbGetCached(path, params = {}, ttlMs) {
    const key = cacheKey(path, params);
    const hit = cache.get(key);
    if (hit && hit.expiresAt > Date.now()) return hit.promise;

    const promise = tmdbGet(path, params);
    cache.delete(key);
    cache.set(key, { promise, expiresAt: Date.now() + ttlMs });
    promise.catch(() => {
        if (cache.get(key)?.promise === promise) cache.delete(key);
    });

    // Maps keep insertion order, so the first key is the oldest entry
    if (cache.size > MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);

    return promise;
}

export const TRENDING_TTL_MS = 30 * 60 * 1000;

const DEFAULT_WATCH_REGION = 'US';

// The viewer's id and content settings. Logged-out visitors (or a token from before a password change)
// get safe defaults: no adult titles, US streaming availability. The token_version check matches lib/session.js.
export async function getViewerSettings(cookieHeader) {
    const defaults = { userId: null, firstName: null, includeAdult: false, watchRegion: DEFAULT_WATCH_REGION };
    const session = readSessionCookie(cookieHeader);
    if (!session) return defaults;

    const { rows } = await pool.query(
        'SELECT first_name, allow_adult_content, watch_region, token_version FROM users WHERE user_id = $1',
        [session.userId]
    );
    if (rows.length === 0 || rows[0].token_version !== session.version) return defaults;

    return {
        userId: session.userId,
        firstName: rows[0].first_name,
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