import { Section } from '../Section';
import { Button } from '../Button';

/**
 * FINAL CTA SECTION - Last Push to Convert
 *
 * DESIGN DECISIONS:
 * - 3 buttons side-by-side (desktop), stacked (mobile)
 * - Professional (center) slightly larger (scale-110)
 * - Guarantee reminder below
 */
export function FinalCTASection() {
  return (
    <Section background="slate" id="final-cta">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-3xl font-bold mb-8 text-slate-900">
          Ready to Fix Your Conversions?
        </h2>

        <p className="text-xl text-slate-600 mb-12">Choose your package:</p>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-8">
          <Button variant="secondary" href="#pricing">
            Quick Audit - $29
          </Button>
          <div className="transform lg:scale-110">
            <Button variant="primary" href="#pricing">
              Professional Audit - $49 ⭐
            </Button>
          </div>
          <Button variant="secondary" href="#pricing">
            Premium Audit - $99
          </Button>
        </div>

        <p className="text-sm text-slate-500">
          30-day money-back guarantee • Instant delivery • No subscription
        </p>
      </div>
    </Section>
  );
}
