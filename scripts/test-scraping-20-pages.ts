import { scrapePage } from '../lib/scraper';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

interface TestResult {
  index: number;
  url: string;
  status: 'success' | 'error';
  timeSeconds: number;
  contentOk: boolean;
  contentLength: number;
  notes: string;
}

const testUrls = [
  // SPA / React / Vue
  'https://notion.so',
  'https://linear.app',
  'https://vercel.com',
  'https://supabase.com',
  'https://cal.com',

  // Classic HTML / Marketing
  'https://basecamp.com',
  'https://hey.com',
  'https://doist.com',
  'https://buffer.com',
  'https://mailchimp.com',

  // Trudne - CloudFlare / Heavy JS
  'https://shopify.com',
  'https://squarespace.com',
  'https://wix.com',
  'https://canva.com',
  'https://figma.com',

  // Indie / Small SaaS
  'https://plausible.io',
  'https://buttondown.email',
  'https://usefathom.com',
  'https://pirsch.io',
  'https://crisp.chat',
];

async function testScraping(url: string, maxRetries = 2): Promise<TestResult> {
  const index = testUrls.indexOf(url) + 1;
  let lastError: Error | null = null;
  const overallStartTime = Date.now();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const startTime = Date.now();

    try {
      console.log(`[${index}/20] Testing ${url} (attempt ${attempt}/${maxRetries})...`);

      const data = await scrapePage(url);
      const timeSeconds = (Date.now() - startTime) / 1000;

      // Check if content is meaningful
      const contentOk = data.content.length > 500 &&
                       (data.title.length > 0 || data.headings.h1.length > 0);

      const result: TestResult = {
        index,
        url,
        status: 'success',
        timeSeconds: Math.round(timeSeconds * 10) / 10,
        contentOk,
        contentLength: data.content.length,
        notes: contentOk
          ? `Title: "${data.title.substring(0, 50)}${data.title.length > 50 ? '...' : ''}"`
          : 'Content too short or missing title/headings',
      };

      console.log(`✅ Success in ${result.timeSeconds}s - ${result.contentLength} chars`);
      return result;

    } catch (error: any) {
      lastError = error;
      console.log(`❌ Attempt ${attempt} failed: ${error.message}`);

      if (attempt < maxRetries) {
        console.log(`   Retrying in 2s...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // All retries failed
  const timeSeconds = (Date.now() - overallStartTime) / 1000;
  return {
    index,
    url,
    status: 'error',
    timeSeconds: Math.round(timeSeconds * 10) / 10,
    contentOk: false,
    contentLength: 0,
    notes: `Error: ${lastError?.message || 'Unknown error'}`,
  };
}

function generateMarkdownReport(results: TestResult[]): string {
  const successCount = results.filter(r => r.status === 'success').length;
  const contentOkCount = results.filter(r => r.contentOk).length;
  const avgTime = results
    .filter(r => r.status === 'success')
    .reduce((sum, r) => sum + r.timeSeconds, 0) / (successCount || 1);

  const problematic = results.filter(r => r.status === 'error' || !r.contentOk);

  let report = `# Scraping Test Results - ConvertFix\n\n`;
  report += `**Test Date:** ${new Date().toISOString()}\n`;
  report += `**Scraper:** Jina AI Reader API\n`;
  report += `**Total Pages:** 20\n\n`;

  report += `## Results Table\n\n`;
  report += `| # | URL | Status | Czas (s) | Content OK? | Uwagi |\n`;
  report += `|---|-----|--------|----------|-------------|-------|\n`;

  for (const result of results) {
    const statusIcon = result.status === 'success' ? '✅' : '❌';
    const contentIcon = result.contentOk ? 'TAK' : 'NIE';
    const notes = result.notes.substring(0, 60) + (result.notes.length > 60 ? '...' : '');

    report += `| ${result.index} | ${result.url} | ${statusIcon} | ${result.timeSeconds} | ${contentIcon} | ${notes} |\n`;
  }

  report += `\n## Podsumowanie\n\n`;
  report += `- **Działające:** ${successCount}/20 (${Math.round(successCount/20*100)}%)\n`;
  report += `- **Content OK:** ${contentOkCount}/20 (${Math.round(contentOkCount/20*100)}%)\n`;
  report += `- **Średni czas:** ${avgTime.toFixed(1)}s\n`;
  report += `- **Najszybszy:** ${Math.min(...results.filter(r => r.status === 'success').map(r => r.timeSeconds))}s\n`;
  report += `- **Najwolniejszy:** ${Math.max(...results.filter(r => r.status === 'success').map(r => r.timeSeconds))}s\n\n`;

  if (problematic.length > 0) {
    report += `### Problematyczne strony (${problematic.length}):\n\n`;
    for (const p of problematic) {
      report += `- **${p.url}**: ${p.notes}\n`;
    }
    report += `\n`;
  }

  report += `## Rekomendacje\n\n`;

  if (successCount === 20 && contentOkCount === 20) {
    report += `✅ Wszystkie strony działają prawidłowo! Scraper Jina AI radzi sobie świetnie.\n`;
  } else {
    if (problematic.some(p => p.notes.includes('timeout'))) {
      report += `- ⏱️ **Timeout issues:** Rozważ zwiększenie X-Timeout w Jina API (obecnie 25s)\n`;
    }
    if (problematic.some(p => p.notes.includes('429') || p.notes.includes('rate limit'))) {
      report += `- 🚦 **Rate limiting:** Dodaj większe opóźnienia między requestami lub użyj batch processing\n`;
    }
    if (problematic.some(p => p.notes.includes('403') || p.notes.includes('blocked'))) {
      report += `- 🚫 **Access blocked:** Niektóre strony blokują Jina AI - rozważ fallback do Puppeteer\n`;
    }
    if (problematic.some(p => !p.contentOk && p.status === 'success')) {
      report += `- 📄 **Słaba jakość contentu:** Niektóre strony zwracają za mało treści - może problem z JS rendering\n`;
    }
  }

  report += `\n## Kategorie Stron\n\n`;

  const categories = [
    { name: 'SPA / React / Vue', range: [0, 5] },
    { name: 'Classic HTML / Marketing', range: [5, 10] },
    { name: 'Trudne (CloudFlare / Heavy JS)', range: [10, 15] },
    { name: 'Indie / Small SaaS', range: [15, 20] },
  ];

  for (const cat of categories) {
    const catResults = results.slice(cat.range[0], cat.range[1]);
    const catSuccess = catResults.filter(r => r.status === 'success').length;
    report += `- **${cat.name}:** ${catSuccess}/${catResults.length} działa\n`;
  }

  return report;
}

async function main() {
  console.log('🚀 Starting scraping tests on 20 landing pages...\n');

  if (!process.env.JINA_API_KEY) {
    console.error('❌ JINA_API_KEY not found in environment variables!');
    console.error('   Make sure .env.local exists with JINA_API_KEY set.');
    process.exit(1);
  }

  const results: TestResult[] = [];

  for (const url of testUrls) {
    const result = await testScraping(url);
    results.push(result);

    // Add delay between requests to avoid rate limiting
    if (testUrls.indexOf(url) < testUrls.length - 1) {
      console.log('   Waiting 3s before next request...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n✅ All tests completed!\n');
  console.log('📝 Generating report...\n');

  const report = generateMarkdownReport(results);
  const reportPath = path.join(process.cwd(), 'scraping-test-results.md');
  fs.writeFileSync(reportPath, report);

  console.log(`✅ Report saved to: ${reportPath}\n`);
  console.log('Summary:');
  console.log(`- Success: ${results.filter(r => r.status === 'success').length}/20`);
  console.log(`- Content OK: ${results.filter(r => r.contentOk).length}/20`);

  // Print quick overview
  console.log('\nQuick Overview:');
  for (const result of results) {
    const icon = result.status === 'success' ? '✅' : '❌';
    console.log(`${icon} ${result.url} (${result.timeSeconds}s)`);
  }
}

main().catch(console.error);
