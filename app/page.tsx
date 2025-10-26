import { Header } from '@/components/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { WhyNowSection } from '@/components/sections/WhyNowSection';
import { ThisWorksSection } from '@/components/sections/ThisWorksSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { TransformationSection } from '@/components/sections/TransformationSection';
import { SocialProofSection } from '@/components/sections/SocialProofSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { BetaPricingSection } from '@/components/sections/BetaPricingSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';
import { PSSection } from '@/components/sections/PSSection';
import { Footer } from '@/components/sections/Footer';

/**
 * LANDING PAGE AUDITOR - Main Page
 *
 * STRUCTURE (13 sections):
 * 1. Hero (above fold)
 * 2. Problem (identify pain)
 * 3. Why Now (3 breakthroughs)
 * 4. This Works For You (5 scenarios)
 * 5. Pricing ⭐ (center stage, 3 tiers)
 * 6. Comparison (vs alternatives)
 * 7. Transformation (timeline journey)
 * 8. Social Proof (beta honest)
 * 9. How It Works (3 steps)
 * 10. FAQ (10 questions)
 * 11. Beta Pricing (authentic)
 * 12. Final CTA (repeat pricing)
 * 13. P.S. (personal note)
 * 14. Footer
 *
 * DESIGN PHILOSOPHY:
 * - Generous white space (py-24 sections)
 * - Clear hierarchy (h1 > h2 > body)
 * - Calm colors (blue-600, slate-800)
 * - Mobile-first responsive
 * - Honest, anti-hype tone
 *
 * VALUES:
 * - Honesty / Simplicity
 * - Quality / Calm
 * - Bootstrapper-to-bootstrapper
 */
export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Grid pattern background - fixed overlay */}
      <div className="fixed inset-0 bg-grid opacity-[0.06] pointer-events-none" />

      {/* Main content */}
      <div className="relative">
        <Header />
        <HeroSection />
        <ProblemSection />
        <WhyNowSection />
        <ThisWorksSection />
        <PricingSection />
        <ComparisonSection />
        <TransformationSection />
        <SocialProofSection />
        <HowItWorksSection />
        <FAQSection />
        <BetaPricingSection />
        <FinalCTASection />
        <PSSection />
        <Footer />
      </div>
    </main>
  );
}
