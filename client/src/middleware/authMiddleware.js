import { NextResponse } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplify-server-utils';

export async function authMiddleware(request) {
    const response = NextResponse.next();

    const authenticated = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                return session.tokens !== undefined;
            } catch (error) {
                return false;
            }
        },
    });

    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/register') ||
        pathname.startsWith('/auth/verify');

    const isProtectedPage = pathname.startsWith('/profile');

    if (authenticated && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!authenticated && isProtectedPage) {
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}
