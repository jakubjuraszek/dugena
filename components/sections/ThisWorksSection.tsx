'use client';

import { Section } from '../Section';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * THIS WORKS FOR YOU SECTION - Address Objections
 *
 * DESIGN DECISIONS:
 * - Vertical list (not grid) = easier mobile reading
 * - Green checkmark headers = positive framing
 * - Bold "Perfect/This is/Even better" = confidence
 *
 * CONTENT STRATEGY:
 * - Pre-empt 5 common objections
 * - Flip each into a benefit
 */
export function ThisWorksSection() {
  const t = useTranslations('thisWorks');

  interface Scenario {
    title: string;
    emphasis: string;
    content: string;
  }

  const scenarios = t.raw('scenarios') as Scenario[];

  return (
    <Section background="background" id="this-works">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-6 text-white tracking-tight">
          {t('title')}
        </h2>
        <p className="text-xl text-center text-white leading-relaxed mb-16">
          {t('subtitle')}
        </p>

        <div className="space-y-8">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-card border border-medium rounded p-8 shadow-lg transition-colors hover:bg-cardHover hover:shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-accent-success flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span>{scenario.title}</span>
              </h3>
              <p className="text-lg text-white leading-relaxed">
                <strong className="text-white">{scenario.emphasis}</strong> {scenario.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
