/**
 * Quick test - tylko scraper
 */

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { scrapePage, debugScrapedData } from '../lib/scraper';

async function testScraperOnly() {
  console.log('🧪 Testing Scraper Only\n');

  const url = 'https://linear.app';

  try {
    const scraped = await scrapePage(url);
    debugScrapedData(scraped);
    console.log('\n✅ Scraper test passed!');
  } catch (error: any) {
    console.error('❌ Scraper test failed:', error.message);
    process.exit(1);
  }
}

testScraperOnly();
