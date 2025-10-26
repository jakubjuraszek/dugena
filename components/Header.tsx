'use client';

import { FileText } from 'lucide-react';

/**
 * HEADER COMPONENT - Professional Trust Signal
 *
 * DESIGN DECISIONS:
 * - Fixed position: Always visible, professional presence
 * - Backdrop blur: Modern, premium feel (iOS/macOS aesthetic)
 * - Logo: Gradient box + FileText icon (placeholder, recognizable)
 * - CTA: "Get Started" → smooth scroll to pricing
 *
 * RATIONALE:
 * - Fixed header = trust signal (page looks "done" not "in progress")
 * - Gradient logo = professional (not just text)
 * - Backdrop blur = depth, polish
 * - Get Started CTA = always accessible conversion point
 *
 * TRUST IMPROVEMENT:
 * - Before: No header = looks unfinished, amateur
 * - After: Fixed header = professional, intentional, trustworthy
 */
export function Header() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-slate-900">
              Landing Page Auditor
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToPricing}
            className="
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold text-sm
              px-6 py-2.5 rounded-lg
              shadow-sm hover:shadow-md
              transition-all duration-200
              hover:-translate-y-0.5
            "
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Spacer for fixed header (prevents content from hiding under header) */}
      <div className="h-16" />
    </>
  );
}
