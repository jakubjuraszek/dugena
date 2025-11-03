import type { ScrapedData } from '../scraper';

/**
 * Professional Audit User Prompt - 20 Issues (10 P0 + 10 P1)
 *
 * VERSION: 1.0
 * LAST_UPDATED: 2025-01-03
 * CHANGELOG: Initial extraction from ai-analyzer.ts
 *
 * MODEL: gpt-4o
 * AVG TOKENS: ~4,000-6,000 (input + output)
 * PURPOSE: Comprehensive audit with critical and important fixes
 * EXPECTED OUTPUT: 20 issues (10 P0 + 10 P1) + 3-5 quick wins
 */

export function buildProfessionalPrompt(scraped: ScrapedData): string {
  const depth = '20 issues (10 P0 critical + 10 P1 important)';

  const focusAreas = `
P0 CRITICAL ISSUES (costs 20%+ conversion - find 10):

1. Headline outcome specificity - Quote exact H1 text
2. Risk reversal above fold - Look for guarantees, free trial mentions
3. Pricing transparency - Check if pricing is hidden or visible
4. CTA specificity - Quote exact CTA button text
5. Urgency/scarcity elements - Look for time-sensitive language
6. You-focused vs we-focused language - Analyze value prop wording
7. Social proof numbers above fold - Count testimonials, stats mentioned
8. Form friction - Count form fields if visible in content
9. Differentiation clarity - Check for "why us" messaging
10. Mobile optimization indicators - Check for mobile-specific content

P1 IMPORTANT ISSUES (costs 5-10% conversion - find 10):

1. Testimonials without faces/names/companies
   - Generic testimonials reduce trust by 43%
   - Quote actual testimonial text if present

2. Features listed without benefits
   - "Advanced analytics" vs "See which pages lose customers in real-time"
   - Quote 2-3 feature descriptions

3. No answer to "why now?" urgency question
   - Missing trigger: market change, new regulation, competitive threat
   - Creates apathy instead of action

4. FAQ missing top 3 objections
   - Check FAQ section for: pricing concerns, setup time, data security
   - Unaddressed objections kill 30% of ready-to-buy visitors

5. Case studies without specific numbers/results
   - "Great results" vs "2.4x revenue in 90 days"
   - Vague success stories reduce credibility by 67%

6. Pricing tiers not anchored (no "most popular" badge)
   - Price anchoring increases mid-tier selection by 38%
   - Check for visual emphasis on recommended tier

7. No progress indicators in signup flow
   - Multi-step forms without progress = 40% drop-off
   - Look for step indicators mentioned

8. Error messages not helpful/specific
   - Generic "Invalid input" vs "Email format: name@company.com"
   - Check for error handling mentions

9. Loading time indicators (>3 seconds)
   - Heavy images, no lazy loading mentions
   - 1 second delay = 7% conversion loss

10. No exit-intent offer
    - Missing last-chance offer for abandoning visitors
    - Exit-intent popups recover 15% of leaving traffic
`;

  return `You are analyzing a SaaS landing page for conversion optimization.

LANDING PAGE DATA:
${JSON.stringify(
    {
      url: scraped.url,
      title: scraped.title,
      metaDescription: scraped.metaDescription,
      headings: scraped.headings,
      contentPreview: scraped.content.substring(0, 8000), // First 8000 chars to capture more CTAs
      contentLength: scraped.content.length,
    },
    null,
    2
  )}

SCRAPED ELEMENT INVENTORY (What Actually Exists):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Page Title: ${scraped.title ? `"${scraped.title}"` : '❌ MISSING'}
📝 Meta Description: ${scraped.metaDescription ? `"${scraped.metaDescription}"` : '❌ MISSING - report as issue'}

📑 H1 Headings Found: ${scraped.headings.h1.length}
${
    scraped.headings.h1.length > 0
      ? scraped.headings.h1.map((h, i) => `   ${i + 1}. "${h}"`).join('\n')
      : '   ❌ NONE FOUND - Missing H1 is a CRITICAL SEO issue (report this!)'
  }

📑 H2 Headings Found: ${scraped.headings.h2.length}
${
    scraped.headings.h2.length > 0
      ? scraped.headings.h2
          .slice(0, 5)
          .map((h, i) => `   ${i + 1}. "${h}"`)
          .join('\n') +
        (scraped.headings.h2.length > 5
          ? `\n   ... +${scraped.headings.h2.length - 5} more`
          : '')
      : '   ❌ NONE FOUND'
  }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL REMINDER:
- If H1 headings list shows "NONE FOUND" → DO NOT say "Your H1 says..."
- If element is missing → Make the MISSING element the issue itself
- ONLY quote text from the data above - never make up examples

YOUR TASK:
Analyze this landing page and identify ${depth}.

ANALYSIS DEPTH:
${focusAreas}

OUTPUT FORMAT (strict JSON):
{
  "overallScore": 0-100,
  "problems": [
    {
      "id": "p1",
      "priority": "P0",
      "category": "headline",
      "issue": "Hero headline is feature-focused instead of outcome-focused",
      "impact": "Visitors bounce in 3 seconds because they don't understand the specific value. Feature headlines convert at 1.8% vs outcome-focused at 4.2% - you're losing 40%+ of potential customers",
      "fix": "Replace the feature description with a specific, measurable outcome that answers 'What do I get?' Use concrete numbers and timeframes",
      "beforeExample": "Your H1 heading says: 'All-in-one platform for modern teams' - this describes what you ARE, not what I GET",
      "afterExample": "Ship 2x faster with zero context switching between tools"
    },
    {
      "id": "p2",
      "priority": "P0",
      "category": "cta",
      "issue": "Primary CTA uses passive, generic text without urgency or specificity",
      "impact": "Generic CTAs convert at 2-3% while specific, urgent CTAs convert at 8-12%. Passive voice reduces click-through by 47%. You're leaving 60%+ of clicks on the table",
      "fix": "Rewrite CTA with active voice, specific benefit, and timeframe. Tell users exactly what they get and how fast",
      "beforeExample": "Your hero CTA button text is 'Start Free Trial' - doesn't tell me what happens next or how long it takes",
      "afterExample": "Get Your First Report in 60 Seconds - Free"
    }
  ],
  "quickWins": [
    {
      "change": "Add 'No credit card required' text directly under the CTA button (gray text, 14px). Expected lift: +15% clicks",
      "effort": "5 min",
      "impact": "high"
    },
    {
      "change": "Change CTA button color from gray (#666666) to high-contrast orange (#FF6B2C) or green (#10B981). Expected lift: +8% visibility",
      "effort": "5 min",
      "impact": "medium"
    },
    {
      "change": "Add specific social proof number above headline: '2,847 founders already using ConvertFix'. Expected lift: +7% trust",
      "effort": "20 min",
      "impact": "high"
    }
  ]
}

CRITICAL REQUIREMENTS:

1. overallScore: 0-100 (be ruthlessly honest, most SaaS pages score 45-65)

2. problems: EXACTLY 20 issues
   - ALL issues (P0 and P1) MUST have beforeExample with EXACT QUOTED TEXT
   - ALL issues MUST have afterExample with SPECIFIC REWRITE (no placeholders)
   - id: Sequential p1, p2, p3... p20
   - category: headline, cta, value-prop, social-proof, form, mobile, speed, design, trust, hierarchy, messaging
   - priority: P0 (critical, 20%+ impact) or P1 (important, 5-10% impact)

3. beforeExample FORMAT (MANDATORY):
   ✅ "Your H1 heading says: 'Fast Solutions for Your Business'"
   ✅ "Your CTA button text is 'Get Started'"
   ✅ "Your value prop paragraph reads: 'We help companies grow faster'"
   ❌ "Generic headline" - TOO VAGUE
   ❌ "Current CTA" - NOT SPECIFIC
   ❌ "[Current text]" - PLACEHOLDER

4. afterExample FORMAT (MANDATORY):
   ✅ "Ship 2x faster with zero context switching"
   ✅ "Get Your First Report in 60 Seconds - Free"
   ✅ "You'll cut customer research time from 40 hours to 4 hours per month"
   ❌ "[Your benefit here]" - PLACEHOLDER
   ❌ "Better version" - VAGUE
   ❌ "Improved headline" - NOT SPECIFIC

5. impact MUST INCLUDE:
   - Specific % conversion impact or benchmark
   - WHY it hurts (psychological principle)
   - Comparison numbers when possible
   Example: "Generic CTAs convert at 2-3% while specific CTAs hit 8-12%. You're losing 60%+ of potential clicks"

6. quickWins: 3-5 changes that are:
   - Implementable in <20 minutes
   - No developer needed (copy changes, color tweaks, text additions)
   - Include EXACT instructions (colors as hex codes, placement details, specific wording)
   - Include expected conversion lift %

   GOOD Quick Win Examples:
   ✅ "Change button color from #666666 to #FF6B2C - Expected lift: +8%"
   ✅ "Add countdown timer: '497 spots left for early access' - Expected lift: +12%"
   ✅ "Move testimonials above pricing section - Expected lift: +6%"

   BAD Quick Win Examples:
   ❌ "Improve design" - too vague
   ❌ "Add more content" - not specific
   ❌ "Optimize conversion" - no actionable instruction

REMEMBER: Every issue must be SO SPECIFIC that a founder can copy-paste the afterExample or hand it to a developer without any questions.

Return ONLY valid JSON matching the schema above. No markdown, no explanations, just pure JSON.`;
}
