/**
 * AI Analyzer dla ConvertFix - analiza landing page z OpenAI
 *
 * Dwa tryby:
 * - Quick Audit ($29): 10 P0 issues, GPT-4o mini
 * - Professional Audit ($49): 20 P0+P1 issues, GPT-4o
 *
 * Refactored for modularity:
 * - Prompts extracted to lib/prompts/
 * - Validation moved to lib/validators/
 * - Metrics tracking in lib/utils/
 */

import OpenAI from 'openai';
import type { ScrapedData } from './scraper';
import { SYSTEM_PROMPT } from './prompts/system';
import { buildQuickPrompt } from './prompts/quick-user';
import { buildProfessionalPrompt } from './prompts/professional-user';
import { validateAuditResult } from './validators/audit-validator';
import { trackAuditMetrics } from './utils/metrics';

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

  const userPrompt = buildQuickPrompt(scraped);

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
          content: userPrompt,
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
    const result = validateAuditResult(rawResponse, 'quick');

    const elapsed = Date.now() - startTime;

    // Track metrics
    trackAuditMetrics({
      tier: 'quick',
      model: 'gpt-4o-mini',
      tokensUsed: completion.usage?.total_tokens || 0,
      timeMs: elapsed,
      issuesCount: result.problems.length,
      qualityScore: result.overallScore,
    });

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

  const userPrompt = buildProfessionalPrompt(scraped);

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
          content: userPrompt,
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
    const result = validateAuditResult(rawResponse, 'professional');

    const elapsed = Date.now() - startTime;

    // Track metrics
    trackAuditMetrics({
      tier: 'professional',
      model: 'gpt-4o',
      tokensUsed: completion.usage?.total_tokens || 0,
      timeMs: elapsed,
      issuesCount: result.problems.length,
      qualityScore: result.overallScore,
    });

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
// END OF REFACTORED ANALYZER
// ============================================================================
// All prompts moved to lib/prompts/
// All validation moved to lib/validators/audit-validator.ts
// All metrics moved to lib/utils/metrics.ts
