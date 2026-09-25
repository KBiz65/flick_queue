import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

export const AUTH_COOKIE = 'FlickQueueAuth';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    return secret;
}

export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

export function signToken(userId) {
    return jwt.sign({}, getSecret(), { subject: userId, expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, getSecret()).sub;
    } catch {
        return null;
    }
}

export function getUserIdFromCookieHeader(cookieHeader) {
    const cookies = parse(cookieHeader || '');
    return verifyToken(cookies[AUTH_COOKIE]);
}

export function getUserIdFromRequest(req) {
    return getUserIdFromCookieHeader(req.headers.cookie);
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

export function setAuthCookie(res, userId) {
    res.setHeader('Set-Cookie', buildCookie(signToken(userId), TOKEN_TTL_SECONDS));
}

export function clearAuthCookie(res) {
    res.setHeader('Set-Cookie', buildCookie('', 0));
}