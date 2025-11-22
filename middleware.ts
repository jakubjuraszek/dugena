import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

/**
 * MIDDLEWARE - Automatic Locale & Currency Detection
 *
 * This middleware:
 * 1. Detects user's preferred language from Accept-Language header
 * 2. Detects user's currency from geo-location (Vercel headers)
 * 3. Redirects to appropriate locale if needed
 * 4. Sets currency cookie for zero-flash pricing display
 * 5. Handles locale-based routing for the entire app
 *
 * BEHAVIOR:
 * - First visit: Detects browser language → redirects to /pl or /en
 * - Subsequent visits: Respects user's locale choice (stored in cookie)
 * - URLs: / (Polish, default) or /en (English)
 * - Currency: Detected from x-vercel-ip-country header (PL → PLN, else → USD)
 */

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // 1. Detect currency from Vercel geo headers
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  const detectedCurrency = country === 'PL' ? 'PLN' : 'USD';

  // 2. Run intl middleware first (handles locale detection)
  const response = intlMiddleware(request);

  // 3. Set currency cookie if not exists (or update if changed)
  const existingCurrency = request.cookies.get('user-currency')?.value;

  if (existingCurrency !== detectedCurrency) {
    response.cookies.set('user-currency', detectedCurrency, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - /favicon.ico, /icon, /apple-icon (favicons)
  // - Static files (images, fonts, etc. - files with dots)
  matcher: ['/', '/(pl|en)/:path*', '/((?!api|_next|favicon\\.ico|icon|apple-icon|.*\\..*).*)']
};
