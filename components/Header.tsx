'use client';

import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * HEADER COMPONENT - Professional Trust Signal (i18n enabled)
 *
 * DESIGN DECISIONS:
 * - Fixed position: Always visible, professional presence
 * - Backdrop blur: Modern, premium feel (iOS/macOS aesthetic)
 * - Logo: Gradient box + FileText icon (placeholder, recognizable)
 * - CTA: "Get Started" → smooth scroll to pricing
 * - Language Switcher: PL/EN toggle in header
 *
 * RATIONALE:
 * - Fixed header = trust signal (page looks "done" not "in progress")
 * - Gradient logo = professional (not just text)
 * - Backdrop blur = depth, polish
 * - Get Started CTA = always accessible conversion point
 * - Language switcher = accessibility for international users
 *
 * TRUST IMPROVEMENT:
 * - Before: No header = looks unfinished, amateur
 * - After: Fixed header = professional, intentional, trustworthy
 */
export function Header() {
  const t = useTranslations('header');

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-zinc-900 border-l-2 border-primary flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              {t('logoText')}
            </span>
          </div>

          {/* Right side: Language Switcher + CTA */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={scrollToPricing}
              className="
                bg-primary hover:bg-primary-light
                text-white font-bold text-sm
                px-6 py-2.5 rounded-md
                shadow-sm hover:shadow-md shadow-primary/20
                transition-all duration-200
                hover:scale-[1.02]
              "
            >
              {t('ctaButton')}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header (prevents content from hiding under header) */}
      <div className="h-16" />
    </>
  );
}
