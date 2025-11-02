/**
 * Pełny szczegółowy raport dla jednej strony
 *
 * Pokazuje WSZYSTKIE issues ze szczegółami
 */

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { scrapePage } from '../lib/scraper';
import { analyzeProfessional, type AuditResult } from '../lib/ai-analyzer';

const TEST_URL = process.argv[2] || 'https://linear.app';

async function generateFullReport() {
  console.log('📊 CONVERTFIX - PEŁNY RAPORT AUDYTU\n');
  console.log('═'.repeat(70));
  console.log(`🔍 Audytowana strona: ${TEST_URL}`);
  console.log('═'.repeat(70));

  try {
    // Step 1: Scraping
    console.log('\n[1/2] 📄 Scraping...\n');
    const scraped = await scrapePage(TEST_URL);

    console.log('✅ Scraped Data:');
    console.log(`   URL: ${scraped.url}`);
    console.log(`   Title: ${scraped.title}`);
    console.log(`   Meta: ${scraped.metaDescription.substring(0, 100)}...`);
    console.log(`   Content: ${scraped.content.length} chars`);
    console.log(`   H1 headings: ${scraped.headings.h1.length}`);
    console.log(`   H2 headings: ${scraped.headings.h2.length}`);

    // Step 2: Professional Analysis
    console.log('\n[2/2] 🤖 Running Professional Analysis...\n');
    const result = await analyzeProfessional(scraped);

    // Display full report
    printFullReport(result);

  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

function printFullReport(result: AuditResult) {
  console.log('\n');
  console.log('═'.repeat(70));
  console.log('📊 PROFESSIONAL AUDIT REPORT');
  console.log('═'.repeat(70));

  console.log(`\n🎯 Overall Conversion Score: ${result.overallScore}/100`);
  console.log(`📋 Total Issues Found: ${result.problems.length}`);

  const p0Count = result.problems.filter(p => p.priority === 'P0').length;
  const p1Count = result.problems.filter(p => p.priority === 'P1').length;
  console.log(`   → P0 (Critical Blockers): ${p0Count}`);
  console.log(`   → P1 (Important): ${p1Count}`);

  // Category breakdown
  console.log('\n📂 Issues by Category:');
  const categories = new Map<string, number>();
  result.problems.forEach(p => {
    categories.set(p.category, (categories.get(p.category) || 0) + 1);
  });
  Array.from(categories.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(20)} : ${count}`);
    });

  // P0 Issues (Critical)
  console.log('\n\n');
  console.log('━'.repeat(70));
  console.log('🔴 P0 ISSUES (CRITICAL - Fix These First!)');
  console.log('━'.repeat(70));

  const p0Issues = result.problems.filter(p => p.priority === 'P0');
  p0Issues.forEach((issue, index) => {
    console.log(`\n[${issue.id.toUpperCase()}] ${issue.category.toUpperCase()}`);
    console.log('─'.repeat(70));
    console.log(`\n❌ Issue:\n   ${issue.issue}`);
    console.log(`\n💥 Impact:\n   ${issue.impact}`);
    console.log(`\n✅ Fix:\n   ${issue.fix}`);

    if (issue.beforeExample) {
      console.log(`\n📌 Before:\n   "${issue.beforeExample}"`);
    }

    if (issue.afterExample) {
      console.log(`\n✨ After:\n   "${issue.afterExample}"`);
    }

    if (index < p0Issues.length - 1) {
      console.log('\n' + '·'.repeat(70));
    }
  });

  // P1 Issues (Important)
  console.log('\n\n');
  console.log('━'.repeat(70));
  console.log('🟡 P1 ISSUES (IMPORTANT - Polish & Optimize)');
  console.log('━'.repeat(70));

  const p1Issues = result.problems.filter(p => p.priority === 'P1');
  p1Issues.forEach((issue, index) => {
    console.log(`\n[${issue.id.toUpperCase()}] ${issue.category.toUpperCase()}`);
    console.log('─'.repeat(70));
    console.log(`\n⚠️  Issue:\n   ${issue.issue}`);
    console.log(`\n💡 Impact:\n   ${issue.impact}`);
    console.log(`\n✅ Fix:\n   ${issue.fix}`);

    if (issue.beforeExample) {
      console.log(`\n📌 Before:\n   "${issue.beforeExample}"`);
    }

    if (issue.afterExample) {
      console.log(`\n✨ After:\n   "${issue.afterExample}"`);
    }

    if (index < p1Issues.length - 1) {
      console.log('\n' + '·'.repeat(70));
    }
  });

  // Quick Wins
  console.log('\n\n');
  console.log('━'.repeat(70));
  console.log('⚡ QUICK WINS (High Impact, Low Effort)');
  console.log('━'.repeat(70));

  result.quickWins.forEach((win, index) => {
    const impactIcon = win.impact === 'high' ? '🔥' : win.impact === 'medium' ? '🔶' : '🔸';
    const effortIcon = win.effort === '5 min' ? '⚡' : win.effort === '20 min' ? '⏱️' : '⏳';

    console.log(`\n${index + 1}. ${impactIcon} ${effortIcon} [${win.effort}] [${win.impact.toUpperCase()} impact]`);
    console.log(`   ${win.change}`);
  });

  console.log('\n\n');
  console.log('═'.repeat(70));
  console.log('✅ REPORT COMPLETE');
  console.log('═'.repeat(70));
  console.log(`\n💡 Recommended Action Plan:`);
  console.log(`   1. Fix all ${p0Count} P0 issues first (critical blockers)`);
  console.log(`   2. Implement ${result.quickWins.length} quick wins for immediate impact`);
  console.log(`   3. Address ${p1Count} P1 issues for polish and optimization`);
  console.log(`\n🎯 Expected Conversion Lift: +${Math.round((100 - result.overallScore) * 0.6)}% to +${Math.round((100 - result.overallScore) * 0.8)}%`);
  console.log('\n');
}

// Run
generateFullReport();
