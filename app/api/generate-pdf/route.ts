import { NextRequest, NextResponse } from 'next/server';
import { scrapePage } from '@/lib/scraper';
import { analyzeProfessional } from '@/lib/ai-analyzer';
import { generatePDF } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { url, locale = 'en' } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { message: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        throw new Error('URL must start with http:// or https://');
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting audit for: ${url}`);

    // Step 1: Scrape landing page
    console.log('📄 Step 1/3: Scraping...');
    const scraped = await scrapePage(url);

    // Step 2: Run professional analysis
    console.log('🤖 Step 2/3: Analyzing...');
    const analysis = await analyzeProfessional(scraped);

    // Step 3: Generate PDF
    console.log('📑 Step 3/3: Generating PDF...');
    const pdfBuffer = await generatePDF(url, analysis, 'professional', locale);

    console.log(`✅ Audit complete for: ${url}`);

    // Extract domain for filename
    const domain = new URL(url).hostname.replace('www.', '');
    const filename = `convertfix-audit-${domain}.pdf`;

    // Return PDF as downloadable file
    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('❌ PDF generation failed:', error);

    // Return error response
    return NextResponse.json(
      {
        message: error.message || 'Failed to generate PDF',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Optional: Support GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'ConvertFix PDF Generation API',
    usage: 'POST with { "url": "https://example.com" }',
  });
}
