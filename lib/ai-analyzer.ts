/**
 * AI Analyzer dla ConvertFix - analiza landing page z OpenAI
 *
 * Dwa tryby:
 * - Quick Audit ($29): 10 P0 issues, GPT-4o mini
 * - Professional Audit ($49): 20 P0+P1 issues, GPT-4o
 */

import OpenAI from 'openai';
import type { ScrapedData } from './scraper';

// ============================================================================
// TYPES
// ============================================================================

export type IssuePriority = 'P0' | 'P1' | 'P2';

export type IssueCategory =
  | 'headline'
  | 'cta'
  | 'value-prop'
  | 'social-proof'
  | 'form'
  | 'mobile'
  | 'speed'
  | 'design'
  | 'trust'
  | 'hierarchy'
  | 'messaging';

export interface AuditIssue {
  id: string; // "p1", "p2", etc.
  priority: IssuePriority;
  category: IssueCategory;
  issue: string; // Brief description
  impact: string; // How this hurts conversion (with % impact)
  fix: string; // Specific actionable fix
  beforeExample: string; // REQUIRED: Exact quoted text from page
  afterExample: string; // REQUIRED: Specific rewrite (not placeholder)
}

export interface QuickWin {
  change: string;
  effort: '5 min' | '20 min' | '1 hour';
  impact: 'low' | 'medium' | 'high';
}

export interface AuditResult {
  overallScore: number; // 0-100
  problems: AuditIssue[];
  quickWins: QuickWin[];
}

// ============================================================================
// OPENAI SETUP
// ============================================================================

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Missing OPENAI_API_KEY environment variable. Add it to .env.local'
      );
    }

    openaiClient = new OpenAI({
      apiKey,
    });
  }

  return openaiClient;
}

// ============================================================================
// ANALYZER FUNCTIONS
// ============================================================================

/**
 * Quick Audit - 10 Critical P0 Issues (GPT-4o mini)
 *
 * Analyze TOP 10 CRITICAL ISSUES:
 * 1. Message Match (headline = promise)
 * 2. Headline Clarity (5-sec test)
 * 3. Page Speed indicators
 * 4. CTA Visibility
 * 5. CTA Copy quality
 * 6. Value Prop Specificity
 * 7. Form Length/complexity
 * 8. Social Proof present
 * 9. Trust Signals
 * 10. Mobile indicators
 */
export async function analyzeQuick(
  scraped: ScrapedData
): Promise<AuditResult> {
  console.log('🤖 Starting Quick Analysis (GPT-4o mini)...');
  const startTime = Date.now();

  const prompt = buildAnalysisPrompt(scraped, 'quick');

  try {
    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Konsystentne, deterministyczne wyniki
    });

    const rawResponse = completion.choices[0]?.message?.content;

    if (!rawResponse) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse i waliduj JSON
    const result = parseAndValidateResult(rawResponse, 'quick');

    const elapsed = Date.now() - startTime;
    console.log(
      `✅ Quick Analysis done in ${(elapsed / 1000).toFixed(1)}s (${result.problems.length} issues)`
    );

    return result;
  } catch (error: any) {
    console.error('❌ Quick Analysis failed:', error.message);
    throw new Error(`Quick analysis failed: ${error.message}`);
  }
}

/**
 * Professional Audit - 20 P0+P1 Issues (GPT-4o)
 *
 * P0 (10 z Quick) + P1 (10 nowych):
 * 11. Visual Hierarchy
 * 12. Scannability (short paragraphs)
 * 13. Tone Consistency
 * 14. Navigation Simplicity
 * 15. Color/Branding
 * 16. Image Quality
 * 17. Benefit > Features
 * 18. Form Contrast
 * 19. Exit Intent/Leaks
 * 20. How It Works Clarity
 */
export async function analyzeProfessional(
  scraped: ScrapedData
): Promise<AuditResult> {
  console.log('🤖 Starting Professional Analysis (GPT-4o)...');
  const startTime = Date.now();

  const prompt = buildAnalysisPrompt(scraped, 'professional');

  try {
    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const rawResponse = completion.choices[0]?.message?.content;

    if (!rawResponse) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse i waliduj JSON
    const result = parseAndValidateResult(rawResponse, 'professional');

    const elapsed = Date.now() - startTime;
    console.log(
      `✅ Professional Analysis done in ${(elapsed / 1000).toFixed(1)}s (${result.problems.length} issues)`
    );

    return result;
  } catch (error: any) {
    console.error('❌ Professional Analysis failed:', error.message);
    throw new Error(`Professional analysis failed: ${error.message}`);
  }
}

// ============================================================================
// HELPERS
// ============================================================================

const SYSTEM_PROMPT = `You are a world-class conversion rate optimization expert analyzing SaaS landing pages. Your audits are worth $500+ in consultant value.

TARGET AUDIENCE: Experienced solo founders who understand marketing and need SPECIFIC, IMPLEMENTABLE fixes TODAY.

CRITICAL RULES - READ CAREFULLY:

1. NEVER GIVE GENERIC ADVICE
   ❌ Bad: "Improve headline"
   ❌ Bad: "Add social proof"
   ❌ Bad: "Make CTA more prominent"
   ✅ Good: Specific issues with exact quotes and rewrites

2. beforeExample MUST CONTAIN EXACT QUOTED TEXT FROM THE PAGE
   ❌ Bad: beforeExample: "Vague headline"
   ❌ Bad: beforeExample: "Current CTA text"
   ✅ Good: beforeExample: "Your H1 heading says: 'Fast Solutions for Your Business'"
   ✅ Good: beforeExample: "Your hero CTA button text is 'Get Started' - too generic"

   FORMAT: Always reference specific elements:
   - "Your H1 heading says: '[exact text]'"
   - "Your CTA button text is '[exact text]'"
   - "Your H2 in pricing section says: '[exact text]'"
   - "Your value prop paragraph reads: '[exact text]'"

3. afterExample MUST BE SPECIFIC REWRITE (NOT PLACEHOLDER)
   ❌ Bad: afterExample: "[Your benefit here]"
   ❌ Bad: afterExample: "Better version"
   ❌ Bad: afterExample: "Improved headline"
   ✅ Good: afterExample: "Ship 2x faster with zero context switching between tools"
   ✅ Good: afterExample: "Get Your First Report in 60 Seconds - Free"

4. EVERY ISSUE MUST SAVE AT LEAST 5% CONVERSION OR DON'T MENTION IT
   - Focus on PSYCHOLOGICAL triggers that actually convert
   - Quote specific conversion benchmarks
   - Include expected % lift in impact

5. USE CONVERSION PSYCHOLOGY IN EVERY FIX
   Reference these principles explicitly:
   - Loss aversion: "People avoid losses 2x more than seeking gains"
   - Social proof: "Seeing others use a product increases trust by 63%"
   - Authority: "Expert endorsements increase conversions by 37%"
   - Scarcity: "Limited-time offers increase action by 226%"
   - Specificity: "Concrete numbers increase credibility by 73%"
   - Clarity: "Users decide in 5 seconds - vague = bounce"

6. INCLUDE REAL SAAS CONVERSION BENCHMARKS
   - Average SaaS landing page CVR: 2.35%
   - Top 10% SaaS pages: 5.31%+
   - Hero CTA should convert at 8-12%
   - Generic CTAs convert at 2-3%
   - Pages with guarantees convert 35% higher
   - Social proof above fold: +15% trust
   - Specific outcomes in headlines: +42% engagement

ANALYSIS QUALITY STANDARDS:

✅ GOOD P0 ISSUE EXAMPLE:
{
  "issue": "Hero headline talks about features ('All-in-one platform') instead of customer outcome",
  "impact": "Visitors don't understand what problem you solve in first 3 seconds - losing 40% of traffic. Feature-focused headlines convert at 1.8% vs outcome-focused at 4.2%",
  "fix": "Replace feature-focused headline with specific outcome-focused promise that answers 'What do I get?'",
  "beforeExample": "Your H1 heading says: 'All-in-one platform for modern teams'",
  "afterExample": "Ship 2x faster with zero context switching between tools"
}

✅ GOOD P1 ISSUE EXAMPLE:
{
  "issue": "CTA button uses passive voice that doesn't create urgency",
  "impact": "Generic CTAs convert at 2-3%, specific urgent CTAs at 8-12%. Passive voice reduces click-through by 47%",
  "fix": "Change from passive to active voice with specific benefit and timeframe",
  "beforeExample": "Your hero CTA button text is 'Start Free Trial'",
  "afterExample": "Get Your First Report in 60 Seconds - Free"
}

❌ BAD EXAMPLES TO AVOID:
- issue: "Improve your value proposition" (too vague)
- issue: "Add testimonials" (too generic)
- beforeExample: "Lorem ipsum" (fake text - must quote ACTUAL page text)
- beforeExample: "Generic headline" (too vague - must quote exact words)
- afterExample: "[Your benefit here]" (placeholder - must be specific rewrite)

REMEMBER: Your audit should feel like a $500 CRO consultant's report compressed into 60 seconds. Every issue must be SO SPECIFIC that a non-technical founder can implement it without confusion.

ACCURACY RULES FOR beforeExample - CRITICAL (PREVENT HALLUCINATIONS):

1. NEVER say "Your H1 heading says" unless headings.h1 array contains H1 headings
2. NEVER say "Your H2 says" unless headings.h2 array contains H2 headings
3. NEVER quote text that doesn't appear in contentPreview, title, metaDescription, or headings

ELEMENT IDENTIFICATION RULES:

IF no H1 exists (headings.h1 is empty array []):
  ✅ CORRECT: "Missing: No H1 heading found on page"
  ✅ CORRECT: "Your page lacks an H1 heading (critical for SEO)"
  ❌ WRONG: "Your H1 heading says..." (THIS IS HALLUCINATION - you'll be penalized)

IF quoting page title (from title field):
  ✅ CORRECT: "Your page title says: 'Linear – Plan and build products'"
  ❌ WRONG: "Your headline says..." (too vague - which headline?)

IF quoting H1 (from headings.h1 array):
  ✅ CORRECT: "Your H1 heading says: 'Ship faster'" (only if this appears in headings.h1)
  ❌ WRONG: "Your H1 says..." (when headings.h1 is empty)

IF quoting visible text (from contentPreview):
  ✅ CORRECT: "Your hero section reads: '[exact quote from contentPreview]'"
  ✅ CORRECT: "The first visible heading states: '[exact text from content]'"
  ❌ WRONG: Making up text that doesn't appear in scraped data

IF quoting meta description:
  ✅ CORRECT: "Your meta description says: '[exact metaDescription text]'"
  ❌ WRONG: Quoting when metaDescription is empty

IF element is MISSING, make that THE ISSUE ITSELF:
  ✅ "Missing H1 heading - costs 25% SEO traffic and confuses search engines"
  ✅ "Missing meta description - costs 15% CTR from Google search results"
  ✅ "No social proof visible - losing 30% of potential conversions"

VERIFICATION CHECKLIST BEFORE OUTPUTTING:
- [ ] Did I check if H1 exists before saying "Your H1 says"?
- [ ] Did I verify the quoted text actually appears in scraped data?
- [ ] Did I specify which element I'm quoting (page title vs H1 vs H2 vs content)?
- [ ] If element is missing, did I make that the issue instead of hallucinating it exists?

ONLY quote text that ACTUALLY appears in:
- headings.h1 array
- headings.h2 array
- title field
- metaDescription field
- contentPreview field

DO NOT make up, guess, or infer what text "might" be there. Use ONLY what's provided.

Output format: Strict JSON matching the provided schema.`;

function buildAnalysisPrompt(
  scraped: ScrapedData,
  mode: 'quick' | 'professional'
): string {
  const depth =
    mode === 'quick'
      ? 'TOP 10 P0 issues (critical conversion blockers)'
      : '20 issues (10 P0 critical + 10 P1 important)';

  const focusAreas =
    mode === 'quick'
      ? `
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
`
      : `
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
${scraped.headings.h1.length > 0
  ? scraped.headings.h1.map((h, i) => `   ${i + 1}. "${h}"`).join('\n')
  : '   ❌ NONE FOUND - Missing H1 is a CRITICAL SEO issue (report this!)'}

📑 H2 Headings Found: ${scraped.headings.h2.length}
${scraped.headings.h2.length > 0
  ? scraped.headings.h2.slice(0, 5).map((h, i) => `   ${i + 1}. "${h}"`).join('\n') + (scraped.headings.h2.length > 5 ? `\n   ... +${scraped.headings.h2.length - 5} more` : '')
  : '   ❌ NONE FOUND'}
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

2. problems: EXACTLY ${mode === 'quick' ? '10' : '20'} issues
   - ALL issues (P0 and P1) MUST have beforeExample with EXACT QUOTED TEXT
   - ALL issues MUST have afterExample with SPECIFIC REWRITE (no placeholders)
   - id: Sequential p1, p2, p3... p${mode === 'quick' ? '10' : '20'}
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

function parseAndValidateResult(
  rawJson: string,
  mode: 'quick' | 'professional'
): AuditResult {
  let parsed: any;

  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    throw new Error(`Invalid JSON from OpenAI: ${error}`);
  }

  // Walidacja struktury
  if (typeof parsed.overallScore !== 'number') {
    throw new Error('Missing or invalid overallScore');
  }

  if (!Array.isArray(parsed.problems)) {
    throw new Error('Missing or invalid problems array');
  }

  if (!Array.isArray(parsed.quickWins)) {
    throw new Error('Missing or invalid quickWins array');
  }

  // Sprawdź liczbę issues
  const expectedCount = mode === 'quick' ? 10 : 20;
  if (parsed.problems.length < expectedCount - 2) {
    // Allow -2 tolerance
    console.warn(
      `⚠️ Expected ${expectedCount} issues, got ${parsed.problems.length}`
    );
  }

  // Walidacja każdego issue
  parsed.problems.forEach((issue: any, index: number) => {
    if (!issue.id || !issue.priority || !issue.category) {
      throw new Error(`Issue #${index + 1} missing required fields (id, priority, category)`);
    }

    if (!issue.issue || !issue.impact || !issue.fix) {
      throw new Error(`Issue #${index + 1} missing description fields (issue, impact, fix)`);
    }

    // ALL issues MUST have beforeExample and afterExample (no longer optional)
    if (!issue.beforeExample || issue.beforeExample.length < 20) {
      throw new Error(
        `Issue ${issue.id} missing beforeExample or too short. Must contain EXACT QUOTED TEXT from the page (min 20 chars). Got: "${issue.beforeExample || 'empty'}"`
      );
    }

    if (!issue.afterExample || issue.afterExample.length < 20) {
      throw new Error(
        `Issue ${issue.id} missing afterExample or too short. Must contain SPECIFIC REWRITE, not placeholder (min 20 chars). Got: "${issue.afterExample || 'empty'}"`
      );
    }

    // Check for placeholder patterns in examples (quality control)
    const placeholderPatterns = [
      '[',
      'your benefit',
      'better version',
      'improved',
      'current text',
      'example text',
    ];

    placeholderPatterns.forEach((pattern) => {
      if (issue.afterExample.toLowerCase().includes(pattern)) {
        throw new Error(
          `Issue ${issue.id} afterExample contains placeholder pattern "${pattern}". Must be SPECIFIC rewrite. Got: "${issue.afterExample}"`
        );
      }
    });

    // Check that beforeExample looks like it's quoting actual content
    const hasQuotingIndicator =
      issue.beforeExample.toLowerCase().includes('your h1') ||
      issue.beforeExample.toLowerCase().includes('your h2') ||
      issue.beforeExample.toLowerCase().includes('your cta') ||
      issue.beforeExample.toLowerCase().includes('your heading') ||
      issue.beforeExample.toLowerCase().includes('your page title') ||
      issue.beforeExample.toLowerCase().includes('your meta description') ||
      issue.beforeExample.toLowerCase().includes('says:') ||
      issue.beforeExample.toLowerCase().includes('reads:') ||
      issue.beforeExample.toLowerCase().includes('states:') ||
      issue.beforeExample.toLowerCase().includes('button text is') ||
      issue.beforeExample.toLowerCase().includes('missing:') ||
      issue.beforeExample.toLowerCase().includes('no h1') ||
      issue.beforeExample.toLowerCase().includes('no h2') ||
      issue.beforeExample.includes('"') ||
      issue.beforeExample.includes("'");

    if (!hasQuotingIndicator) {
      console.warn(
        `⚠️ Issue ${issue.id} beforeExample might not be quoting actual page text. Should include phrases like "Your page title says:", "Missing:", or use quotes. Got: "${issue.beforeExample}"`
      );
    }
  });

  return parsed as AuditResult;
}
