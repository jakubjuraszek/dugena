/**
 * Manual test script for queue system
 *
 * Usage:
 * 1. Add RESEND_API_KEY to .env.local
 * 2. Update EMAIL and URL below
 * 3. Run: npx tsx scripts/test-queue-manual.ts
 *
 * This bypasses the queue and processes immediately (useful for local testing)
 */

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

import { scrapePage } from "../lib/scraper";
import { analyzeQuick } from "../lib/ai-analyzer";
import { generatePDF } from "../lib/pdf-generator";
import { sendAuditEmail } from "../lib/email";

async function testQueue() {
  // ============================================================================
  // CONFIGURATION - UPDATE THESE
  // ============================================================================
  const EMAIL = "love2playu25@gmail.com"; // ← Change to your email
  const URL = "https://linear.app"; // ← Any landing page
  const TIER: "quick" | "professional" = "quick"; // ← quick or professional
  // ============================================================================

  console.log("🧪 Manual Queue Test");
  console.log("━".repeat(60));
  console.log(`📧 Email: ${EMAIL}`);
  console.log(`🔗 URL: ${URL}`);
  console.log(`📦 Tier: ${TIER}`);
  console.log("━".repeat(60));

  try {
    // 1. Scrape
    console.log("\n1️⃣ Scraping page...");
    const scraped = await scrapePage(URL);
    console.log(`   ✓ Scraped ${scraped.content.length} chars`);
    console.log(`   ✓ Title: ${scraped.title}`);
    console.log(
      `   ✓ H1s: ${scraped.headings.h1.length}, H2s: ${scraped.headings.h2.length}`
    );

    // 2. Analyze
    console.log("\n2️⃣ Analyzing with AI...");
    const result =
      TIER === "quick"
        ? await analyzeQuick(scraped)
        : await analyzeQuick(scraped); // Replace with analyzeProfessional for professional
    console.log(`   ✓ Score: ${result.overallScore}/100`);
    console.log(`   ✓ Issues: ${result.problems.length}`);
    console.log(`   ✓ Quick wins: ${result.quickWins.length}`);

    // 3. Generate PDF
    console.log("\n3️⃣ Generating PDF...");
    const pdf = await generatePDF(URL, result, TIER, "en");
    console.log(`   ✓ PDF size: ${(pdf.length / 1024).toFixed(1)} KB`);

    // 4. Send email
    console.log("\n4️⃣ Sending email...");
    await sendAuditEmail({
      to: EMAIL,
      tier: TIER,
      pdfBuffer: pdf,
      url: URL,
    });
    console.log(`   ✓ Email sent to ${EMAIL}`);

    console.log("\n━".repeat(60));
    console.log("✅ Test completed successfully!");
    console.log("━".repeat(60));
    console.log("\nNext steps:");
    console.log("1. Check your email (including spam folder)");
    console.log("2. Verify PDF attachment opens correctly");
    console.log("3. Review audit content for quality");
    console.log("\n🎉 All done!");
  } catch (error: any) {
    console.error("\n━".repeat(60));
    console.error("❌ Test failed!");
    console.error("━".repeat(60));
    console.error(`Error: ${error.message}`);
    console.error("\nCommon issues:");
    console.error("- Missing RESEND_API_KEY in .env.local");
    console.error("- Missing OPENAI_API_KEY in .env.local");
    console.error("- Invalid email address");
    console.error("- Network timeout (increase timeout or use different URL)");
    console.error("\nFull error:");
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testQueue();
