'use client';

import { Section } from '../Section';
import { useTranslations } from 'next-intl';

/**
 * PROBLEM SECTION - Identify with Pain
 *
 * DESIGN DECISIONS:
 * - Blockquote: italic, border-left-4, larger text = testimonial style
 * - Pain points: List with ❌ icons (visual negative)
 * - "Fast." standalone: Bold, larger = emphasis punch
 *
 * EMOTIONAL GOAL:
 * - Empathy first (you're not alone)
 * - Articulate exact frustration
 * - Build urgency through relatability (not fake scarcity)
 */
export function ProblemSection() {
  const t = useTranslations('problem');

  return (
    <Section background="elevated" id="problem">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-3xl font-bold mb-12 text-white tracking-tight">
          {t('title')}
        </h2>

        <p className="text-lg text-white leading-relaxed mb-8">
          {t('intro')}
        </p>

        <blockquote className="text-2xl md:text-xl italic text-white border-l-4 border-primary pl-6 py-4 mb-12 text-left leading-relaxed">
          &quot;{t('quote')}&quot;
        </blockquote>

        <p className="text-2xl md:text-xl font-semibold text-white mb-3">
          {t('problem1')}
        </p>
        <p className="text-2xl md:text-xl font-semibold text-white mb-16">
          {t('problem2')}
        </p>

        <div className="bg-card border border-medium rounded p-8 shadow-lg mb-12 transition-colors hover:bg-cardHover hover:shadow-xl">
          <h3 className="text-2xl md:text-xl font-semibold mb-6 text-white">
            {t('noTimeTitle')}
          </h3>
          <ul className="text-left space-y-4 text-lg text-white leading-relaxed">
            {(t.raw('noTimeItems') as string[]).map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-red-500 mr-3 text-xl">❌</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-lg text-white leading-relaxed mb-6">
          {t('needSolution')}
        </p>

        <p className="text-4xl md:text-3xl font-bold text-white">
          {t('fast')}
        </p>
      </div>
    </Section>
  );
}
