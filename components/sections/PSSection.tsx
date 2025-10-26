'use client';

import { Section } from '../Section';
import { useTranslations } from 'next-intl';

/**
 * P.S. SECTION - Personal Note
 *
 * DESIGN DECISIONS:
 * - bg-slate-50 box = intimate, personal feel
 * - Italic for introspection
 * - Signature right-aligned
 * - Max-width 2xl for readability
 *
 * EMOTIONAL GOAL:
 * - Human connection
 * - Founder-to-founder empathy
 * - Final trust builder
 */
export function PSSection() {
  const t = useTranslations('ps');
  return (
    <Section background="elevated" id="ps">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded p-12 shadow-sm border border-border">
          <div className="space-y-6 text-lg text-white leading-relaxed">
            <p>
              <strong className="text-foreground">P.S.</strong> – {t('intro')}
            </p>

            <p className="italic" style={{ whiteSpace: 'pre-line' }}>
              {t('qualities')}
            </p>

            <p>
              {t('value')}
            </p>

            <p className="text-xl font-semibold text-foreground">
              {t('decision')}
            </p>

            <hr className="border-border my-8" />

            <p>
              <strong className="text-foreground">P.P.S.</strong> – {t('ppsIntro')}
            </p>

            <p className="italic">
              {t('backstory')}
            </p>

            <p>
              {t('motivation')}
            </p>

            <p>
              {t('solution')}
            </p>

            <p className="font-medium text-foreground">
              {t('closing')}
            </p>

            <p className="text-right text-xl font-semibold text-foreground mt-8">
              {t('signature')}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
