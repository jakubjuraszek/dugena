'use client';

import { Section } from '../Section';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../CurrencyContext';

/**
 * HOW IT WORKS SECTION - 3 Simple Steps
 *
 * DESIGN DECISIONS:
 * - 3-column grid desktop, 1 column mobile
 * - Large numbered circles (text-4xl)
 * - Simple, clear language
 * - Guarantee box in green accent
 */
export function HowItWorksSection() {
  const t = useTranslations('howItWorks');
  const tPricing = useTranslations('pricing');
  const { currency } = useCurrency();

  interface Step {
    number: string;
    title: string;
    description: string;
  }

  const steps = t.raw('steps') as Step[];

  // Get dynamic prices
  const quickPrice = currency === 'USD' ? tPricing('tiers.quick.price.usd') : tPricing('tiers.quick.price.pln');
  const professionalPrice = currency === 'USD' ? tPricing('tiers.professional.price.usd') : tPricing('tiers.professional.price.pln');
  const premiumPrice = currency === 'USD' ? tPricing('tiers.premium.price.usd') : tPricing('tiers.premium.price.pln');

  // Replace price placeholders in step descriptions
  const getDescriptionWithPrices = (description: string) => {
    return description
      .replace(/Quick \(\$29\)|Quick \(119 PLN\)/, `Quick (${quickPrice})`)
      .replace(/Professional \(\$49\)|Professional \(199 PLN\)/, `Professional (${professionalPrice})`)
      .replace(/Premium \(\$99\)|Premium \(399 PLN\)/, `Premium (${premiumPrice})`);
  };

  return (
    <Section background="background" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-16 text-foreground">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-white rounded-full text-4xl font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
              <p className="text-lg text-white leading-relaxed">{getDescriptionWithPrices(step.description)}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded p-8 text-center border-2 border-accent-success/30">
          <p className="text-2xl font-bold text-foreground mb-2">
            {t('guaranteeTitle')}
          </p>
          <p className="text-lg text-white leading-relaxed">
            {t('guaranteeText')}
          </p>
        </div>
      </div>
    </Section>
  );
}
