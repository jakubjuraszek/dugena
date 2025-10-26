'use client';

import { Section } from '../Section';
import { useTranslations } from 'next-intl';

/**
 * FAQ SECTION - 10 Detailed Questions
 *
 * DESIGN DECISIONS:
 * - Simple list layout (not accordion for simplicity)
 * - Questions bold, answers normal weight
 * - Generous spacing between items
 * - Clear, direct language
 */
export function FAQSection() {
  const t = useTranslations('faq');

  interface FAQItem {
    question: string;
    answer: string;
  }

  const faqs = t.raw('items') as FAQItem[];

  return (
    <Section background="background" id="faq">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-4 text-white tracking-tight">
          {t('title')}
        </h2>

        <p className="text-lg text-center text-white leading-relaxed mb-16">
          {t('subtitle')}
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-medium rounded p-8 shadow-lg transition-colors hover:bg-cardHover hover:shadow-xl duration-200"
            >
              <h3 className="text-xl font-bold mb-4 text-white flex items-start gap-3">
                <span className="text-primary flex-shrink-0">Q:</span>
                <span>{faq.question}</span>
              </h3>
              <div className="text-white leading-relaxed pl-8">
                <span className="font-semibold text-white">A:</span> {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
