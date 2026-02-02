import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Create response with custom headers
    const response = NextResponse.next();

    // Remove X-Frame-Options completely (let CSP handle it)
    response.headers.delete('X-Frame-Options');

    // Set CSP frame-ancestors to allow embedding in Optimizely CMS
    const cspValue = `frame-ancestors 'self' https://*.optimizely.com https://*.episerver.net`;
    response.headers.set('Content-Security-Policy', cspValue);

    return response;
}

// Configure middleware to run on all routes
export const config = {
    matcher: [
        /*
         * Match all request paths except for static files
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
