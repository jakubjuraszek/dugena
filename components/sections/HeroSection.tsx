'use client';

import { Button } from '../Button';
import { Section } from '../Section';
import { AnimatedCounter } from '../AnimatedCounter';
import { Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../CurrencyContext';

/**
 * HERO SECTION - Above the Fold
 *
 * DESIGN DECISIONS:
 * - H1: text-5xl (56px desktop), centered, max-w-4xl = visual anchor
 * - Subheadline: text-xl, max-w-2xl = readable width (65-75 chars)
 * - CTAs: side-by-side desktop, stacked mobile
 * - Social proof: small, subtle, below CTAs
 *
 * SPACING RATIONALE:
 * - mb-8 between headline/subheadline: Related elements (grouping)
 * - mb-12 after subheadline: Separates intro from action
 * - gap-4 between buttons: Enough space to prevent misclicks
 *
 * EMOTIONAL GOAL:
 * - Calm, direct, honest (not hype)
 * - Immediate clarity on value prop
 */
export function HeroSection() {
  const t = useTranslations('hero');
  const tPricing = useTranslations('pricing');
  const { currency } = useCurrency();

  const quickPrice = currency === 'USD' ? tPricing('tiers.quick.price.usd') : tPricing('tiers.quick.price.pln');

  return (
    <Section background="background" id="hero" className="relative overflow-hidden">
      {/* Radial orange glow from center - sophisticated depth */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Prefix text - small, subdued */}
        <p className="text-xl md:text-2xl text-gray-400 mb-6 font-medium tracking-tight">
          {t('titlePrefix')}
        </p>

        {/* Main headline - dramatic, word by word */}
        <h1 className="mb-12 space-y-2">
          <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-none tracking-tight">
            {t('titleLine1')}
          </div>
          <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-none tracking-tight">
            {t('titleLine2')}
          </div>
          <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-none tracking-tight">
            {t('titleLine3')}
          </div>
        </h1>

        {/* Subtitle - unchanged */}
        <p className="text-xl md:text-2xl font-medium text-white leading-relaxed max-w-2xl mx-auto mb-12 tracking-tight">
          {t('subtitle')}
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
          <Button variant="primary" href="#pricing">
            Get Your Audit - {quickPrice}
          </Button>
          <Button variant="secondary" href="#how-it-works">
            {t('ctaSecondary')}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm font-medium text-white tracking-tight">
          <Target className="w-5 h-5 text-primary" />
          <span>{t('socialProof', { count: 1247 })}</span>
        </div>
      </div>
    </Section>
  );
}
