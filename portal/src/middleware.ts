import { NextRequest, NextResponse } from 'next/server';
import { getUser, getUserRole } from '@/lib/actions';
import { ROLE } from './lib/defines';

export async function middleware(request: NextRequest) {
    const isLogin = await getUser();
    if (!isLogin) {
        return NextResponse.redirect(
            new URL(
                '/login?callbackUrl=' + request.nextUrl.pathname,
                request.url
            )
        );
    }
    const role = await getUserRole();
    if (request.url.includes('/my-cars') && role != ROLE.CAROWNER) {
        return NextResponse.redirect(
            new URL('/login?callbackUrl=' + request.nextUrl.href, request.url)
        );
    }
    if (request.url.includes('/reservation?') && role != ROLE.CUSTOMER) {
        return NextResponse.redirect(
            new URL('/login?callbackUrl=' + request.nextUrl.href, request.url)
        );
    }
}

export const config = {
    matcher: ['/profile', '/booking', '/reservation', '/my-cars'],
};
