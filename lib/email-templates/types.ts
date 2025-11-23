/**
 * Email template types for ConvertFix
 */

export interface AuditEmailData {
  /** Audited landing page URL */
  url: string;

  /** Total number of conversion issues found */
  issueCount: number;

  /** Number of critical/high-priority issues */
  criticalCount: number;

  /** Number of quick wins (easy fixes with high impact) */
  quickWinsCount: number;

  /** Estimated conversion rate improvement percentage */
  impactPercent: number;

  /** CTA URL (link to view full audit - PDF download or dashboard) */
  ctaUrl: string;
}

/**
 * Template placeholders used in HTML/text templates
 */
export const TEMPLATE_PLACEHOLDERS = {
  URL: '{{URL}}',
  ISSUE_COUNT: '{{ISSUE_COUNT}}',
  CRITICAL_COUNT: '{{CRITICAL_COUNT}}',
  QUICK_WINS_COUNT: '{{QUICK_WINS_COUNT}}',
  IMPACT_PERCENT: '{{IMPACT_PERCENT}}',
  CTA_URL: '{{CTA_URL}}',
} as const;
