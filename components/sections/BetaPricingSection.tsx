'use client';

import { Section } from '../Section';
import { CheckCircle, Clock, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useCurrency } from '../CurrencyContext';

/**
 * BETA PRICING SECTION - Early Access Deal
 *
 * DESIGN DECISIONS:
 * - Ultra simple, direct value prop
 * - 50% off, 20 spots only
 * - Clear CTA button
 * - Sense of urgency without fake scarcity
 *
 * EMOTIONAL GOAL:
 * - FOMO but authentic
 * - Clear savings message
 * - Easy decision
 */
export function BetaPricingSection() {
  const t = useTranslations('betaPricing');
  const { currency } = useCurrency();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleCTAClick = () => {
    router.push(`/${locale}/audit`);
  };

  return (
    <Section background="elevated" id="beta-pricing">
      <div className="max-w-2xl mx-auto">
        {/* Heading with fire emoji */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('title')}
            </h2>
          </div>
          <p className="text-xl font-semibold text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Main Deal Box */}
        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#222222] border-2 border-primary rounded-xl p-8 mb-8 shadow-2xl shadow-orange-500/20">
          <div className="text-center mb-6">
            <p className="text-white text-lg mb-4">{t('dealIntro')}</p>

            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-4xl font-bold text-muted line-through">
                {currency === 'USD' ? '$49' : '199 zł'}
              </span>
              <span className="text-6xl font-bold text-primary">
                {currency === 'USD' ? '$25' : '99 zł'}
              </span>
            </div>

            <div className="inline-block bg-primary/20 border border-primary rounded px-4 py-2 mb-6">
              <p className="text-primary font-bold text-lg">
                {t('couponCode')}: <span className="text-2xl">BETA50</span>
              </p>
            </div>
          </div>

          {/* Benefits List */}
          <ul className="space-y-3 mb-8">
            {(t.raw('benefits') as string[]).map((benefit, index) => (
              <li key={index} className="flex items-start gap-3 text-white">
                <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            onClick={handleCTAClick}
            className="w-full bg-primary hover:bg-primary-light text-white font-bold text-lg py-4 px-8 rounded-lg transition-all hover:scale-[1.02] shadow-lg"
          >
            {t('cta')}
          </button>
        </div>

        {/* Spots Counter */}
        <div className="bg-card border-2 border-accent-warning/30 rounded p-6 text-center">
          <p className="text-lg flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <strong className="text-foreground">{t('spotsText', { taken: 3, total: 20 })}</strong>
          </p>
          <p className="text-sm text-white/70 mt-2">
            {t('spotsNote')}
          </p>
        </div>
      </div>
    </Section>
  );
}
