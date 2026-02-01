import { NextResponse } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server-utils';

export async function authMiddleware(request) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    const userId = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                return session.tokens?.idToken?.payload?.sub || null;
            } catch (error) {
                return null;
            }
        },
    });

    const isAuthenticated = !!userId;

    const isAuthPage = pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/register') ||
        pathname.startsWith('/auth/verify');

    const isSellerPage = pathname.startsWith('/create-product') || pathname.startsWith('/my-products');
    const isProtectedPage = pathname.startsWith('/profile') || isSellerPage;

    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isAuthenticated && isProtectedPage) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based protection for /create-product
    if (isAuthenticated && isSellerPage) {
        const userRole = request.cookies.get('user-role')?.value;

        if (userRole?.toUpperCase() !== 'SELLER') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return response;
}
