/**
 * EXAMPLE: How to use the new dark email template
 *
 * This file shows practical examples of sending audit emails
 * with the new premium dark template.
 */

import { sendAuditEmail } from '../email';

// ============================================================================
// EXAMPLE 1: Send email with new dark template (with stats)
// ============================================================================

async function example1_newTemplate() {
  const pdfBuffer = Buffer.from('...'); // Your PDF buffer

  await sendAuditEmail({
    to: 'customer@example.com',
    tier: 'professional',
    pdfBuffer,
    url: 'https://example.com',
    stats: {
      issueCount: 12,
      criticalCount: 3,
      quickWinsCount: 5,
      impactPercent: 42,
    },
  });

  // ✅ Sends: Dark-themed email with stats preview
  // ✅ Subject: "Your ConvertFix Audit is Ready 📊"
  // ✅ Includes: HTML + plain text fallback
}

// ============================================================================
// EXAMPLE 2: Send email with legacy template (backwards compatible)
// ============================================================================

async function example2_legacyTemplate() {
  const pdfBuffer = Buffer.from('...'); // Your PDF buffer

  await sendAuditEmail({
    to: 'customer@example.com',
    tier: 'quick',
    pdfBuffer,
    url: 'https://example.com',
    // No stats = legacy light template
  });

  // ✅ Sends: Original light-themed email
  // ✅ Subject: "Your Quick Audit is Ready! 🎉"
  // ✅ Backwards compatible with existing code
}

// ============================================================================
// EXAMPLE 3: Full workflow (scrape → analyze → PDF → email)
// ============================================================================

async function example3_fullWorkflow() {
  // This is how it works in the actual worker
  const { scrapePage } = await import('../scraper');
  const { analyzeQuick } = await import('../ai-analyzer');
  const { generatePDF } = await import('../pdf-generator');

  const url = 'https://example.com';
  const email = 'customer@example.com';

  // 1. Scrape the landing page
  const scraped = await scrapePage(url);

  // 2. Analyze with AI
  const analysis = await analyzeQuick(scraped);

  // 3. Generate PDF
  const pdfBuffer = await generatePDF(url, analysis, 'quick', 'en');

  // 4. Calculate stats from analysis
  const criticalIssues = analysis.problems.filter(
    (p) => p.priority === 'P0'
  );

  // 5. Send email with new template
  await sendAuditEmail({
    to: email,
    tier: 'quick',
    pdfBuffer,
    url,
    stats: {
      issueCount: analysis.problems.length,
      criticalCount: criticalIssues.length,
      quickWinsCount: analysis.quickWins.length,
      impactPercent: 35, // Could calculate based on severity weights
    },
  });

  console.log('✅ Audit email sent!');
}

// ============================================================================
// EXAMPLE 4: Dynamic impact calculation
// ============================================================================

interface Problem {
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: number;
}

interface AnalysisResult {
  problems: Problem[];
  quickWins: any[];
}

function calculateEstimatedImpact(result: AnalysisResult): number {
  // Weight by severity
  const weights = {
    critical: 15,
    high: 10,
    medium: 5,
    low: 2,
  };

  let totalImpact = 0;
  result.problems.forEach((problem) => {
    totalImpact += weights[problem.severity] || 0;
  });

  // Cap at 60% (realistic ceiling)
  return Math.min(totalImpact, 60);
}

async function example4_dynamicImpact() {
  const analysis = {
    problems: [
      { severity: 'critical' as const, impact: 0.15 },
      { severity: 'critical' as const, impact: 0.12 },
      { severity: 'high' as const, impact: 0.08 },
      { severity: 'medium' as const, impact: 0.05 },
      { severity: 'medium' as const, impact: 0.04 },
    ],
    quickWins: [{}, {}, {}],
  };

  const pdfBuffer = Buffer.from('...');

  await sendAuditEmail({
    to: 'customer@example.com',
    tier: 'professional',
    pdfBuffer,
    url: 'https://example.com',
    stats: {
      issueCount: analysis.problems.length,
      criticalCount: analysis.problems.filter((p) => p.severity === 'critical')
        .length,
      quickWinsCount: analysis.quickWins.length,
      impactPercent: calculateEstimatedImpact(analysis), // Dynamic calculation
    },
  });
}

// ============================================================================
// EXAMPLE 5: Testing email locally (Resend sandbox)
// ============================================================================

async function example5_testEmail() {
  // For testing, use Resend's onboarding@resend.dev (already configured)
  // It sends to your verified email only

  const testPDF = Buffer.from(
    'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKEhlbGxvIFdvcmxkKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxNTggMDAwMDAgbiAKMDAwMDAwMDIyNiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjMyMAolJUVPRgo='
  );

  await sendAuditEmail({
    to: 'your-verified-email@example.com', // ← Change this to your email
    tier: 'quick',
    pdfBuffer: testPDF,
    url: 'https://example.com',
    stats: {
      issueCount: 8,
      criticalCount: 2,
      quickWinsCount: 4,
      impactPercent: 28,
    },
  });

  console.log('✅ Test email sent! Check your inbox.');
}

// ============================================================================
// Run examples (uncomment to test)
// ============================================================================

// example1_newTemplate();
// example2_legacyTemplate();
// example3_fullWorkflow();
// example4_dynamicImpact();
// example5_testEmail();
