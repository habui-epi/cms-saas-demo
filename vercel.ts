import { routes, type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
    framework: 'nextjs',
    headers: [
        routes.header('/(.*)', [
            {
                key: 'Content-Security-Policy',
                value:
                    "frame-ancestors https://app-opcp01tomekm42p001.cms.optimizely.com https://*.optimizely.com https://*.optimizely.com https://localhost:5000;",
            },
            // Explicitly remove X-Frame-Options
            // Browsers prioritize CSP, but some still respect XFO if present
            {
                key: 'X-Frame-Options',
                value: '',
            },
        ])
    ],
};