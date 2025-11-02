'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { Globe } from 'lucide-react';

/**
 * LANGUAGE SWITCHER COMPONENT
 *
 * Allows users to switch between Polish (PL) and English (EN).
 * - Select-based interface for better UX
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
    <div className="relative">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-muted" />
        <select
          value={currentLocale}
          onChange={(e) => switchLanguage(e.target.value as 'pl' | 'en')}
          className="
            bg-card border border-border rounded-md
            px-3 py-1.5 pr-8
            text-sm font-bold text-foreground
            cursor-pointer
            hover:border-primary/50
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all
            appearance-none
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
          aria-label="Select language"
        >
          <option value="pl">PL</option>
          <option value="en">EN</option>
        </select>
      </div>
    </div>
  );
}
