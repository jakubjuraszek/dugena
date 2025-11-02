'use client';

import { Section } from '../Section';
import { PricingCard } from '../PricingCard';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../CurrencyContext';

/**
 * PRICING SECTION - ⭐ MOST IMPORTANT
 *
 * DESIGN DECISIONS:
 * - Professional card: featured (scale-105, border-2, shadow-lg)
 * - 3-column grid desktop, stacked mobile
 * - Badge absolute positioning (top-right)
 * - Full feature lists (transparency = trust)
 * - Currency toggle for USD/PLN
 *
 * VISUAL HIERARCHY:
 * - Professional (center) is visually largest
 * - Badge draws eye immediately
 * - Price is text-4xl (highly visible)
 *
 * EMOTIONAL GOAL:
 * - Calm confidence (not aggressive)
 * - Transparent value (all features listed)
 * - Clear recommendation (MOST POPULAR badge)
 */
export function PricingSection() {
  const t = useTranslations('pricing');
  const { currency, setCurrency } = useCurrency();

  const prices = {
    quick: currency === 'USD' ? t('tiers.quick.price.usd') : t('tiers.quick.price.pln'),
    professional: currency === 'USD' ? t('tiers.professional.price.usd') : t('tiers.professional.price.pln'),
    premium: currency === 'USD' ? t('tiers.premium.price.usd') : t('tiers.premium.price.pln'),
  };

  return (
    <Section background="background" id="pricing" className="relative">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="text-xl font-medium text-white leading-relaxed mb-6 tracking-tight">
            {t('subtitle', { currency: currency === 'USD' ? t('tiers.quick.price.usd') : t('tiers.quick.price.pln') })}
          </p>

          {/* Currency Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-md font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-primary text-white shadow-sm hover:scale-[1.02]'
                  : 'bg-card text-white hover:bg-cardHover border border-border hover:border-primary/30'
              }`}
            >
              {t('currencyUSD')}
            </button>
            <button
              onClick={() => setCurrency('PLN')}
              className={`px-4 py-2 rounded-md font-bold transition-all ${
                currency === 'PLN'
                  ? 'bg-primary text-white shadow-sm hover:scale-[1.02]'
                  : 'bg-card text-white hover:bg-cardHover border border-border hover:border-primary/30'
              }`}
            >
              {t('currencyPLN')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {/* Quick Audit */}
          <PricingCard
            name={t('tiers.quick.name')}
            price={prices.quick}
            description={t('tiers.quick.description')}
            points={parseInt(t('tiers.quick.points'))}
            features={t.raw('tiers.quick.features') as string[]}
            cta={t('tiers.quick.cta', { price: prices.quick })}
          />

          {/* Professional Audit - FEATURED */}
          <PricingCard
            name={t('tiers.professional.name')}
            price={prices.professional}
            description={t('tiers.professional.description')}
            points={parseInt(t('tiers.professional.points'))}
            popular={true}
            badge={t('tiers.professional.badge')}
            features={t.raw('tiers.professional.features') as string[]}
            cta={t('tiers.professional.cta', { price: prices.professional })}
          />

          {/* Premium Audit - Coming Soon */}
          <PricingCard
            name={t('tiers.premium.name')}
            price={prices.premium}
            description={t('tiers.premium.description')}
            points={parseInt(t('tiers.premium.points'))}
            features={t.raw('tiers.premium.features') as string[]}
            cta={t('tiers.premium.cta', { price: prices.premium })}
            disabled={true}
            comingSoonText={t('tiers.premium.comingSoon')}
          />
        </div>

        <div className="text-center bg-card border border-border rounded p-6">
          <p className="text-white leading-relaxed">
            {t('allPackages')}
          </p>
        </div>
      </div>
    </Section>
  );
}
