/**
 * Scraper dla ConvertFix - używa Jina AI Reader API
 *
 * Jina AI zwraca clean markdown/text content z każdej strony (wspiera SPA).
 */

export interface ScrapedData {
  url: string;
  title: string;
  metaDescription: string;
  content: string; // Pełny tekst z Jina AI
  headings: {
    h1: string[];
    h2: string[];
  };
}

/**
 * Scrape landing page używając Jina AI Reader API
 *
 * @param url - URL strony do zescrapowania
 * @returns Promise z danymi strony
 * @throws Error jeśli scraping się nie powiedzie
 */
export async function scrapePage(url: string): Promise<ScrapedData> {
  // Walidacja URL
  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('URL musi zaczynać się od http:// lub https://');
    }
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }

  console.log(`📄 Scraping: ${url}`);
  const startTime = Date.now();

  try {
    // Wywołanie Jina AI Reader API z browser engine dla SPA
    // https://jina.ai/reader/ - zwraca clean markdown, wspiera SPAs
    // Use browser=chrome to render JavaScript for SPAs like Linear, Vercel, etc.
    const jinaUrl = `https://r.jina.ai/${url}`;
    const jinaApiKey = process.env.JINA_API_KEY;

    if (!jinaApiKey) {
      throw new Error('Missing JINA_API_KEY environment variable');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout (browser rendering takes longer)

    const response = await fetch(jinaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'Authorization': `Bearer ${jinaApiKey}`,
        'X-Return-Format': 'markdown', // Prefer markdown format
        'X-With-Generated-Alt': 'true', // Generate alt text for images
        'X-Timeout': '25', // Allow up to 25 seconds for page load
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Page not found (404): ${url}`);
      }
      throw new Error(`Jina AI API error: ${response.status} ${response.statusText}`);
    }

    // Jina AI zwraca markdown/text content
    const content = await response.text();

    if (!content || content.trim().length === 0) {
      throw new Error('Empty content returned from Jina AI');
    }

    // Parsowanie markdown content
    const scraped = parseJinaContent(url, content);

    const elapsed = Date.now() - startTime;
    console.log(`✅ Scraped in ${(elapsed / 1000).toFixed(1)}s (${content.length} chars)`);

    return scraped;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Scraping timeout (>30s): ${url}`);
    }

    // Re-throw z context
    throw new Error(`Scraping failed for ${url}: ${error.message}`);
  }
}

/**
 * Parsuje markdown content z Jina AI → ScrapedData
 */
function parseJinaContent(url: string, content: string): ScrapedData {
  const lines = content.split('\n');

  // Wyciągnij title (zwykle pierwsza niepusta linia lub # heading)
  let title = '';
  let metaDescription = '';
  const h1Headings: string[] = [];
  const h2Headings: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';

    if (!line) continue;

    // Wykryj title - pierwsza linia z # lub pierwsza niepusta
    if (!title) {
      if (line.startsWith('# ')) {
        title = line.replace(/^#\s+/, '').trim();
      } else if (!line.startsWith('##') && line.length > 0) {
        title = line;
      }
    }

    // Zbierz H1 headings - hash style (# Heading)
    if (line.startsWith('# ')) {
      const heading = line.replace(/^#\s+/, '').trim();
      h1Headings.push(heading);
    }

    // Zbierz H1 headings - underline style (text followed by ===)
    // Standard markdown: linia tekstu + linia składająca się tylko z ===
    if (nextLine && /^=+$/.test(nextLine) && !line.startsWith('#')) {
      h1Headings.push(line);
      // Skip the === line in next iteration
      i++;
      continue;
    }

    // Zbierz H2 headings - hash style (## Heading)
    if (line.startsWith('## ')) {
      const heading = line.replace(/^##\s+/, '').trim();
      h2Headings.push(heading);
    }

    // Zbierz H2 headings - underline style (text followed by ---)
    if (nextLine && /^-+$/.test(nextLine) && !line.startsWith('#')) {
      h2Headings.push(line);
      // Skip the --- line in next iteration
      i++;
      continue;
    }

    // Meta description - zwykle pierwsza dłuższa linia pod tytułem
    if (!metaDescription && i > 0 && line.length > 50 && !line.startsWith('#')) {
      metaDescription = line.substring(0, 160); // Limit 160 chars
    }
  }

  // Fallback jeśli nie znaleziono title
  if (!title) {
    const urlObj = new URL(url);
    title = urlObj.hostname.replace('www.', '');
  }

  // Fallback dla meta description
  if (!metaDescription) {
    // Znajdź pierwszą dłuższą linię
    const longLine = lines.find(l => {
      const trimmed = l.trim();
      return trimmed.length > 50 && !trimmed.startsWith('#');
    });
    metaDescription = longLine ? longLine.trim().substring(0, 160) : '';
  }

  return {
    url,
    title,
    metaDescription,
    content: content.trim(),
    headings: {
      h1: h1Headings,
      h2: h2Headings,
    },
  };
}

/**
 * Pomocnicza funkcja do testowania - pretty print ScrapedData
 */
export function debugScrapedData(data: ScrapedData): void {
  console.log('\n🔍 SCRAPED DATA DEBUG:');
  console.log('━'.repeat(60));
  console.log(`📍 URL: ${data.url}`);
  console.log(`📰 Title: ${data.title}`);
  console.log(`📝 Meta: ${data.metaDescription}`);
  console.log(`📊 Content length: ${data.content.length} chars`);
  console.log(`📑 H1 headings: ${data.headings.h1.length}`);
  data.headings.h1.forEach((h, i) => console.log(`   ${i + 1}. ${h}`));
  console.log(`📑 H2 headings: ${data.headings.h2.length}`);
  data.headings.h2.slice(0, 5).forEach((h, i) => console.log(`   ${i + 1}. ${h}`));
  if (data.headings.h2.length > 5) {
    console.log(`   ... +${data.headings.h2.length - 5} more`);
  }
  console.log('━'.repeat(60));
}
