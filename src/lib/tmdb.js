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

// Logged-out visitors never see adult results; logged-in users follow their profile setting
export async function allowsAdultContent(cookieHeader) {
    const userId = getUserIdFromCookieHeader(cookieHeader);
    if (!userId) return false;

    const { rows } = await pool.query('SELECT allow_adult_content FROM users WHERE user_id = $1', [userId]);
    return rows[0]?.allow_adult_content === true;
}