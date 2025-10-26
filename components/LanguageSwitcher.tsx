'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

/**
 * LANGUAGE SWITCHER COMPONENT
 *
 * Allows users to switch between Polish (PL) and English (EN).
 * - Highlights active language
 * - Preserves current path when switching
 * - Uses next-intl routing utilities for type-safe navigation
 */
export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const switchLanguage = (newLocale: 'pl' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLanguage('pl')}
        className={`
          px-3 py-1.5 rounded-md font-bold text-sm transition-all
          ${
            currentLocale === 'pl'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-transparent text-muted hover:text-white border border-border hover:border-primary/30'
          }
        `}
        aria-label="Switch to Polish"
      >
        PL
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`
          px-3 py-1.5 rounded-md font-bold text-sm transition-all
          ${
            currentLocale === 'en'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-transparent text-muted hover:text-white border border-border hover:border-primary/30'
          }
        `}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
