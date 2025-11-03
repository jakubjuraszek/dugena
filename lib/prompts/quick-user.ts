import type { ScrapedData } from '../scraper';

/**
 * Quick Audit User Prompt - 10 P0 Critical Issues
 *
 * VERSION: 1.0
 * LAST_UPDATED: 2025-01-03
 * CHANGELOG: Initial extraction from ai-analyzer.ts
 *
 * MODEL: gpt-4o-mini
 * AVG TOKENS: ~3,000-5,000 (input + output)
 * PURPOSE: Fast, focused audit for founders who need critical fixes NOW
 * EXPECTED OUTPUT: 10 P0 issues + 3-5 quick wins
 */

export function buildQuickPrompt(scraped: ScrapedData): string {
  const depth = 'TOP 10 P0 issues (critical conversion blockers)';

  const focusAreas = `
P0 CRITICAL ISSUES (costs 20%+ conversion - find 10):

1. Headline doesn't mention specific outcome/benefit within 5 words
   - Check H1 heading for vague language ("solutions", "platform", "software")
   - Must answer: "What specific result do I get?"
   - Quote exact H1 text in beforeExample

2. No risk reversal (guarantee/refund) visible above fold
   - Look for: money-back guarantee, free trial, no credit card required
   - Impact: Pages with guarantees convert 35% higher

3. Price hidden or requires signup to see
   - Pricing transparency increases trust by 24%
   - Hidden pricing signals potential overpricing (loss aversion triggers)

4. CTA doesn't specify what happens next
   - Generic "Get Started" vs specific "Get Your First Report in 60 Seconds"
   - Quote exact CTA button text in beforeExample

5. No urgency/scarcity elements
   - Check for: limited-time offers, countdown timers, "X people signed up today"
   - Scarcity increases action by 226%

6. Value prop uses "we/our" instead of "you/your"
   - Company-focused vs customer-focused language
   - "You/your" language increases engagement by 73%

7. No social proof numbers in first scroll
   - Look for: customer count, revenue stats, testimonial quotes
   - Social proof above fold increases trust by 15%

8. Form asks for too much info upfront
   - Count form fields - more than 3 reduces conversions by 50%
   - Quote actual form field labels if visible

9. No clear differentiation from alternatives
   - Must answer: "Why you, not competitors?"
   - Unique value prop missing = commodity perception

10. Mobile CTA not sticky/visible
    - Check for mobile optimization indicators in content
    - Mobile users make up 60%+ of traffic
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

2. problems: EXACTLY 10 issues
   - ALL issues (P0) MUST have beforeExample with EXACT QUOTED TEXT
   - ALL issues MUST have afterExample with SPECIFIC REWRITE (no placeholders)
   - id: Sequential p1, p2, p3... p10
   - category: headline, cta, value-prop, social-proof, form, mobile, speed, design, trust, hierarchy, messaging
   - priority: P0 (critical, 20%+ impact)

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
