import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * i18n ROUTING CONFIGURATION
 *
 * Defines supported locales and default locale for the application.
 * - pl (Polish): Default locale, no prefix in URL (/)
 * - en (English): Prefixed in URL (/en)
 */
export const routing = defineRouting({
  // Supported locales
  locales: ['pl', 'en'],

  // Default locale (used when no locale is specified)
  defaultLocale: 'pl',

  // Locale prefix strategy: 'as-needed' means default locale has no prefix
  localePrefix: 'as-needed'
});

// Type-safe navigation helpers
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
