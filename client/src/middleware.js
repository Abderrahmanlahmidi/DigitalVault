import { authMiddleware } from './middleware/authMiddleware';

export async function middleware(request) {
    return await authMiddleware(request);
}

export const config = {
    matcher: [
        '/auth/login',
        '/auth/register',
        '/auth/verify',
        '/profile/:path*'
    ],
};
