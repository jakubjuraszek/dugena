/**
 * Test Script for PDF Generation
 *
 * Tests the complete pipeline:
 * 1. Scrape landing page
 * 2. Run professional analysis
 * 3. Generate PDF report
 * 4. Save to test-report.pdf
 *
 * Usage: npx tsx scripts/test-pdf.ts
 */

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { scrapePage } from '../lib/scraper';
import { analyzeProfessional } from '../lib/ai-analyzer';
import { generatePDF } from '../lib/pdf-generator';

const TEST_URL = 'https://linear.app';

async function testPDFGeneration() {
  console.log('📄 CONVERTFIX PDF GENERATION TEST\n');
  console.log('═'.repeat(60));
  console.log(`\nTesting URL: ${TEST_URL}\n`);

  try {
    // =========================================================================
    // STEP 1: Scrape Landing Page
    // =========================================================================
    console.log('[1/3] 📄 Scraping landing page...\n');
    const startScrape = Date.now();
    const scraped = await scrapePage(TEST_URL);
    const scrapeDuration = ((Date.now() - startScrape) / 1000).toFixed(1);

    console.log(`✅ Scraping complete in ${scrapeDuration}s`);
    console.log(`   Title: ${scraped.title}`);
    console.log(`   Content length: ${scraped.content.length} chars\n`);

    // =========================================================================
    // STEP 2: Run Professional Analysis
    // =========================================================================
    console.log('[2/3] 🤖 Running professional analysis...\n');
    const startAnalysis = Date.now();
    const auditResult = await analyzeProfessional(scraped);
    const analysisDuration = ((Date.now() - startAnalysis) / 1000).toFixed(1);

    console.log(`✅ Analysis complete in ${analysisDuration}s`);
    console.log(`   Overall Score: ${auditResult.overallScore}/100`);
    console.log(`   P0 Issues: ${auditResult.problems.filter(p => p.priority === 'P0').length}`);
    console.log(`   P1 Issues: ${auditResult.problems.filter(p => p.priority === 'P1').length}`);
    console.log(`   Quick Wins: ${auditResult.quickWins.length}\n`);

    // =========================================================================
    // STEP 3: Generate PDF
    // =========================================================================
    console.log('[3/3] 📑 Generating PDF report...\n');
    const startPDF = Date.now();
    const pdfBuffer = await generatePDF(TEST_URL, auditResult, 'professional');
    const pdfDuration = ((Date.now() - startPDF) / 1000).toFixed(1);

    console.log(`✅ PDF generated in ${pdfDuration}s`);
    console.log(`   Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB\n`);

    // =========================================================================
    // STEP 4: Save PDF to File
    // =========================================================================
    const outputPath = path.resolve(process.cwd(), 'test-report-new.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('═'.repeat(60));
    console.log('\n✅ SUCCESS! PDF saved to:\n');
    console.log(`   ${outputPath}\n`);
    console.log('═'.repeat(60));

    // Summary
    const totalDuration = ((Date.now() - startScrape) / 1000).toFixed(1);
    console.log('\n📊 TIMING SUMMARY:');
    console.log(`   Scraping:  ${scrapeDuration}s`);
    console.log(`   Analysis:  ${analysisDuration}s`);
    console.log(`   PDF Gen:   ${pdfDuration}s`);
    console.log(`   Total:     ${totalDuration}s\n`);

  } catch (error: any) {
    console.error('\n❌ TEST FAILED');
    console.error('Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

// ============================================================================
// RUN TEST
// ============================================================================

testPDFGeneration().catch((error) => {
  console.error('\n💥 FATAL ERROR:');
  console.error(error);
  process.exit(1);
});
