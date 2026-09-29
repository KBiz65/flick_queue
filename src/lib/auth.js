import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

export const AUTH_COOKIE = 'FlickQueueAuth';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const JWT_ALGORITHM = 'HS256';
export const MIN_JWT_SECRET_LENGTH = 32;

// Checked when a username doesn't exist, so a failed login takes the same time whether or not the user is real
export const DUMMY_PASSWORD_HASH = '$2b$10$m4./rTxawdqOu1HTXdIW0.Fgg9yP8n9h1PKkc1FKWtDqS7rMbC35q';

// Also checked once at server startup (src/instrumentation.js), so a bad secret shows up in the logs right away
export function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    if (secret.length < MIN_JWT_SECRET_LENGTH) {
        throw new Error(`JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters`);
    }
    return secret;
}

export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

// ver is the user's token_version when the token was issued. A password change bumps it, which ends older sessions.
export function signToken(userId, tokenVersion) {
    return jwt.sign({ ver: tokenVersion }, getSecret(), { subject: userId, expiresIn: TOKEN_TTL_SECONDS, algorithm: JWT_ALGORITHM });
}

// Signature and expiry only. Tokens from before token_version existed have no ver and count as version 0.
function readToken(token) {
    if (!token) return null;
    try {
        const payload = jwt.verify(token, getSecret(), { algorithms: [JWT_ALGORITHM] });
        return { userId: payload.sub, version: Number.isInteger(payload.ver) ? payload.ver : 0 };
    } catch {
        return null;
    }
}

export function readSessionCookie(cookieHeader) {
    const cookies = parse(cookieHeader || '');
    return readToken(cookies[AUTH_COOKIE]);
}

// Used only by proxy.js to decide redirects. Doesn't check token_version, so anything that trusts
// the login must use getSessionUserId (lib/session.js) instead.
export function verifyToken(token) {
    return readToken(token)?.userId ?? null;
}

function buildCookie(value, maxAge) {
    return serialize(AUTH_COOKIE, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge,
    });
}

export function setAuthCookie(res, userId, tokenVersion) {
    res.setHeader('Set-Cookie', buildCookie(signToken(userId, tokenVersion), TOKEN_TTL_SECONDS));
}

export function clearAuthCookie(res) {
    res.setHeader('Set-Cookie', buildCookie('', 0));
}