# Prompt Management Guide

This directory contains all AI prompts for the ConvertFix audit system. Prompts are separated from business logic to enable rapid iteration, A/B testing, and version control.

## File Structure

- **`system.ts`** - System prompt defining AI role, quality standards, and accuracy rules
- **`quick-user.ts`** - User prompt for Quick audits (10 P0 issues)
- **`professional-user.ts`** - User prompt for Professional audits (20 issues: 10 P0 + 10 P1)

## Version Header Template

Every prompt file MUST include a version header:

```typescript
/**
 * [Prompt Name and Purpose]
 *
 * VERSION: X.Y
 * LAST_UPDATED: YYYY-MM-DD
 * CHANGELOG: What changed in this version
 *
 * [Additional metadata like MODEL, AVG TOKENS, etc.]
 */
```

### Version Numbering

- **Major version (X.0)**: Significant prompt restructuring, new sections added/removed
- **Minor version (X.Y)**: Refinements to existing instructions, example updates, wording improvements

Examples:
- `1.0` → `2.0`: Added new P0 issue category, restructured focus areas
- `1.0` → `1.1`: Improved beforeExample/afterExample instructions
- `1.1` → `1.2`: Updated conversion benchmarks with newer data

## Prompt Iteration Workflow

### 1. Making Changes

When updating a prompt:

1. **Create a backup** (optional but recommended for major changes):
   ```bash
   cp lib/prompts/system.ts lib/prompts/system.v1.0.ts
   ```

2. **Update version header**:
   ```typescript
   VERSION: 1.1  // Increment from 1.0
   LAST_UPDATED: 2025-01-15
   CHANGELOG: Improved clarity on beforeExample quoting rules
   ```

3. **Make your changes** to the prompt content

4. **Test thoroughly** - Run both Quick and Professional audits on 3-5 test URLs

5. **Track metrics** - Compare quality scores, cost, and output quality vs previous version

### 2. A/B Testing Prompts

To A/B test two prompt variants:

```typescript
// In analyzer.ts (temporary code for testing)
import { SYSTEM_PROMPT as SYSTEM_PROMPT_V1 } from './prompts/system';
import { SYSTEM_PROMPT as SYSTEM_PROMPT_V2 } from './prompts/system.v2';

// Randomly assign variant
const systemPrompt = Math.random() > 0.5 ? SYSTEM_PROMPT_V1 : SYSTEM_PROMPT_V2;

// Track which variant was used
console.log(`Using system prompt: ${systemPrompt === SYSTEM_PROMPT_V1 ? 'v1' : 'v2'}`);
```

**Metrics to compare:**
- Quality score (overallScore from AI)
- Number of validation warnings
- beforeExample specificity (manual review)
- Cost per audit (token usage)
- User satisfaction (if you have feedback mechanism)

### 3. Rolling Back

If a new prompt version degrades quality:

1. **Check git history** to see previous version:
   ```bash
   git log lib/prompts/system.ts
   git show <commit-hash>:lib/prompts/system.ts
   ```

2. **Restore previous version**:
   ```bash
   git checkout <commit-hash> lib/prompts/system.ts
   ```

3. **Update version header** to reflect rollback:
   ```typescript
   VERSION: 1.0 (rolled back from 1.1)
   LAST_UPDATED: 2025-01-16
   CHANGELOG: Rolled back due to quality degradation - will retry improvements
   ```

## Quality Monitoring

After prompt changes, monitor these metrics (logged by `utils/metrics.ts`):

- **Quality score**: Should stay above 60-70 average
- **Token usage**: Watch for unexpected increases (more verbose = higher cost)
- **Validation warnings**: Increase suggests lower quality output
- **Issue count**: Should consistently hit 10 (Quick) or 20 (Professional)

## Best Practices

### ✅ DO:
- Test prompt changes on multiple URLs before deploying
- Version prompts before major experiments
- Document why you made changes in CHANGELOG
- Keep prompts focused and specific
- Use concrete examples in instructions

### ❌ DON'T:
- Deploy prompt changes without testing
- Make multiple changes at once (hard to debug)
- Remove accuracy/hallucination prevention rules
- Add vague instructions without examples
- Forget to update version headers

## Example Changelog Entries

Good changelog entries:

```typescript
CHANGELOG: Added explicit rule to prevent hallucinating H1 text when headings.h1 is empty
CHANGELOG: Updated conversion benchmarks with 2025 data from Wynter B2B study
CHANGELOG: Improved beforeExample format with more specific quoting patterns
CHANGELOG: Reduced focus areas from 12 to 10 to improve output consistency
```

Bad changelog entries:

```typescript
CHANGELOG: Updated prompt  // Too vague
CHANGELOG: Fixes  // What fixes?
CHANGELOG: Improvements  // What improved?
```

## Current Prompt Performance Baseline

As of 2025-01-03 (Version 1.0):

| Metric | Quick Audit | Professional Audit |
|--------|-------------|-------------------|
| Avg tokens | 3,000-5,000 | 4,000-6,000 |
| Avg cost | $0.0008-0.0015 | $0.010-0.020 |
| Avg quality score | 60-75 | 65-80 |
| Time | <10s | <15s |
| Issue count | 10 P0 | 20 (10 P0 + 10 P1) |

Use these as benchmarks when testing new versions.

## Future Improvements

Potential areas for prompt enhancement:

- [ ] Add more specific examples for each P0/P1 issue type
- [ ] Include visual design analysis (color contrast, spacing)
- [ ] Add competitive comparison (how does this page compare to category leaders?)
- [ ] Create industry-specific variants (B2B SaaS vs B2C SaaS vs PLG)
- [ ] Add A11y (accessibility) checks to audit criteria
- [ ] Implement prompt chaining (separate prompts for analysis vs synthesis)

---

**Questions?** Check the main [analyzer.ts](../ai-analyzer.ts) to see how these prompts are used in the audit pipeline.
