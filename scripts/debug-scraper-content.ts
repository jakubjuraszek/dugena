/**
 * Debug Script for Scraper Content Inspection
 *
 * Inspects what Jina AI actually returns for linear.app
 * to diagnose why H1 headings aren't being detected.
 *
 * Usage: npx tsx scripts/debug-scraper-content.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { scrapePage } from '../lib/scraper';

async function debugScraperContent() {
  console.log('🔍 SCRAPER CONTENT DIAGNOSTIC\n');
  console.log('═'.repeat(60));
  console.log('\nTesting URL: https://linear.app\n');

  try {
    const data = await scrapePage('https://linear.app');

    // =========================================================================
    // 1. Basic Stats
    // =========================================================================
    console.log('📊 BASIC STATS:');
    console.log(`   Total content length: ${data.content.length} chars`);
    console.log(`   Total lines: ${data.content.split('\n').length}`);
    console.log(`   Title: "${data.title}"`);
    console.log(`   Meta: "${data.metaDescription}"`);
    console.log(`   H1 found: ${data.headings.h1.length}`);
    console.log(`   H2 found: ${data.headings.h2.length}\n`);

    // =========================================================================
    // 2. First 1000 Characters
    // =========================================================================
    console.log('═'.repeat(60));
    console.log('📄 FIRST 1000 CHARACTERS OF CONTENT:\n');
    console.log(data.content.substring(0, 1000));
    console.log('\n[... truncated ...]\n');

    // =========================================================================
    // 3. All Lines Starting with # (Markdown Headings)
    // =========================================================================
    console.log('═'.repeat(60));
    console.log('📑 LINES STARTING WITH # (Markdown Headings):\n');
    const lines = data.content.split('\n');
    const headingLines = lines.filter(l => l.trim().startsWith('#'));

    if (headingLines.length === 0) {
      console.log('   ❌ NO HEADING LINES FOUND!\n');
      console.log('   This means Jina AI did NOT return any markdown headings.');
      console.log('   Likely causes:');
      console.log('   - Linear.app uses JavaScript-rendered headings');
      console.log('   - Jina AI cannot capture dynamic content');
      console.log('   - Page uses <div> instead of semantic <h1> tags\n');
    } else {
      console.log(`   Found ${headingLines.length} heading lines:\n`);
      headingLines.slice(0, 20).forEach((line, i) => {
        console.log(`   ${i + 1}. ${line}`);
      });
      if (headingLines.length > 20) {
        console.log(`   ... +${headingLines.length - 20} more\n`);
      }
    }

    // =========================================================================
    // 4. Search for "Linear" Keyword (Case Insensitive)
    // =========================================================================
    console.log('═'.repeat(60));
    console.log('🔎 LINES CONTAINING "LINEAR" (First 15):\n');
    const linearLines = lines
      .map((line, idx) => ({ line, idx }))
      .filter(({ line }) => line.toLowerCase().includes('linear'))
      .slice(0, 15);

    if (linearLines.length === 0) {
      console.log('   ❌ NO LINES WITH "LINEAR" FOUND\n');
    } else {
      linearLines.forEach(({ line, idx }) => {
        console.log(`   Line ${idx + 1}: ${line.trim()}`);
      });
      console.log('');
    }

    // =========================================================================
    // 5. Search for Common Heading Patterns
    // =========================================================================
    console.log('═'.repeat(60));
    console.log('🎯 SEARCHING FOR HEADING PATTERNS:\n');

    // Pattern 1: "Build better products"
    const buildBetter = lines.find(l =>
      l.toLowerCase().includes('build better') ||
      l.toLowerCase().includes('build great')
    );
    console.log(`   "Build better" pattern: ${buildBetter ? '✅ FOUND' : '❌ NOT FOUND'}`);
    if (buildBetter) console.log(`      → "${buildBetter.trim()}"`);

    // Pattern 2: Lines with all caps or title case
    const titleCaseLines = lines.filter(l => {
      const trimmed = l.trim();
      return trimmed.length > 10 &&
             trimmed.length < 100 &&
             /^[A-Z]/.test(trimmed) &&
             !trimmed.startsWith('#');
    }).slice(0, 10);

    console.log(`\n   Title-case lines (first 10):`);
    if (titleCaseLines.length === 0) {
      console.log('      ❌ NONE FOUND');
    } else {
      titleCaseLines.forEach((line, i) => {
        console.log(`      ${i + 1}. ${line.trim()}`);
      });
    }

    // =========================================================================
    // 6. Raw Content Sample
    // =========================================================================
    console.log('\n' + '═'.repeat(60));
    console.log('📋 RAW CONTENT SAMPLE (Lines 1-30):\n');
    lines.slice(0, 30).forEach((line, i) => {
      console.log(`${String(i + 1).padStart(3, ' ')} | ${line}`);
    });

    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ Diagnostic complete!\n');

  } catch (error: any) {
    console.error('\n❌ DIAGNOSTIC FAILED');
    console.error('Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

// ============================================================================
// RUN DIAGNOSTIC
// ============================================================================

debugScraperContent().catch((error) => {
  console.error('\n💥 FATAL ERROR:');
  console.error(error);
  process.exit(1);
});
