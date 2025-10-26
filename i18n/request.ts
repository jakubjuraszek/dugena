import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * i18n REQUEST CONFIGURATION
 *
 * Server-side configuration for loading translation messages.
 * This is called on each request to determine which locale to use.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'pl' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
