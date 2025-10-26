'use client';

import { Section } from '../Section';
import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * YOUR TRANSFORMATION SECTION - Timeline Journey
 *
 * DESIGN DECISIONS:
 * - Vertical timeline with left line and dots
 * - Time badges with blue background
 * - Cards for each step (ml-8 for offset)
 * - ROI note in green accent box
 *
 * EMOTIONAL GOAL:
 * - Visualize the journey (concrete steps)
 * - Show realistic timeline (builds trust)
 * - End with ROI punch (value reinforcement)
 */
export function TransformationSection() {
  const t = useTranslations('transformation');

  interface Step {
    time: string;
    title: string;
    description: string;
  }

  const steps = t.raw('steps') as Step[];

  return (
    <Section background="background" id="transformation">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-6 text-foreground">
          {t('title')}
        </h2>
        <p className="text-xl text-center text-white leading-relaxed mb-16">
          {t('subtitle')}
        </p>

        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center mr-6">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-primary/30 mt-2" style={{minHeight: '60px'}}></div>
                )}
              </div>
              <div className="flex-1 pt-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-light px-4 py-2 rounded-full text-sm font-semibold mb-3 border border-primary/30">
                  <Clock className="w-4 h-4" />
                  {step.time}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-lg text-white leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border-2 border-accent-success/30 rounded p-8 text-center">
          <p className="text-xl font-semibold text-foreground">
            {t('summary')}
          </p>
        </div>
      </div>
    </Section>
  );
}
