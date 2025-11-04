import { NextRequest, NextResponse } from 'next/server';
import { addAuditToQueue } from '@/lib/queue';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { url, email, locale = 'en' } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { message: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate Email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
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

    // Generate unique job ID
    const jobId = randomUUID();

    console.log(`🚀 Queueing audit: ${jobId}`);
    console.log(`   URL: ${url}`);
    console.log(`   Email: ${email}`);
    console.log(`   Locale: ${locale}`);

    // Queue the audit job to QStash
    await addAuditToQueue({
      id: jobId,
      url,
      email,
      tier: 'professional', // Beta users get professional tier
      locale,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Audit queued successfully: ${jobId}`);

    // Return instant success response
    return NextResponse.json(
      {
        success: true,
        message: 'Audit queued successfully',
        jobId,
        estimatedTime: '2-3 minutes',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Failed to queue audit:', error);

    // Return error response
    return NextResponse.json(
      {
        message: error.message || 'Failed to queue audit',
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
