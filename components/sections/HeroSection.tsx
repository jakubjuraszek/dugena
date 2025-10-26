import { Button } from '../Button';
import { Section } from '../Section';
import { Target } from 'lucide-react';

/**
 * HERO SECTION - Above the Fold
 *
 * DESIGN DECISIONS:
 * - H1: text-5xl (56px desktop), centered, max-w-4xl = visual anchor
 * - Subheadline: text-xl, max-w-2xl = readable width (65-75 chars)
 * - CTAs: side-by-side desktop, stacked mobile
 * - Social proof: small, subtle, below CTAs
 *
 * SPACING RATIONALE:
 * - mb-8 between headline/subheadline: Related elements (grouping)
 * - mb-12 after subheadline: Separates intro from action
 * - gap-4 between buttons: Enough space to prevent misclicks
 *
 * EMOTIONAL GOAL:
 * - Calm, direct, honest (not hype)
 * - Immediate clarity on value prop
 */
export function HeroSection() {
  return (
    <Section background="white" id="hero">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-4xl font-bold mb-8 leading-tight tracking-tighter text-slate-900">
          You built a product. Nobody's converting.
        </h1>

        <p className="text-xl md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-12">
          AI analyzes your landing page in 60 seconds.
          See exactly what's killing your conversions.
          Fix it today. Starting at $29.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
          <Button variant="primary" href="#pricing">
            Get Your Audit - $29
          </Button>
          <Button variant="secondary" href="#how-it-works">
            See How It Works ↓
          </Button>
        </div>

        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Trained on 1,000+ successful SaaS launches</span>
        </p>
      </div>
    </Section>
  );
}
