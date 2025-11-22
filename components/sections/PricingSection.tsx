'use client';

import { Section } from '../Section';
import { PricingCard } from '../PricingCard';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../CurrencyContext';
import { useParams } from 'next/navigation';
import { openPaddleCheckout } from '@/lib/paddle';

/**
 * PRICING SECTION - ⭐ MOST IMPORTANT
 *
 * DESIGN DECISIONS:
 * - Professional card: featured (scale-105, border-2, shadow-lg)
 * - 3-column grid desktop, stacked mobile
 * - Badge absolute positioning (top-right)
 * - Full feature lists (transparency = trust)
 * - Single currency display based on geo-detection
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
  const { currency } = useCurrency();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  // Show single currency based on geo-detection
  const prices = {
    quick: currency === 'USD' ? t('tiers.quick.price.usd') : t('tiers.quick.price.pln'),
    professional: currency === 'USD' ? t('tiers.professional.price.usd') : t('tiers.professional.price.pln'),
    premium: currency === 'USD' ? t('tiers.premium.price.usd') : t('tiers.premium.price.pln'),
  };

  // Direct checkout handler - no modal needed with inline input
  const handleCheckout = async (tier: 'quick' | 'professional', url: string) => {
    // URL validation is now handled in PricingCard component
    try {
      await openPaddleCheckout(tier, url, locale, currency);
    } catch (error) {
      console.error('Checkout failed:', error);
      // TODO: Show inline error instead of alert
      alert('Failed to open checkout. Please try again.');
    }
  };

  return (
    <Section background="background" id="pricing" className="relative">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="text-xl font-medium text-white leading-relaxed mb-12 tracking-tight">
            {t('subtitle', { currency: prices.quick })}
          </p>
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
            tier="quick"
            onClick={(url) => handleCheckout('quick', url)}
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
            tier="professional"
            onClick={(url) => handleCheckout('professional', url)}
          />

          {/* Premium Audit - Coming Soon */}
          <PricingCard
            name={t('tiers.premium.name')}
            price={prices.premium}
            description={t('tiers.premium.description')}
            points={parseInt(t('tiers.premium.points'))}
            features={t.raw('tiers.premium.features') as string[]}
            cta={t('tiers.premium.cta', { price: prices.premium })}
            tier="premium"
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
