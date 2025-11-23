/**
 * Email sender for ConvertFix
 *
 * Sends audit reports via Resend with PDF attachments.
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { AuditEmailData } from './email-templates/types';

// Lazy initialization to support dotenv in scripts
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface AuditEmail {
  to: string; // Customer email
  tier: 'quick' | 'professional'; // Audit tier
  pdfBuffer: Buffer; // PDF file as buffer
  url: string; // Audited URL (for email content)

  // Optional: Dynamic stats for new template
  // If not provided, will use legacy template
  stats?: {
    issueCount: number;
    criticalCount: number;
    quickWinsCount: number;
    impactPercent: number;
  };
}

/**
 * Load and populate email template with dynamic data
 */
function getEmailTemplate(data: AuditEmailData): { html: string; text: string } {
  const templatesDir = join(__dirname, 'email-templates');

  // Read templates
  const htmlTemplate = readFileSync(join(templatesDir, 'audit-ready.html'), 'utf-8');
  const textTemplate = readFileSync(join(templatesDir, 'audit-ready.txt'), 'utf-8');

  // Replace placeholders
  const replacements: Record<string, string> = {
    '{{URL}}': data.url,
    '{{ISSUE_COUNT}}': data.issueCount.toString(),
    '{{CRITICAL_COUNT}}': data.criticalCount.toString(),
    '{{QUICK_WINS_COUNT}}': data.quickWinsCount.toString(),
    '{{IMPACT_PERCENT}}': data.impactPercent.toString(),
    '{{CTA_URL}}': data.ctaUrl,
  };

  let html = htmlTemplate;
  let text = textTemplate;

  Object.entries(replacements).forEach(([placeholder, value]) => {
    html = html.replace(new RegExp(placeholder, 'g'), value);
    text = text.replace(new RegExp(placeholder, 'g'), value);
  });

  return { html, text };
}

/**
 * Send audit report via email with PDF attachment
 *
 * @param params - Email parameters
 * @throws Error if RESEND_API_KEY is missing or sending fails
 */
export async function sendAuditEmail(params: AuditEmail): Promise<void> {
  const { to, tier, pdfBuffer, url, stats } = params;

  const tierName = tier === 'quick' ? 'Quick' : 'Professional';

  try {
    const client = getResendClient();

    // Use new template if stats provided, otherwise use legacy template
    let html: string;
    let text: string | undefined;

    if (stats) {
      // New dark-themed template with dynamic stats
      const templateData: AuditEmailData = {
        url,
        issueCount: stats.issueCount,
        criticalCount: stats.criticalCount,
        quickWinsCount: stats.quickWinsCount,
        impactPercent: stats.impactPercent,
        ctaUrl: '#', // Can be customized to link to dashboard or PDF download page
      };

      const templates = getEmailTemplate(templateData);
      html = templates.html;
      text = templates.text;
    } else {
      // Legacy template (backwards compatibility)
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #d55a0a 0%, #b84a08 100%);
                color: white;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 30px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .url {
                background: white;
                padding: 10px 15px;
                border-radius: 4px;
                border-left: 4px solid #d55a0a;
                margin: 20px 0;
                font-family: monospace;
                font-size: 14px;
              }
              .features {
                list-style: none;
                padding: 0;
                margin: 20px 0;
              }
              .features li {
                padding: 10px 0;
                padding-left: 30px;
                position: relative;
              }
              .features li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #d55a0a;
                font-weight: bold;
                font-size: 18px;
              }
              .footer {
                text-align: center;
                color: #666;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
              .cta {
                background: #667eea;
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                display: inline-block;
                margin: 20px 0;
                font-weight: 500;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Your ConvertFix Audit is Complete!</h1>
            </div>

            <div class="content">
              <p>Great news! We've finished analyzing your landing page and found actionable improvements that can boost your conversion rate.</p>

              <div class="url">
                <strong>Analyzed page:</strong> ${url}
              </div>

              <p>Your <strong>${tierName} Audit</strong> is attached as a PDF. Here's what's inside:</p>

              <ul class="features">
                <li>Conversion blockers prioritized by impact</li>
                <li>Specific fixes with before/after examples</li>
                <li>Quick wins you can implement today</li>
                ${tier === 'professional' ? '<li>Deep-dive analysis with psychological insights</li>' : ''}
              </ul>

              <p>Open the PDF to see your personalized recommendations.</p>
            </div>

            <div class="footer">
              <p>Questions? Just reply to this email.</p>
              <p>Good luck shipping! 🚀</p>
              <p><strong>- ConvertFix</strong></p>
            </div>
          </body>
        </html>
      `;
    }

    const result = await client.emails.send({
      from: 'ConvertFix <onboarding@resend.dev>', // Change if custom domain
      to,
      subject: stats ? 'Your ConvertFix Audit is Ready 📊' : `Your ${tierName} Audit is Ready! 🎉`,
      html,
      text, // Plain text fallback (only for new template)
      attachments: [
        {
          filename: `convertfix-audit-${tier}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log(`✅ Email sent: ${to} (${tier})`);
    console.log(`   Email ID: ${result.data?.id || 'unknown'}`);

    // Check for errors in response
    if (result.error) {
      console.error('⚠️ Resend returned an error:', result.error);
      throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
    }
  } catch (error: any) {
    console.error('❌ Failed to send email:', error);
    throw new Error(`Email sending error: ${error.message}`);
  }
}
