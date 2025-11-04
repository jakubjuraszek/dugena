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
  tier: 'quick' | 'professional' | 'premium',
  locale: string = 'en'
): Promise<Buffer> {
  console.log(`📄 Generating ${tier} PDF report for ${url} in ${locale}...`);

  const html = generateHTML(url, auditResult, tier, locale);

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
        executablePath: await chromium.default.executablePath(),
        headless: true,
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
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateHTML(
  url: string,
  result: AuditResult,
  tier: string,
  locale: string = 'en'
): string {
  // Map locale to date format
  const localeMap: Record<string, string> = {
    'pl': 'pl-PL',
    'en': 'en-US',
  };
  const dateLocale = localeMap[locale] || 'en-US';

  const date = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Translations
  const translations: Record<string, Record<string, string>> = {
    en: {
      auditReport: 'Landing Page Audit Report',
      conversionScore: 'Conversion Score',
      tier: 'TIER',
      generatedOn: 'Generated on',
      executiveSummary: 'Executive Summary',
      overview: 'Overview',
      criticalIssues: 'Critical Issues (P0)',
      importantIssues: 'Important Issues (P1)',
      quickWins: 'Quick Wins',
      top3Critical: 'Top 3 Critical Issues',
      critical: 'CRITICAL',
      important: 'IMPORTANT',
      fix: 'Fix',
      before: 'Before',
      after: 'After',
      quickWinsTitle: 'Quick Wins — Implement Today',
      impact: 'impact',
      allCriticalIssues: 'All Critical Issues',
      criticalIssuesDetailed: 'Critical Issues (P0) - Detailed Analysis',
      importantIssuesDetailed: 'Important Issues (P1) - Detailed Analysis',
      importantIssuesTitle: 'Important Issues',
      footer: 'Professional Landing Page Audits',
    },
    pl: {
      auditReport: 'Raport Audytu Landing Page',
      conversionScore: 'Wynik Konwersji',
      tier: 'PAKIET',
      generatedOn: 'Wygenerowano',
      executiveSummary: 'Podsumowanie Wykonawcze',
      overview: 'Przegląd',
      criticalIssues: 'Problemy Krytyczne (P0)',
      importantIssues: 'Ważne Problemy (P1)',
      quickWins: 'Szybkie Wygrane',
      top3Critical: 'Top 3 Problemy Krytyczne',
      critical: 'KRYTYCZNY',
      important: 'WAŻNY',
      fix: 'Rozwiązanie',
      before: 'Przed',
      after: 'Po',
      quickWinsTitle: 'Szybkie Wygrane — Wdróż Dzisiaj',
      impact: 'wpływ',
      allCriticalIssues: 'Wszystkie Problemy Krytyczne',
      criticalIssuesDetailed: 'Problemy Krytyczne (P0) - Szczegółowa Analiza',
      importantIssuesDetailed: 'Ważne Problemy (P1) - Szczegółowa Analiza',
      importantIssuesTitle: 'Ważne Problemy',
      footer: 'Profesjonalne Audyty Landing Page',
    },
  };

  const t = translations[locale] || translations.en;

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
    /* Import Space Grotesk font */
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #0a0a0a;
      line-height: 1.6;
      background: #fafafa;
    }

    .page {
      page-break-after: always;
      position: relative;
    }

    .page:last-child {
      page-break-after: auto;
    }

    /* Cover Page - Premium Feel */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;
      background: #0a0a0a;
      color: white;
      padding: 60px 40px;
      position: relative;
      overflow: hidden;
    }

    /* Subtle texture overlay for premium feel */
    .cover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        linear-gradient(135deg, rgba(213, 90, 10, 0.03) 0%, transparent 50%),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px);
      pointer-events: none;
    }

    /* Geometric accent - sharp lines */
    .cover::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, rgba(213, 90, 10, 0.08) 0%, transparent 70%);
      clip-path: polygon(100% 0, 100% 100%, 0 0);
      pointer-events: none;
    }

    .cover-logo {
      font-size: 56px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #d55a0a;
      letter-spacing: -1px;
      position: relative;
      z-index: 1;
    }

    .cover-title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }

    .cover-url {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 80px;
      word-break: break-all;
      max-width: 600px;
      position: relative;
      z-index: 1;
      padding: 12px 24px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .cover-score {
      margin-bottom: 60px;
      position: relative;
      z-index: 1;
    }

    .score-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 4px;
      font-weight: 600;
    }

    .score-value {
      font-size: 140px;
      font-weight: 700;
      color: ${scoreColor};
      text-shadow: 0 0 40px ${scoreColor}40;
      line-height: 1;
      letter-spacing: -4px;
    }

    .score-total {
      font-size: 36px;
      color: #4b5563;
      font-weight: 600;
    }

    .cover-tier {
      display: inline-block;
      padding: 14px 40px;
      background: #d55a0a;
      color: white;
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 60px;
      letter-spacing: 2px;
      position: relative;
      z-index: 1;
      box-shadow: 0 4px 24px rgba(213, 90, 10, 0.25);
    }

    .cover-date {
      font-size: 13px;
      color: #4b5563;
      position: relative;
      z-index: 1;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Fixed Header - All Pages */
    .page-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #0a0a0a;
      color: white;
      padding: 16px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #d55a0a;
      z-index: 100;
    }

    .page-header-logo {
      font-size: 20px;
      font-weight: 700;
      color: #d55a0a;
      letter-spacing: -0.5px;
    }

    .page-header-title {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
    }

    /* Content with header offset */
    .content-wrapper {
      padding-top: 80px;
    }

    /* Section Headers - Premium Typography */
    .section {
      margin-bottom: 48px;
      padding: 0 40px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 32px;
      color: #0a0a0a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding-bottom: 16px;
      border-bottom: 2px solid #d55a0a;
    }

    h2 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 24px;
      margin-top: 48px;
      color: #0a0a0a;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      display: block;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #1a1a1a;
    }

    p {
      font-size: 14px;
      color: #4b5563;
      margin-bottom: 12px;
    }

    /* Priority Badges - Bolder */
    .priority-p0 {
      color: #ef4444;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .priority-p1 {
      color: #f59e0b;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Issue Card - Premium Treatment */
    .issue {
      background: white;
      border: 2px solid #e5e7eb;
      padding: 28px;
      margin-bottom: 28px;
      page-break-inside: avoid;
      position: relative;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    /* Orange accent bar for P0 issues */
    .issue-p0 {
      border-left: 4px solid #d55a0a;
    }

    .issue-p1 {
      border-left: 4px solid #9ca3af;
    }

    .issue-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .issue-id {
      font-size: 11px;
      color: #6b7280;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .issue-category {
      display: inline-block;
      padding: 6px 14px;
      background: #f3f4f6;
      color: #1a1a1a;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .issue-title {
      font-size: 20px;
      font-weight: 700;
      color: #0a0a0a;
      margin-bottom: 16px;
      line-height: 1.3;
    }

    /* Impact - Make it BOLD */
    .issue-impact {
      background: #fff7ed;
      border-left: 4px solid #d55a0a;
      padding: 16px 20px;
      margin-bottom: 20px;
      font-size: 15px;
      color: #7c2d12;
      font-weight: 600;
      line-height: 1.5;
    }

    /* Make percentages HUGE */
    .issue-impact strong {
      font-size: 20px;
      font-weight: 700;
      color: #d55a0a;
    }

    .issue-fix {
      font-size: 15px;
      color: #1a1a1a;
      margin-bottom: 24px;
      font-weight: 500;
      line-height: 1.6;
    }

    .issue-fix strong {
      color: #d55a0a;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 12px;
    }

    /* Before/After - PROMINENT */
    .examples {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 24px;
    }

    .example {
      padding: 20px;
      page-break-inside: avoid;
      border: 2px solid;
    }

    .example-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .example-text {
      font-size: 13px;
      font-family: 'Monaco', 'Consolas', monospace;
      line-height: 1.7;
    }

    /* CURRENT (red accent) */
    .example-before {
      background: #fef2f2;
      border-color: #ef4444;
    }

    .example-before .example-label {
      color: #991b1b;
    }

    .example-before .example-label::before {
      content: 'CURRENT';
      background: #ef4444;
      color: white;
      padding: 4px 10px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .example-before .example-text {
      color: #7f1d1d;
    }

    /* RECOMMENDED (green accent) */
    .example-after {
      background: #f0fdf4;
      border-color: #10b981;
    }

    .example-after .example-label {
      color: #065f46;
    }

    .example-after .example-label::before {
      content: 'RECOMMENDED';
      background: #10b981;
      color: white;
      padding: 4px 10px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .example-after .example-text {
      color: #064e3b;
      font-weight: 600;
    }

    /* Quick Wins - Numbered Circles */
    .quick-wins-section {
      margin-top: 48px;
    }

    .quick-win {
      background: white;
      border: 2px solid #fbbf24;
      border-left: 4px solid #fbbf24;
      padding: 20px 20px 20px 70px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      position: relative;
      box-shadow: 0 2px 8px rgba(251, 191, 36, 0.1);
    }

    .quick-win::before {
      content: attr(data-number);
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: #fbbf24;
      color: #78350f;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
    }

    .quick-win-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0;
    }

    .quick-win-title {
      font-size: 15px;
      font-weight: 600;
      color: #0a0a0a;
      line-height: 1.5;
      flex: 1;
    }

    .quick-win-badges {
      display: flex;
      gap: 8px;
      margin-left: 16px;
      flex-shrink: 0;
    }

    .badge {
      padding: 6px 12px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .badge-effort {
      background: #dbeafe;
      color: #1e3a8a;
    }

    .badge-impact-high {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-impact-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-impact-low {
      background: #f3f4f6;
      color: #374151;
    }

    /* Summary Stats - Data Prominence */
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat {
      background: white;
      border: 2px solid #e5e7eb;
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .stat-value {
      font-size: 64px;
      font-weight: 700;
      margin-bottom: 12px;
      line-height: 1;
      letter-spacing: -2px;
    }

    .stat-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 700;
    }

    /* Fixed Footer - Branded */
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
    }

    .page-footer-brand {
      font-weight: 700;
      color: #d55a0a;
    }

    .page-footer-number {
      font-weight: 600;
      color: #9ca3af;
    }

    .footer {
      margin-top: 60px;
      padding: 20px 40px;
      text-align: center;
      color: #6b7280;
      font-size: 11px;
      border-top: 1px solid #e5e7eb;
    }

    .footer strong {
      color: #d55a0a;
      font-weight: 700;
    }

    /* Scannability - Section Dividers */
    .section-divider {
      height: 1px;
      background: linear-gradient(90deg, #d55a0a 0%, transparent 100%);
      margin: 40px 0;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page cover">
    <div class="cover-logo">ConvertFix</div>
    <div class="cover-title">${t.auditReport}</div>
    <div class="cover-url">${url}</div>

    <div class="cover-score">
      <div class="score-label">${t.conversionScore}</div>
      <div>
        <span class="score-value">${result.overallScore}</span>
        <span class="score-total">/100</span>
      </div>
    </div>

    <div class="cover-tier">${tier.toUpperCase()} ${t.tier}</div>

    <div class="cover-date">${t.generatedOn} ${date}</div>
  </div>

  <!-- Executive Summary -->
  <div class="page">
    <div class="content-wrapper">
      <div class="section">
        <h1>${t.overview}</h1>

        <div class="summary-stats">
          <div class="stat">
            <div class="stat-value" style="color: #ef4444;">${p0Issues.length}</div>
            <div class="stat-label">${t.criticalIssues}</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #f59e0b;">${p1Issues.length}</div>
            <div class="stat-label">${t.importantIssues}</div>
          </div>
          <div class="stat">
            <div class="stat-value" style="color: #10b981;">${result.quickWins.length}</div>
            <div class="stat-label">${t.quickWins}</div>
          </div>
        </div>

        <h2>${t.top3Critical}</h2>
        ${p0Issues
          .slice(0, 3)
          .map(
            (issue) => `
          <div class="issue issue-p0">
            <div class="issue-header">
              <span class="issue-id">${issue.id.toUpperCase()}</span>
              <span class="priority-p0">${t.critical}</span>
              <span class="issue-category">${issue.category}</span>
            </div>
            <div class="issue-title">${issue.issue}</div>
            <div class="issue-impact">${issue.impact}</div>
            <div class="issue-fix"><strong>${t.fix}:</strong> ${issue.fix}</div>

            <div class="examples">
              <div class="example example-before">
                <div class="example-label">${t.before}</div>
                <div class="example-text">${issue.beforeExample}</div>
              </div>
              <div class="example example-after">
                <div class="example-label">${t.after}</div>
                <div class="example-text">${issue.afterExample}</div>
              </div>
            </div>
          </div>
        `
          )
          .join('')}

        <div class="section-divider"></div>

        <h2>${t.quickWinsTitle}</h2>
        <div class="quick-wins-section">
          ${result.quickWins
            .map(
              (win, index) => `
            <div class="quick-win" data-number="${index + 1}">
              <div class="quick-win-header">
                <div class="quick-win-title">${win.change}</div>
                <div class="quick-win-badges">
                  <span class="badge badge-effort">${win.effort}</span>
                  <span class="badge badge-impact-${win.impact}">${win.impact.toUpperCase()} ${t.impact}</span>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="footer">
        <strong>ConvertFix</strong> • ${t.footer} • ${date}
      </div>
    </div>
  </div>

  <!-- Detailed P0 Issues -->
  ${
    p0Issues.length > 3
      ? `
  <div class="page">
    <div class="content-wrapper">
      <div class="section">
        <h1>${t.allCriticalIssues}</h1>
        ${p0Issues
          .slice(3)
          .map(
            (issue) => `
          <div class="issue issue-p0">
            <div class="issue-header">
              <span class="issue-id">${issue.id.toUpperCase()}</span>
              <span class="priority-p0">${t.critical}</span>
              <span class="issue-category">${issue.category}</span>
            </div>
            <div class="issue-title">${issue.issue}</div>
            <div class="issue-impact">${issue.impact}</div>
            <div class="issue-fix"><strong>${t.fix}:</strong> ${issue.fix}</div>

            <div class="examples">
              <div class="example example-before">
                <div class="example-label">${t.before}</div>
                <div class="example-text">${issue.beforeExample}</div>
              </div>
              <div class="example example-after">
                <div class="example-label">${t.after}</div>
                <div class="example-text">${issue.afterExample}</div>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="footer">
        <strong>ConvertFix</strong> • ${t.footer} • ${date}
      </div>
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
    <div class="content-wrapper">
      <div class="section">
        <h1>${t.importantIssuesTitle}</h1>
        ${p1Issues
          .map(
            (issue) => `
          <div class="issue issue-p1">
            <div class="issue-header">
              <span class="issue-id">${issue.id.toUpperCase()}</span>
              <span class="priority-p1">${t.important}</span>
              <span class="issue-category">${issue.category}</span>
            </div>
            <div class="issue-title">${issue.issue}</div>
            <div class="issue-impact">${issue.impact}</div>
            <div class="issue-fix"><strong>${t.fix}:</strong> ${issue.fix}</div>

            <div class="examples">
              <div class="example example-before">
                <div class="example-label">${t.before}</div>
                <div class="example-text">${issue.beforeExample}</div>
              </div>
              <div class="example example-after">
                <div class="example-label">${t.after}</div>
                <div class="example-text">${issue.afterExample}</div>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="footer">
        <strong>ConvertFix</strong> • ${t.footer} • ${date}
      </div>
    </div>
  </div>
  `
      : ''
  }
</body>
</html>
  `.trim();
}
