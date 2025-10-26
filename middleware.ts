import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * MIDDLEWARE - Automatic Locale Detection
 *
 * This middleware:
 * 1. Detects user's preferred language from Accept-Language header
 * 2. Redirects to appropriate locale if needed
 * 3. Handles locale-based routing for the entire app
 *
 * BEHAVIOR:
 * - First visit: Detects browser language → redirects to /pl or /en
 * - Subsequent visits: Respects user's locale choice (stored in cookie)
 * - URLs: / (Polish, default) or /en (English)
 */
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - /favicon.ico, /icon, /apple-icon (favicons)
  // - Static files (images, fonts, etc. - files with dots)
  matcher: ['/', '/(pl|en)/:path*', '/((?!api|_next|favicon\\.ico|icon|apple-icon|.*\\..*).*)']
};
