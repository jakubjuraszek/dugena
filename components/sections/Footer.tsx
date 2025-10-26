'use client';

import { useTranslations } from 'next-intl';

/**
 * FOOTER - Simple, Minimal (i18n enabled)
 *
 * DESIGN DECISIONS:
 * - Dark background (slate-800)
 * - White/gray text
 * - Horizontal links row
 * - Simple copyright
 */
export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-background border-t border/50 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm">
            <a href="#faq" className="text-muted hover:text-white transition-colors">
              {t('faq')}
            </a>
            <a href="/privacy" className="text-muted hover:text-white transition-colors">
              {t('privacy')}
            </a>
            <a href="/terms" className="text-muted hover:text-white transition-colors">
              {t('terms')}
            </a>
            <a href="mailto:hi@landingpageauditor.com" className="text-muted hover:text-white transition-colors">
              {t('contact')}
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted text-sm mb-2">
              {t('copyright')}
            </p>
            <p className="text-[#71717a] text-sm">
              {t('location')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
