/**
 * PDF Generator for ConvertFix Audit Reports
 *
 * Generates professional-looking PDF reports worth $49
 * Uses puppeteer for HTML to PDF conversion
 */

import type { AuditResult } from './ai-analyzer';

export async function generatePDF(
  url: string,
  auditResult: AuditResult,
  tier: 'quick' | 'professional' | 'premium'
): Promise<Buffer> {
  console.log(`📄 Generating ${tier} PDF report for ${url}...`);

  const html = generateHTML(url, auditResult, tier);

  let browser;
  try {
    // Dynamically import puppeteer based on environment
    // In production (Vercel), use puppeteer-core with @sparticuz/chromium
    // In development, use full puppeteer with bundled Chromium
    const isProduction = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (isProduction) {
      const puppeteerCore = await import('puppeteer-core');
      const chromium = await import('@sparticuz/chromium');

      browser = await puppeteerCore.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless,
      });
    } else {
      // Local development: use full puppeteer
      const puppeteer = await import('puppeteer');

      browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    console.log(`✅ PDF generated successfully (${pdfBuffer.length} bytes)`);
    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateHTML(
  url: string,
  result: AuditResult,
  tier: string
): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const p0Issues = result.problems.filter((p) => p.priority === 'P0');
  const p1Issues = result.problems.filter((p) => p.priority === 'P1');

  const scoreColor =
    result.overallScore >= 76
      ? '#10b981'
      : result.overallScore >= 51
        ? '#f59e0b'
        : '#ef4444';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ConvertFix Audit Report - ${url}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1f2937;
      line-height: 1.6;
    }

    .page {
      page-break-after: always;
    }

    .page:last-child {
      page-break-after: auto;
    }

    /* Cover Page */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      padding: 40px;
    }

    .cover-logo {
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 20px;
      color: #FF6B2C;
    }

    .cover-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 40px;
    }

    .cover-url {
      font-size: 18px;
      color: #9ca3af;
      margin-bottom: 60px;
      word-break: break-all;
    }

    .cover-score {
      margin-bottom: 40px;
    }

    .score-label {
      font-size: 16px;
      color: #9ca3af;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .score-value {
      font-size: 120px;
      font-weight: 800;
      color: ${scoreColor};
    }

    .score-total {
      font-size: 32px;
      color: #6b7280;
    }

    .cover-tier {
      display: inline-block;
      padding: 12px 32px;
      background: #FF6B2C;
      color: white;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 40px;
    }

    .cover-date {
      font-size: 14px;
      color: #6b7280;
    }

    /* Header */
    .header {
      background: #1a1a1a;
      color: white;
      padding: 30px 40px;
      margin-bottom: 40px;
    }

    .header-logo {
      font-size: 28px;
      font-weight: 800;
      color: #FF6B2C;
      margin-bottom: 10px;
    }

    .header-subtitle {
      font-size: 14px;
      color: #9ca3af;
    }

    /* Section */
    .section {
      margin-bottom: 40px;
      padding: 0 40px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #1a1a1a;
    }

    h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #374151;
    }

    p {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 12px;
    }

    /* Priority Badges */
    .priority-p0 {
      color: #ef4444;
      font-weight: 700;
    }

    .priority-p1 {
      color: #f59e0b;
      font-weight: 700;
    }

    /* Issue Card */
    .issue {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
      page-break-inside: avoid;
    }

    .issue-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .issue-id {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
    }

    .issue-category {
      display: inline-block;
      padding: 4px 12px;
      background: #f3f4f6;
      color: #374151;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .issue-title {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 12px;
    }

    .issue-impact {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #92400e;
    }

    .issue-fix {
      font-size: 14px;
      color: #374151;
      margin-bottom: 16px;
      font-weight: 600;
    }

    /* Before/After Examples */
    .examples {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .example {
      border-radius: 6px;
      padding: 16px;
      page-break-inside: avoid;
    }

    .example-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .example-text {
      font-size: 13px;
      font-family: 'Monaco', 'Consolas', monospace;
      line-height: 1.6;
    }

    .example-before {
      background: #f9fafb;
      border: 2px solid #d1d5db;
    }

    .example-before .example-label {
      color: #6b7280;
    }

    .example-before .example-text {
      color: #374151;
    }

    .example-after {
      background: #d1fae5;
      border: 2px solid #10b981;
    }

    .example-after .example-label {
      color: #047857;
    }

    .example-after .example-text {
      color: #065f46;
      font-weight: 600;
    }

    /* Quick Wins */
    .quick-win {
      background: white;
      border: 2px solid #fbbf24;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .quick-win-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .quick-win-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .quick-win-badges {
      display: flex;
      gap: 8px;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-effort {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-impact-high {
      background: #dcfce7;
      color: #166534;
    }

    .badge-impact-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-impact-low {
      background: #f3f4f6;
      color: #374151;
    }

    /* Summary Stats */
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .stat-value {
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Footer */
    .footer {
      margin-top: 60px;
      padding: 20px 40px;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
      border-top: 2px solid #e5e7eb;
    }

    .footer strong {
      color: #FF6B2C;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page cover">
    <div class="cover-logo">ConvertFix</div>
    <div class="cover-title">Landing Page Audit Report</div>
    <div class="cover-url">${url}</div>

    <div class="cover-score">
      <div class="score-label">Conversion Score</div>
      <div>
        <span class="score-value">${result.overallScore}</span>
        <span class="score-total">/100</span>
      </div>
    </div>

    <div class="cover-tier">${tier.toUpperCase()} TIER</div>

    <div class="cover-date">Generated on ${date}</div>
  </div>

  <!-- Executive Summary -->
  <div class="page">
    <div class="header">
      <div class="header-logo">ConvertFix</div>
      <div class="header-subtitle">Executive Summary</div>
    </div>

    <div class="section">
      <h1>📊 Overview</h1>

      <div class="summary-stats">
        <div class="stat">
          <div class="stat-value" style="color: #ef4444;">${p0Issues.length}</div>
          <div class="stat-label">Critical Issues (P0)</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color: #f59e0b;">${p1Issues.length}</div>
          <div class="stat-label">Important Issues (P1)</div>
        </div>
        <div class="stat">
          <div class="stat-value" style="color: #10b981;">${result.quickWins.length}</div>
          <div class="stat-label">Quick Wins</div>
        </div>
      </div>

      <h2>🔴 Top 3 Critical Issues</h2>
      ${p0Issues
        .slice(0, 3)
        .map(
          (issue) => `
        <div class="issue">
          <div class="issue-header">
            <span class="issue-id">${issue.id.toUpperCase()}</span>
            <span class="priority-p0">● CRITICAL</span>
            <span class="issue-category">${issue.category}</span>
          </div>
          <div class="issue-title">${issue.issue}</div>
          <div class="issue-impact">${issue.impact}</div>
          <div class="issue-fix"><strong>Fix:</strong> ${issue.fix}</div>

          <div class="examples">
            <div class="example example-before">
              <div class="example-label">❌ Before</div>
              <div class="example-text">${issue.beforeExample}</div>
            </div>
            <div class="example example-after">
              <div class="example-label">✅ After</div>
              <div class="example-text">${issue.afterExample}</div>
            </div>
          </div>
        </div>
      `
        )
        .join('')}

      <h2>⚡ Quick Wins (Implement Today!)</h2>
      ${result.quickWins
        .map(
          (win) => `
        <div class="quick-win">
          <div class="quick-win-header">
            <div class="quick-win-title">${win.change}</div>
            <div class="quick-win-badges">
              <span class="badge badge-effort">⏱ ${win.effort}</span>
              <span class="badge badge-impact-${win.impact}">📈 ${win.impact.toUpperCase()} impact</span>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="footer">
      <strong>ConvertFix</strong> • Professional Landing Page Audits • Generated ${date}
    </div>
  </div>

  <!-- Detailed P0 Issues -->
  ${
    p0Issues.length > 3
      ? `
  <div class="page">
    <div class="header">
      <div class="header-logo">ConvertFix</div>
      <div class="header-subtitle">Critical Issues (P0) - Detailed Analysis</div>
    </div>

    <div class="section">
      <h1>🔴 All Critical Issues</h1>
      ${p0Issues
        .slice(3)
        .map(
          (issue) => `
        <div class="issue">
          <div class="issue-header">
            <span class="issue-id">${issue.id.toUpperCase()}</span>
            <span class="priority-p0">● CRITICAL</span>
            <span class="issue-category">${issue.category}</span>
          </div>
          <div class="issue-title">${issue.issue}</div>
          <div class="issue-impact">${issue.impact}</div>
          <div class="issue-fix"><strong>Fix:</strong> ${issue.fix}</div>

          <div class="examples">
            <div class="example example-before">
              <div class="example-label">❌ Before</div>
              <div class="example-text">${issue.beforeExample}</div>
            </div>
            <div class="example example-after">
              <div class="example-label">✅ After</div>
              <div class="example-text">${issue.afterExample}</div>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="footer">
      <strong>ConvertFix</strong> • Professional Landing Page Audits • Generated ${date}
    </div>
  </div>
  `
      : ''
  }

  <!-- P1 Issues (Professional/Premium only) -->
  ${
    p1Issues.length > 0
      ? `
  <div class="page">
    <div class="header">
      <div class="header-logo">ConvertFix</div>
      <div class="header-subtitle">Important Issues (P1) - Detailed Analysis</div>
    </div>

    <div class="section">
      <h1>🟡 Important Issues</h1>
      ${p1Issues
        .map(
          (issue) => `
        <div class="issue">
          <div class="issue-header">
            <span class="issue-id">${issue.id.toUpperCase()}</span>
            <span class="priority-p1">● IMPORTANT</span>
            <span class="issue-category">${issue.category}</span>
          </div>
          <div class="issue-title">${issue.issue}</div>
          <div class="issue-impact">${issue.impact}</div>
          <div class="issue-fix"><strong>Fix:</strong> ${issue.fix}</div>

          <div class="examples">
            <div class="example example-before">
              <div class="example-label">❌ Before</div>
              <div class="example-text">${issue.beforeExample}</div>
            </div>
            <div class="example example-after">
              <div class="example-label">✅ After</div>
              <div class="example-text">${issue.afterExample}</div>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="footer">
      <strong>ConvertFix</strong> • Professional Landing Page Audits • Generated ${date}
    </div>
  </div>
  `
      : ''
  }
</body>
</html>
  `.trim();
}
