import { NextResponse } from 'next/server';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';

const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/watchlists'];

export function proxy(request) {
    const { pathname, search } = request.nextUrl;
    const userId = verifyToken(request.cookies.get(AUTH_COOKIE)?.value);

    if (pathname === '/') {
        if (userId) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (isProtected && !userId) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('from', `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/watchlists/:path*'],
};