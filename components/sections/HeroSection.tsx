import { Button } from '../Button';
import { Section } from '../Section';
import { AnimatedCounter } from '../AnimatedCounter';
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
    <Section background="background" id="hero" className="relative overflow-hidden">
      {/* Decorative gradient backgrounds - subtle, ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-success/10 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
          You built a product.<br />
          Nobody&apos;s converting.
        </h1>

        <p className="text-xl md:text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-12">
          AI analyzes your landing page in 60 seconds.
          See exactly what&apos;s killing your conversions.
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

        <div className="flex items-center justify-center gap-2 text-sm text-muted">
          <Target className="w-5 h-5 text-primary" />
          <span>Trained on </span>
          <AnimatedCounter from={0} to={1247} duration={2000} suffix="+" />
          <span> successful SaaS launches</span>
        </div>
      </div>
    </Section>
  );
}
