import type { AuditResult } from '../ai-analyzer';

/**
 * Audit Validator - Validates and quality-checks AI audit responses
 *
 * PURPOSE:
 * - Parse and validate JSON structure from OpenAI
 * - Ensure all required fields are present
 * - Check beforeExample/afterExample quality
 * - Detect placeholder patterns and generic text
 * - Warn about quality issues without blocking
 */

/**
 * Validates AI audit result and performs quality checks
 *
 * @param rawJson - Raw JSON string from OpenAI API
 * @param mode - Audit mode ('quick' or 'professional')
 * @returns Validated AuditResult object
 * @throws Error if critical validation fails
 */
export function validateAuditResult(
  rawJson: string,
  mode: 'quick' | 'professional'
): AuditResult {
  let parsed: any;

  // Step 1: Parse JSON
  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    throw new Error(`Invalid JSON from OpenAI: ${error}`);
  }

  // Step 2: Validate structure
  if (typeof parsed.overallScore !== 'number') {
    throw new Error('Missing or invalid overallScore');
  }

  if (!Array.isArray(parsed.problems)) {
    throw new Error('Missing or invalid problems array');
  }

  if (!Array.isArray(parsed.quickWins)) {
    throw new Error('Missing or invalid quickWins array');
  }

  // Step 3: Check issue count
  const expectedCount = mode === 'quick' ? 10 : 20;
  if (parsed.problems.length < expectedCount - 2) {
    // Allow -2 tolerance
    console.warn(
      `⚠️ Expected ${expectedCount} issues, got ${parsed.problems.length}`
    );
  }

  // Step 4: Validate each issue
  parsed.problems.forEach((issue: any, index: number) => {
    // Required fields
    if (!issue.id || !issue.priority || !issue.category) {
      throw new Error(
        `Issue #${index + 1} missing required fields (id, priority, category)`
      );
    }

    if (!issue.issue || !issue.impact || !issue.fix) {
      throw new Error(
        `Issue #${index + 1} missing description fields (issue, impact, fix)`
      );
    }

    // beforeExample validation
    if (!issue.beforeExample || issue.beforeExample.length < 20) {
      throw new Error(
        `Issue ${issue.id} missing beforeExample or too short. Must contain EXACT QUOTED TEXT from the page (min 20 chars). Got: "${issue.beforeExample || 'empty'}"`
      );
    }

    // afterExample validation
    if (!issue.afterExample || issue.afterExample.length < 20) {
      throw new Error(
        `Issue ${issue.id} missing afterExample or too short. Must contain SPECIFIC REWRITE, not placeholder (min 20 chars). Got: "${issue.afterExample || 'empty'}"`
      );
    }

    // Check for placeholder patterns in afterExample
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

  // Step 5: Quality checks (warnings, not errors)
  checkQualityStandards(parsed, mode);

  return parsed as AuditResult;
}

/**
 * Additional quality checks that warn but don't block
 * Helps identify areas where AI output could be improved
 */
function checkQualityStandards(result: any, mode: string): void {
  const issues = result.problems;

  // Quality check 1: beforeExample should not contain generic phrases
  const genericPhrases = ['current text', 'your text', 'generic', 'placeholder'];
  issues.forEach((issue: any) => {
    genericPhrases.forEach((phrase) => {
      if (issue.beforeExample.toLowerCase().includes(phrase)) {
        console.warn(
          `⚠️ Quality: Issue ${issue.id} has potentially generic beforeExample: "${issue.beforeExample}"`
        );
      }
    });
  });

  // Quality check 2: impact must include specific numbers (% or multiplier)
  issues.forEach((issue: any) => {
    const hasPercentage = /\d+%/.test(issue.impact);
    const hasMultiplier = /\d+x/.test(issue.impact);
    const hasNumber = /\d+/.test(issue.impact);

    if (!hasPercentage && !hasMultiplier && !hasNumber) {
      console.warn(
        `⚠️ Quality: Issue ${issue.id} impact lacks specific numbers or percentages: "${issue.impact}"`
      );
    }
  });

  // Quality check 3: quickWins should mention expected lift/impact
  result.quickWins.forEach((win: any, i: number) => {
    const mentionsLift =
      /lift|expected|\d+%|increase|improve/i.test(win.change);
    if (!mentionsLift) {
      console.warn(
        `⚠️ Quality: Quick Win #${i + 1} lacks expected impact measurement: "${win.change}"`
      );
    }
  });

  // Quality check 4: Check for repeated beforeExample text (potential lazy output)
  const beforeExamples = issues.map((issue: any) => issue.beforeExample);
  const uniqueBeforeExamples = new Set(beforeExamples);
  if (uniqueBeforeExamples.size < beforeExamples.length) {
    console.warn(
      `⚠️ Quality: Found ${beforeExamples.length - uniqueBeforeExamples.size} duplicate beforeExample texts - AI might be reusing quotes`
    );
  }

  // Quality check 5: Verify priority distribution (should have both P0 and P1 if professional)
  if (mode === 'professional') {
    const p0Count = issues.filter(
      (issue: any) => issue.priority === 'P0'
    ).length;
    const p1Count = issues.filter(
      (issue: any) => issue.priority === 'P1'
    ).length;

    if (p0Count === 0) {
      console.warn(`⚠️ Quality: No P0 issues found in professional audit`);
    }
    if (p1Count === 0) {
      console.warn(`⚠️ Quality: No P1 issues found in professional audit`);
    }

    // Ideal: 10 P0 + 10 P1
    if (Math.abs(p0Count - 10) > 3 || Math.abs(p1Count - 10) > 3) {
      console.warn(
        `⚠️ Quality: Priority distribution off target (P0: ${p0Count}, P1: ${p1Count}). Expected ~10 P0 + ~10 P1`
      );
    }
  }
}
