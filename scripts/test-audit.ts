/**
 * Test Script dla ConvertFix Audit Pipeline
 *
 * Testuje:
 * 1. Scraper (Jina AI)
 * 2. Quick Analysis (GPT-4o mini)
 * 3. Professional Analysis (GPT-4o)
 *
 * Uruchom: npx tsx scripts/test-audit.ts
 */

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { scrapePage, debugScrapedData } from '../lib/scraper';
import { analyzeQuick, analyzeProfessional } from '../lib/ai-analyzer';

const TEST_URLS = [
  'https://linear.app',
  'https://vercel.com',
];

async function testAudit() {
  console.log('🧪 CONVERTFIX AUDIT PIPELINE TEST\n');
  console.log('═'.repeat(60));

  for (const url of TEST_URLS) {
    console.log(`\n\n📍 Testing: ${url}`);
    console.log('─'.repeat(60));

    try {
      // =====================================================================
      // STEP 1: Test Scraper
      // =====================================================================
      console.log('\n[1/3] 📄 Scraping with Jina AI...\n');
      const scraped = await scrapePage(url);

      // Debug output
      console.log('✅ Scraping successful!\n');
      debugScrapedData(scraped);

      // Validate scraped data
      if (!scraped.title || scraped.title.length === 0) {
        console.warn('⚠️  Warning: Empty title');
      }
      if (scraped.content.length < 500) {
        console.warn('⚠️  Warning: Content seems short (<500 chars)');
      }
      if (scraped.headings.h1.length === 0 && scraped.headings.h2.length === 0) {
        console.warn('⚠️  Warning: No headings found');
      }

      // =====================================================================
      // STEP 2: Test Quick Analysis
      // =====================================================================
      console.log('\n[2/3] 🤖 Running Quick Analysis (GPT-4o mini)...\n');
      const quick = await analyzeQuick(scraped);

      console.log('✅ Quick Analysis complete!\n');
      console.log('📊 RESULTS:');
      console.log(`   Overall Score: ${quick.overallScore}/100`);
      console.log(`   Problems found: ${quick.problems.length}`);
      console.log(`   Quick wins: ${quick.quickWins.length}`);

      console.log('\n🔴 Top 3 Critical Issues (P0):\n');
      quick.problems
        .filter(p => p.priority === 'P0')
        .slice(0, 3)
        .forEach((p, index) => {
          console.log(`${index + 1}. [${p.priority}] ${p.category.toUpperCase()}`);
          console.log(`   Issue: ${p.issue}`);
          console.log(`   Impact: ${p.impact}`);
          console.log(`   Fix: ${p.fix}`);
          if (p.beforeExample) {
            console.log(`   Before: "${p.beforeExample}"`);
          }
          if (p.afterExample) {
            console.log(`   After: "${p.afterExample}"`);
          }
          console.log('');
        });

      console.log('⚡ Quick Wins:\n');
      quick.quickWins.forEach((win, index) => {
        console.log(
          `${index + 1}. [${win.effort}] [${win.impact.toUpperCase()} impact] ${win.change}`
        );
      });

      // =====================================================================
      // STEP 3: Test Professional Analysis
      // =====================================================================
      console.log('\n[3/3] 🤖 Running Professional Analysis (GPT-4o)...\n');
      const pro = await analyzeProfessional(scraped);

      console.log('✅ Professional Analysis complete!\n');
      console.log('📊 RESULTS:');
      console.log(`   Overall Score: ${pro.overallScore}/100`);
      console.log(`   Problems found: ${pro.problems.length}`);
      console.log(`   Quick wins: ${pro.quickWins.length}`);

      // Breakdown by priority
      const p0Count = pro.problems.filter(p => p.priority === 'P0').length;
      const p1Count = pro.problems.filter(p => p.priority === 'P1').length;
      console.log(`   → P0 (Critical): ${p0Count}`);
      console.log(`   → P1 (Important): ${p1Count}`);

      // Breakdown by category
      console.log('\n📋 Issues by Category:');
      const categories = new Map<string, number>();
      pro.problems.forEach(p => {
        categories.set(p.category, (categories.get(p.category) || 0) + 1);
      });
      Array.from(categories.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
          console.log(`   ${cat.padEnd(15)} : ${count}`);
        });

      console.log('\n🔴 Sample P0 Issues:\n');
      pro.problems
        .filter(p => p.priority === 'P0')
        .slice(0, 2)
        .forEach((p, index) => {
          console.log(`${index + 1}. [${p.id}] ${p.issue}`);
          console.log(`   Fix: ${p.fix}`);
          console.log('');
        });

      console.log('🟡 Sample P1 Issues:\n');
      pro.problems
        .filter(p => p.priority === 'P1')
        .slice(0, 2)
        .forEach((p, index) => {
          console.log(`${index + 1}. [${p.id}] ${p.issue}`);
          console.log(`   Fix: ${p.fix}`);
          console.log('');
        });

      console.log('\n✅ SUCCESS - All tests passed for', url);
      console.log('═'.repeat(60));

    } catch (error: any) {
      console.error('\n❌ TEST FAILED for', url);
      console.error('Error:', error.message);
      console.error('\nStack:', error.stack);
      console.log('═'.repeat(60));

      // Don't exit - continue with next URL
      continue;
    }
  }

  console.log('\n\n🎉 ALL TESTS COMPLETE\n');
}

// ============================================================================
// RUN TEST
// ============================================================================

testAudit().catch(error => {
  console.error('\n💥 FATAL ERROR:');
  console.error(error);
  process.exit(1);
});
