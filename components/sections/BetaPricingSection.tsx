'use client';

import { Section } from '../Section';
import { CheckCircle, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * BETA PRICING SECTION - Authentic Communication
 *
 * DESIGN DECISIONS:
 * - Honest, personal tone
 * - Beta deal highlighted in blue box
 * - Real counter (needs manual update or API)
 * - No fake urgency
 *
 * EMOTIONAL GOAL:
 * - Bootstrapper-to-bootstrapper trust
 * - Transparency = credibility
 * - Invite to be part of journey
 */
export function BetaPricingSection() {
  const t = useTranslations('betaPricing');
  return (
    <Section background="elevated" id="beta-pricing">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-8 text-foreground">
          {t('title')}
        </h2>

        <div className="space-y-6 text-lg text-white leading-relaxed mb-12">
          {(t.raw('intro') as string[]).map((paragraph, index) => (
            <p key={index} className={index === 2 ? "text-xl font-semibold text-foreground" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="bg-card border-2 border-primary/30 rounded p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            {t('benefitsTitle')}
          </h3>
          <ul className="space-y-3 text-lg text-white leading-relaxed">
            {(t.raw('benefits') as string[]).map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 text-lg text-white leading-relaxed mb-12">
          <p className="font-semibold text-foreground">{t('askTitle')}</p>
          <ul className="space-y-2 pl-6">
            {(t.raw('asks') as string[]).map((ask, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mr-2">•</span>
                <span>{ask}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xl text-center text-white leading-relaxed mb-8">
          {t('closing')}
        </p>

        <div className="bg-card border-2 border-accent-warning/30 rounded p-6 text-center">
          <p className="text-lg flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <strong className="text-foreground">{t('spotsText', { taken: 67, total: 100 })}</strong>
            <span className="text-white">{t('spotsNote')}</span>
          </p>
          <p className="text-sm text-white/70 mt-2">
            {/* TODO: Replace with real Stripe customer count via API */}
          </p>
        </div>
      </div>
    </Section>
  );
}
