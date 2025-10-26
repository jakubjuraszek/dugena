'use client';

import { Section } from '../Section';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * SOCIAL PROOF SECTION - Beta Honest Messaging
 *
 * DESIGN DECISIONS:
 * - Honest about beta status (core value: authenticity)
 * - Placeholder for testimonials (no fake ones)
 * - Trust signals in row format
 *
 * EMOTIONAL GOAL:
 * - Build trust through honesty (not fake testimonials)
 * - Invite early adopters to be part of journey
 */
export function SocialProofSection() {
  const t = useTranslations('socialProof');
  return (
    <Section background="elevated" id="social-proof">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-3xl font-bold mb-6 text-white tracking-tight">
          {t('title')}
        </h2>
        <p className="text-lg text-white leading-relaxed mb-12">
          {t('subtitle')}
        </p>

        <div className="bg-card border-2 border-dashed border-medium rounded p-12 shadow-lg mb-12">
          <p className="text-xl text-secondary mb-4">{t('placeholderTitle')}</p>
          <p className="text-lg text-white leading-relaxed">
            {t('placeholderText')}
          </p>
        </div>

        <div className="space-y-4 text-lg text-white leading-relaxed">
          {(t.raw('trustSignals') as string[]).map((signal, index) => (
            <p key={index} className="flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-accent-success" />
              <span>{signal}</span>
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
