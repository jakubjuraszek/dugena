import { Section } from '../Section';
import { CheckCircle } from 'lucide-react';

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
  return (
    <Section background="elevated" id="social-proof">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-3xl font-bold mb-6 text-white tracking-tight">
          What Beta Testers Say
        </h2>
        <p className="text-lg text-white leading-relaxed mb-12">
          We&apos;re in beta. First 100 customers get lifetime access to updates.
        </p>

        <div className="bg-card border-2 border-dashed border-medium rounded p-12 shadow-lg mb-12">
          <p className="text-xl text-secondary mb-4">Beta testimonials coming soon...</p>
          <p className="text-lg text-white leading-relaxed">
            Be one of the first 100. Get early pricing. Help shape the product.
          </p>
        </div>

        <div className="space-y-4 text-lg text-white leading-relaxed">
          <p className="flex items-center justify-center gap-3">
            <CheckCircle className="w-6 h-6 text-accent-success" />
            <span>Trained on 1,000+ successful launches</span>
          </p>
          <p className="flex items-center justify-center gap-3">
            <CheckCircle className="w-6 h-6 text-accent-success" />
            <span>30-day money-back guarantee</span>
          </p>
          <p className="flex items-center justify-center gap-3">
            <CheckCircle className="w-6 h-6 text-accent-success" />
            <span>Made by a founder, for founders</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
