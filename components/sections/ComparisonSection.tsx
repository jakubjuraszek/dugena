'use client';

import { Section } from '../Section';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../CurrencyContext';

/**
 * COMPARISON SECTION - Card-Based Layout
 *
 * DESIGN DECISIONS:
 * - Card-based layout (not table) for sophisticated dark theme
 * - 3-tier visual hierarchy:
 *   - Dimmed (opacity-60): Free tools, Freelancer, Agency
 *   - Visible (border-2): Quick & Premium + "OUR PRODUCT" labels
 *   - Glowing: Professional with orange glow + "BEST VALUE" badge
 * - Subtle gradients on each card for depth
 * - Mobile responsive: stack on mobile, 4 columns on desktop
 */
export function ComparisonSection() {
  const t = useTranslations('comparison');
  const tPricing = useTranslations('pricing');
  const { currency } = useCurrency();

  interface ComparisonItem {
    name: string;
    subtitle: string;
    badge?: string;
    time: string;
    price: string;
    description: string;
  }

  const items = t.raw('items') as ComparisonItem[];

  // Get dynamic prices based on currency
  const prices = {
    quick: currency === 'USD' ? tPricing('tiers.quick.price.usd') : tPricing('tiers.quick.price.pln'),
    professional: currency === 'USD' ? tPricing('tiers.professional.price.usd') : tPricing('tiers.professional.price.pln'),
    premium: currency === 'USD' ? tPricing('tiers.premium.price.usd') : tPricing('tiers.premium.price.pln'),
  };

  return (
    <Section background="elevated" id="comparison">

      <div className="relative max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center tracking-tight text-foreground">
          {t('title')}
        </h2>

        <div className="space-y-2">

          {/* FREE TOOLS - Dimmed */}
          <div className="
            bg-gradient-to-r from-[#1c1c1c] to-[#202020]
            border border-[#1a1a1a]
            opacity-60
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
          ">
            <div>
              <div className="font-medium text-[#71717a]">{items[0].name}</div>
              <div className="text-xs text-[#71717a] mt-1">{items[0].subtitle}</div>
            </div>
            <div className="text-[#71717a]">{items[0].time}</div>
            <div className="text-[#71717a]">{items[0].price}</div>
            <div className="text-sm text-[#71717a]">{items[0].description}</div>
          </div>

          {/* QUICK AUDIT - Our product, visible */}
          <div className="
            bg-gradient-to-r from-[#222222] to-[#1a1a1a]
            border-2 border-border-medium
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
            hover:border-primary/30
            transition-all
          ">
            <div>
              <div className="font-bold text-white">{items[1].name}</div>
              <div className="text-xs text-primary mt-1">{items[1].subtitle}</div>
            </div>
            <div className="font-medium text-white">{items[1].time}</div>
            <div className="text-primary font-bold">{prices.quick}</div>
            <div className="text-sm text-white">{items[1].description}</div>
          </div>

          {/* PROFESSIONAL AUDIT - Our main product, GLOWS */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-500/10 rounded blur-lg" />

            <div className="
              relative
              bg-gradient-to-r from-[#2a2a2a] to-[#222222]
              border-2 border-primary
              rounded p-6
              grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
              shadow-2xl shadow-orange-500/20
            ">
              <div>
                <div className="font-bold text-white flex flex-wrap items-center gap-2">
                  {items[2].name}
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded font-bold">
                    {items[2].badge}
                  </span>
                </div>
                <div className="text-xs text-orange-400 mt-1">{items[2].subtitle}</div>
              </div>
              <div className="font-medium text-white">{items[2].time}</div>
              <div className="text-primary font-bold text-xl">{prices.professional}</div>
              <div className="text-sm text-white">{items[2].description}</div>
            </div>
          </div>

          {/* PREMIUM AUDIT - Our product, visible */}
          <div className="
            bg-gradient-to-r from-[#222222] to-[#1a1a1a]
            border-2 border-border-medium
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
            hover:border-primary/30
            transition-all
          ">
            <div>
              <div className="font-bold text-white">{items[3].name}</div>
              <div className="text-xs text-primary mt-1">{items[3].subtitle}</div>
            </div>
            <div className="font-medium text-white">{items[3].time}</div>
            <div className="text-primary font-bold">{prices.premium}</div>
            <div className="text-sm text-white">{items[3].description}</div>
          </div>

          {/* FREELANCER - Dimmed, competitor */}
          <div className="
            bg-gradient-to-r from-[#1c1c1c] to-[#202020]
            border border-[#1a1a1a]
            opacity-60
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
          ">
            <div>
              <div className="font-medium text-[#71717a]">{items[4].name}</div>
              <div className="text-xs text-[#71717a] mt-1">{items[4].subtitle}</div>
            </div>
            <div className="text-[#71717a]">{items[4].time}</div>
            <div className="text-[#71717a]">{items[4].price}</div>
            <div className="text-sm text-[#71717a]">{items[4].description}</div>
          </div>

          {/* AGENCY - Dimmed, competitor */}
          <div className="
            bg-gradient-to-r from-[#1c1c1c] to-[#202020]
            border border-[#1a1a1a]
            opacity-60
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
          ">
            <div>
              <div className="font-medium text-[#71717a]">{items[5].name}</div>
              {items[5].subtitle && <div className="text-xs text-[#71717a] mt-1">{items[5].subtitle}</div>}
            </div>
            <div className="text-[#71717a]">{items[5].time}</div>
            <div className="text-[#71717a]">{items[5].price}</div>
            <div className="text-sm text-[#71717a]">{items[5].description}</div>
          </div>

        </div>
      </div>
    </Section>
  );
}
