import { Section } from '../Section';

/**
 * COMPARISON SECTION - Card-Based Layout
 *
 * DESIGN DECISIONS:
 * - Card-based layout (not table) for sophisticated dark theme
 * - 3-tier visual hierarchy:
 *   - Dimmed (opacity-60): Free tools, Freelancer, Agency
 *   - Visible (border-2): Quick & Premium + "OUR PRODUCT" labels
 *   - Glowing: Professional with orange glow + "BEST VALUE" badge
 * - Subtle gradients on each card for depth
 * - Mobile responsive: stack on mobile, 4 columns on desktop
 */
export function ComparisonSection() {
  return (
    <Section background="elevated" id="comparison">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#202020] to-transparent opacity-50 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center tracking-tight text-foreground">
          How We Compare
        </h2>

        <div className="space-y-2">

          {/* FREE TOOLS - Dimmed */}
          <div className="
            bg-gradient-to-r from-[#1c1c1c] to-[#202020]
            border border-[#1a1a1a]
            opacity-60
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
          ">
            <div>
              <div className="font-medium text-[#71717a]">Free tools</div>
              <div className="text-xs text-[#71717a] mt-1">(Fibr, VWO)</div>
            </div>
            <div className="text-[#71717a]">5 min</div>
            <div className="text-[#71717a]">$0</div>
            <div className="text-sm text-[#71717a]">Generic feedback, lead gen trap</div>
          </div>

          {/* QUICK AUDIT - Our product, visible */}
          <div className="
            bg-gradient-to-r from-[#222222] to-[#1a1a1a]
            border-2 border-border-medium
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
            hover:border-primary/30
            transition-all
          ">
            <div>
              <div className="font-bold text-white">Quick Audit</div>
              <div className="text-xs text-primary mt-1">OUR PRODUCT</div>
            </div>
            <div className="font-medium text-white">60 sec</div>
            <div className="text-primary font-bold">$29</div>
            <div className="text-sm text-white">10-point AI analysis, specific fixes</div>
          </div>

          {/* PROFESSIONAL AUDIT - Our main product, GLOWS */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-500/10 rounded blur-lg" />

            <div className="
              relative
              bg-gradient-to-r from-[#2a2a2a] to-[#222222]
              border-2 border-primary
              rounded p-6
              grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
              shadow-2xl shadow-orange-500/20
            ">
              <div>
                <div className="font-bold text-white flex flex-wrap items-center gap-2">
                  Professional Audit
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded font-bold">
                    ⭐ BEST VALUE
                  </span>
                </div>
                <div className="text-xs text-orange-400 mt-1">OUR MAIN PRODUCT</div>
              </div>
              <div className="font-medium text-white">60 sec</div>
              <div className="text-primary font-bold text-xl">$49</div>
              <div className="text-sm text-white">20 points + competitors + re-test</div>
            </div>
          </div>

          {/* PREMIUM AUDIT - Our product, visible */}
          <div className="
            bg-gradient-to-r from-[#222222] to-[#1a1a1a]
            border-2 border-border-medium
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
            hover:border-primary/30
            transition-all
          ">
            <div>
              <div className="font-bold text-white">Premium Audit</div>
              <div className="text-xs text-primary mt-1">OUR PRODUCT</div>
            </div>
            <div className="font-medium text-white">90 sec</div>
            <div className="text-primary font-bold">$99</div>
            <div className="text-sm text-white">30 points + video + copy + mobile</div>
          </div>

          {/* FREELANCER - Dimmed, competitor */}
          <div className="
            bg-gradient-to-r from-[#1c1c1c] to-[#202020]
            border border-[#1a1a1a]
            opacity-60
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
          ">
            <div>
              <div className="font-medium text-[#71717a]">Freelancer</div>
              <div className="text-xs text-[#71717a] mt-1">(Upwork)</div>
            </div>
            <div className="text-[#71717a]">3-5 hours</div>
            <div className="text-[#71717a]">$200-500</div>
            <div className="text-sm text-[#71717a]">Human review, 2-5 days wait</div>
          </div>

          {/* AGENCY - Dimmed, competitor */}
          <div className="
            bg-gradient-to-r from-[#1c1c1c] to-[#202020]
            border border-[#1a1a1a]
            opacity-60
            rounded p-6
            grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-center
          ">
            <div className="font-medium text-[#71717a]">Agency</div>
            <div className="text-[#71717a]">5-7 days</div>
            <div className="text-[#71717a]">$800-2000</div>
            <div className="text-sm text-[#71717a]">Comprehensive, slow, expensive</div>
          </div>

        </div>
      </div>
    </Section>
  );
}
