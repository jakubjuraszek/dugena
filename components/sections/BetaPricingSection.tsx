import { Section } from '../Section';
import { CheckCircle, Clock } from 'lucide-react';

/**
 * BETA PRICING SECTION - Authentic Communication
 *
 * DESIGN DECISIONS:
 * - Honest, personal tone
 * - Beta deal highlighted in blue box
 * - Real counter (needs manual update or API)
 * - No fake urgency
 *
 * EMOTIONAL GOAL:
 * - Bootstrapper-to-bootstrapper trust
 * - Transparency = credibility
 * - Invite to be part of journey
 */
export function BetaPricingSection() {
  return (
    <Section background="elevated" id="beta-pricing">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-8 text-foreground">
          Beta Pricing (First 100 Customers)
        </h2>

        <div className="space-y-6 text-lg text-white leading-relaxed mb-12">
          <p>I&apos;m being honest with you: This is a new product.</p>

          <p>
            I&apos;ve spent 7 years coding. I know how to build products.<br />
            But I don&apos;t know if YOU will find this valuable until you try it.
          </p>

          <p className="text-xl font-semibold text-foreground">So here&apos;s the deal:</p>
        </div>

        <div className="bg-card border-2 border-primary/30 rounded p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            First 100 Customers Get:
          </h3>
          <ul className="space-y-3 text-lg text-white leading-relaxed">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
              <span>Full access to all features (10/20/30-point audits)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
              <span>Beta pricing locked forever (no price increases)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
              <span>Free access to future updates (video walkthroughs, competitor deep-dives)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
              <span>Direct line to me for feedback/feature requests</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
              <span>Early access to v2.0 features (A/B test suggestions, heatmap analysis)</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4 text-lg text-white leading-relaxed mb-12">
          <p className="font-semibold text-foreground">In exchange, I ask for:</p>
          <ul className="space-y-2 pl-6">
            <li className="flex items-start gap-3">
              <span className="mr-2">•</span>
              <span>Your honest feedback (what worked, what didn&apos;t)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mr-2">•</span>
              <span>A testimonial if it helps you convert (optional, but appreciated)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mr-2">•</span>
              <span>Patience if there&apos;s a bug (I&apos;ll fix it same-day)</span>
            </li>
          </ul>
        </div>

        <p className="text-xl text-center text-white leading-relaxed mb-8">
          This is bootstrapper-to-bootstrapper. No BS. Just a tool that helps you convert.
        </p>

        <div className="bg-card border-2 border-accent-warning/30 rounded p-6 text-center">
          <p className="text-lg flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <strong className="text-foreground">67 / 100 spots taken</strong>
            <span className="text-white">(updated daily)</span>
          </p>
          <p className="text-sm text-white/70 mt-2">
            {/* TODO: Replace with real Stripe customer count via API */}
          </p>
        </div>
      </div>
    </Section>
  );
}
