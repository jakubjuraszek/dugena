'use client';

import { Section } from '../Section';
import { Card } from '../Card';
import { useTranslations } from 'next-intl';

/**
 * WHY NOW SECTION - Explain the Opportunity
 *
 * DESIGN DECISIONS:
 * - 3-column grid desktop, 1 column mobile
 * - Cards with generous p-8 padding
 * - Numbered headers (1, 2, 3) = clear sequence
 * - Lists with bullets for data points
 *
 * CONTENT STRATEGY:
 * - Breakthrough 1: AI training (credibility)
 * - Breakthrough 2: Cost economics (value prop)
 * - Breakthrough 3: Market timing (urgency)
 */
export function WhyNowSection() {
  const t = useTranslations('whyNow');
  return (
    <Section background="elevated" id="why-now">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-6 text-white">
          {t('title')}
        </h2>
        <p className="text-xl text-center text-white leading-relaxed mb-16 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <h3 className="text-xl font-bold mb-4 text-primary">
              {t('breakthrough1.title')}
            </h3>
            <p className="text-white leading-relaxed mb-4">
              {t('breakthrough1.intro')}
            </p>
            <p className="font-semibold text-white mb-3">{t('breakthrough1.knowsTitle')}</p>
            <ul className="space-y-2 text-white leading-relaxed mb-4">
              {(t.raw('breakthrough1.points') as string[]).map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-white font-medium leading-relaxed">
              {t('breakthrough1.conclusion')}
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4 text-primary">
              {t('breakthrough2.title')}
            </h3>
            <p className="text-white leading-relaxed mb-3">
              {t('breakthrough2.before')}
            </p>
            <p className="text-white leading-relaxed mb-6">
              {t('breakthrough2.after')}
            </p>
            <p className="text-lg font-semibold text-white">
              {t('breakthrough2.value')}
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4 text-primary">
              {t('breakthrough3.title')}
            </h3>
            <p className="text-white leading-relaxed mb-3">
              {t('breakthrough3.point1')}
            </p>
            <p className="text-white leading-relaxed mb-3">
              {t('breakthrough3.point2')}
            </p>
            <p className="text-lg font-semibold text-white">
              {t('breakthrough3.conclusion')}
            </p>
          </Card>
        </div>

        <div className="bg-card rounded p-8 text-center border border-border">
          <p className="text-xl text-white leading-relaxed">
            {t('finalNote')}
          </p>
        </div>
      </div>
    </Section>
  );
}
