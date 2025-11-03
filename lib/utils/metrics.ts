/**
 * Audit Metrics Tracking
 *
 * PURPOSE:
 * - Track cost per audit (based on token usage and model pricing)
 * - Monitor performance (time, tokens, quality score)
 * - Provide visibility into audit efficiency
 * - Prepare for future analytics/DB storage
 */

export interface AuditMetrics {
  tier: 'quick' | 'professional';
  model: string;
  tokensUsed: number;
  timeMs: number;
  issuesCount: number;
  qualityScore: number; // overallScore from AI (0-100)
}

/**
 * OpenAI pricing as of January 2025
 * Source: https://openai.com/pricing
 */
const MODEL_PRICING = {
  'gpt-4o-mini': {
    input: 0.15 / 1_000_000, // $0.150 per 1M input tokens
    output: 0.6 / 1_000_000, // $0.600 per 1M output tokens
  },
  'gpt-4o': {
    input: 2.5 / 1_000_000, // $2.50 per 1M input tokens
    output: 10.0 / 1_000_000, // $10.00 per 1M output tokens
  },
} as const;

/**
 * Calculates approximate cost for an audit
 *
 * Note: We use a simplified calculation assuming 60/40 input/output split
 * For more accurate tracking, pass input/output tokens separately
 */
function calculateCost(model: string, totalTokens: number): number {
  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];

  if (!pricing) {
    console.warn(`⚠️ Unknown model pricing for: ${model}. Using gpt-4o-mini rates.`);
    return (
      totalTokens * 0.6 * MODEL_PRICING['gpt-4o-mini'].input +
      totalTokens * 0.4 * MODEL_PRICING['gpt-4o-mini'].output
    );
  }

  // Approximate: 60% input, 40% output
  const inputTokens = Math.floor(totalTokens * 0.6);
  const outputTokens = Math.floor(totalTokens * 0.4);

  return inputTokens * pricing.input + outputTokens * pricing.output;
}

/**
 * Tracks and logs audit metrics to console
 *
 * In the future, this can be extended to:
 * - Store metrics in database for analytics
 * - Send to monitoring service (DataDog, New Relic)
 * - Track aggregate metrics (avg cost, quality trends)
 * - Alert on anomalies (unusually high cost, low quality)
 */
export function trackAuditMetrics(metrics: AuditMetrics): void {
  const cost = calculateCost(metrics.model, metrics.tokensUsed);
  const timeSeconds = (metrics.timeMs / 1000).toFixed(1);

  // Estimate input/output split (60/40)
  const inputTokens = Math.floor(metrics.tokensUsed * 0.6);
  const outputTokens = Math.floor(metrics.tokensUsed * 0.4);

  console.log(`
📊 AUDIT METRICS:
   Tier: ${metrics.tier}
   Model: ${metrics.model}
   Time: ${timeSeconds}s
   Tokens: ${metrics.tokensUsed.toLocaleString()} (in: ${inputTokens.toLocaleString()} | out: ${outputTokens.toLocaleString()})
   Cost: $${cost.toFixed(4)}
   Issues: ${metrics.issuesCount}
   Quality: ${metrics.qualityScore}/100
  `);

  // Future: Store in database
  // await db.auditMetrics.create({
  //   data: {
  //     tier: metrics.tier,
  //     model: metrics.model,
  //     tokensUsed: metrics.tokensUsed,
  //     timeMs: metrics.timeMs,
  //     cost: cost,
  //     issuesCount: metrics.issuesCount,
  //     qualityScore: metrics.qualityScore,
  //     createdAt: new Date(),
  //   },
  // });

  // Future: Send to monitoring service
  // analytics.track('audit_completed', {
  //   tier: metrics.tier,
  //   model: metrics.model,
  //   cost: cost,
  //   quality: metrics.qualityScore,
  //   duration_ms: metrics.timeMs,
  // });
}

/**
 * Helper to format metrics for API responses
 * Useful when you want to return cost/performance data to frontend
 */
export function formatMetricsForAPI(metrics: AuditMetrics) {
  const cost = calculateCost(metrics.model, metrics.tokensUsed);

  return {
    tier: metrics.tier,
    model: metrics.model,
    performance: {
      timeSeconds: (metrics.timeMs / 1000).toFixed(1),
      tokensUsed: metrics.tokensUsed,
      cost: `$${cost.toFixed(4)}`,
    },
    quality: {
      score: metrics.qualityScore,
      issuesFound: metrics.issuesCount,
    },
  };
}
