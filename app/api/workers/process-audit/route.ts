/**
 * Worker endpoint for async audit processing
 *
 * Receives jobs from QStash queue and processes them:
 * 1. Scrape landing page
 * 2. Analyze with AI (quick or professional)
 * 3. Generate PDF report
 * 4. Send email with PDF attachment
 *
 * QStash automatically retries failed jobs (up to 3x)
 */

import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import type { AuditJob } from '@/lib/queue';
import { scrapePage } from '@/lib/scraper';
import { analyzeQuick, analyzeProfessional } from '@/lib/ai-analyzer';
import { generatePDF } from '@/lib/pdf-generator';
import { sendAuditEmail } from '@/lib/email';

async function handler(request: Request) {
  console.log('🔄 Worker triggered: processing audit');

  // Parse job from QStash
  const job: AuditJob = await request.json();

  console.log(`📋 Job ${job.id}: ${job.url} (${job.tier}) → ${job.email}`);

  try {
    // 1. Scrape landing page (10-30s)
    console.log(`1️⃣ Scraping: ${job.url}`);
    const scraped = await scrapePage(job.url);
    console.log(`   ✓ Scraped ${scraped.content.length} chars`);

    // 2. Analyze with AI (5-15s)
    console.log(`2️⃣ Analyzing (${job.tier})...`);
    const result =
      job.tier === 'quick'
        ? await analyzeQuick(scraped)
        : await analyzeProfessional(scraped);
    console.log(`   ✓ Found ${result.problems.length} issues, ${result.quickWins.length} quick wins`);

    // 3. Generate PDF (2-5s)
    console.log(`3️⃣ Generating PDF...`);
    // Note: generatePDF expects (url, result, tier, locale)
    const pdfBuffer = await generatePDF(
      job.url,
      result,
      job.tier,
      job.locale || 'en' // Use job locale or default to English
    );
    console.log(`   ✓ PDF generated (${pdfBuffer.length} bytes)`);

    // 4. Send email (1-2s)
    console.log(`4️⃣ Sending email to ${job.email}...`);
    await sendAuditEmail({
      to: job.email,
      tier: job.tier,
      pdfBuffer,
      url: job.url,
    });
    console.log(`   ✓ Email sent successfully`);

    console.log(`✅ Job ${job.id} completed successfully`);

    return new Response('Success', { status: 200 });
  } catch (error: any) {
    console.error(`❌ Job ${job.id} failed:`, error);

    // Log detailed error for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      job,
    });

    // QStash will automatically retry (up to 3x)
    // After 3 failures, job goes to Dead Letter Queue
    return new Response(`Failed: ${error.message}`, { status: 500 });
  }
}

// Wrap with QStash signature verification for security
// This prevents unauthorized calls to the worker endpoint
export const POST = verifySignatureAppRouter(handler);

// Allow longer execution time for audit processing
// Vercel Hobby: 60s, Pro: 300s (5 min)
// Typical audit takes 20-60s depending on complexity
// Using 300s to handle occasional slow AI responses
export const maxDuration = 300;
