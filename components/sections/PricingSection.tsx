'use client';

import { Section } from '../Section';
import { PricingCard } from '../PricingCard';
import { useState } from 'react';

/**
 * PRICING SECTION - ⭐ MOST IMPORTANT
 *
 * DESIGN DECISIONS:
 * - Professional card: featured (scale-105, border-2, shadow-lg)
 * - 3-column grid desktop, stacked mobile
 * - Badge absolute positioning (top-right)
 * - Full feature lists (transparency = trust)
 * - Currency toggle for USD/PLN
 *
 * VISUAL HIERARCHY:
 * - Professional (center) is visually largest
 * - Badge draws eye immediately
 * - Price is text-4xl (highly visible)
 *
 * EMOTIONAL GOAL:
 * - Calm confidence (not aggressive)
 * - Transparent value (all features listed)
 * - Clear recommendation (MOST POPULAR badge)
 */
export function PricingSection() {
  const [currency, setCurrency] = useState<'USD' | 'PLN'>('USD');

  const prices = {
    quick: currency === 'USD' ? '$29' : '119 PLN',
    professional: currency === 'USD' ? '$49' : '199 PLN',
    premium: currency === 'USD' ? '$99' : '399 PLN',
  };

  return (
    <Section background="background" id="pricing" className="relative">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#151515] to-transparent opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            Choose Your Audit
          </h2>
          <p className="text-xl font-medium text-white leading-relaxed mb-6 tracking-tight">
            One-time payment. No subscription. Start at {currency === 'USD' ? '$29' : '119 PLN'}.
          </p>

          {/* Currency Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-md font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-primary text-white shadow-sm hover:scale-[1.02]'
                  : 'bg-card text-white hover:bg-cardHover border border-border hover:border-primary/30'
              }`}
            >
              USD $
            </button>
            <button
              onClick={() => setCurrency('PLN')}
              className={`px-4 py-2 rounded-md font-bold transition-all ${
                currency === 'PLN'
                  ? 'bg-primary text-white shadow-sm hover:scale-[1.02]'
                  : 'bg-card text-white hover:bg-cardHover border border-border hover:border-primary/30'
              }`}
            >
              PLN zł
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {/* Quick Audit */}
          <PricingCard
            name="Quick Audit"
            price={prices.quick}
            description="Quick insights to start"
            points={10}
            features={[
              "10-point conversion analysis",
              "PDF report (5-7 pages)",
              "Problem heatmap (P0/P1/P2)",
              "Top 3 Quick Wins",
              "Before/After for top 3 issues",
              "60-second delivery"
            ]}
            cta={`Get Quick Audit - ${prices.quick}`}
          />

          {/* Professional Audit - FEATURED */}
          <PricingCard
            name="Professional Audit"
            price={prices.professional}
            description="Everything you need to convert"
            points={20}
            popular={true}
            badge="⭐ MOST POPULAR"
            features={[
              "Everything in Quick, PLUS:",
              "20-point analysis (vs 10)",
              "PDF report (10-15 pages)",
              "Before/After for EVERY problem",
              "Top 5 Quick Wins",
              "Competitor comparison",
              "50% off re-test in 7 days",
              "Priority email support"
            ]}
            cta={`Get Professional Audit - ${prices.professional}`}
          />

          {/* Premium Audit */}
          <PricingCard
            name="Premium Audit"
            price={prices.premium}
            description="Professional insights + ongoing support"
            points={30}
            features={[
              "Everything in Professional, PLUS:",
              "30-point deep analysis (vs 20)",
              "PDF report (20-25 pages)",
              "Video Walkthrough",
              "3 alternative headlines",
              "3 alternative CTAs",
              "Dedicated mobile analysis",
              "FREE re-test within 30 days",
              "Priority support (24h response)"
            ]}
            cta={`Get Premium Audit - ${prices.premium}`}
          />
        </div>

        <div className="text-center bg-card border border-border rounded p-6">
          <p className="text-white leading-relaxed">
            <strong className="text-white">All packages include:</strong> 30-day money-back guarantee, instant delivery, specific fix instructions
          </p>
        </div>
      </div>
    </Section>
  );
}
