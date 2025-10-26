'use client';

import { Section } from '../Section';
import { Button } from '../Button';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../CurrencyContext';

/**
 * FINAL CTA SECTION - Last Push to Convert
 *
 * DESIGN DECISIONS:
 * - 3 buttons side-by-side (desktop), stacked (mobile)
 * - Professional (center) slightly larger (scale-110)
 * - Guarantee reminder below
 */
export function FinalCTASection() {
  const t = useTranslations('finalCTA');
  const tPricing = useTranslations('pricing');
  const { currency } = useCurrency();

  const prices = {
    quick: currency === 'USD' ? tPricing('tiers.quick.price.usd') : tPricing('tiers.quick.price.pln'),
    professional: currency === 'USD' ? tPricing('tiers.professional.price.usd') : tPricing('tiers.professional.price.pln'),
    premium: currency === 'USD' ? tPricing('tiers.premium.price.usd') : tPricing('tiers.premium.price.pln'),
  };

  return (
    <Section background="background" id="final-cta">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-3xl font-bold mb-8 text-white tracking-tight">
          {t('title')}
        </h2>

        <p className="text-xl text-white leading-relaxed mb-12">{t('subtitle')}</p>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-8">
          <Button variant="secondary" href="#pricing">
            Quick Audit - {prices.quick}
          </Button>
          <div className="transform lg:scale-110">
            <Button variant="primary" href="#pricing">
              <span className="inline-flex items-center gap-1">
                Professional Audit - {prices.professional} <Star className="w-4 h-4" fill="currentColor" />
              </span>
            </Button>
          </div>
          <Button variant="secondary" href="#pricing">
            Premium Audit - {prices.premium}
          </Button>
        </div>

        <p className="text-sm text-white">
          {t('guarantee')}
        </p>
      </div>
    </Section>
  );
}
