/**
 * Test endpoint for QStash queue
 *
 * Usage:
 * - Visit /api/test-queue to trigger a test audit
 * - Change the email and URL in the code below
 * - Check QStash dashboard: https://console.upstash.com/qstash
 * - Check your email for the PDF
 *
 * IMPORTANT: Only use in development or with proper authentication
 */

import { NextResponse } from 'next/server';
import { addAuditToQueue } from '@/lib/queue';
import crypto from 'crypto';

export async function GET() {
  console.log('🧪 Test queue endpoint triggered');

  try {
    // TEST CONFIG - Change these values
    const TEST_EMAIL = 'test@example.com'; // ← CHANGE THIS to your email
    const TEST_URL = 'https://linear.app'; // ← Test with a real landing page
    const TEST_TIER: 'quick' | 'professional' = 'quick'; // ← quick or professional

    // Create test job
    const job = {
      id: crypto.randomUUID(),
      url: TEST_URL,
      email: TEST_EMAIL,
      tier: TEST_TIER,
      createdAt: new Date().toISOString(),
    };

    console.log(`📋 Test job created: ${job.id}`);
    console.log(`   URL: ${TEST_URL}`);
    console.log(`   Email: ${TEST_EMAIL}`);
    console.log(`   Tier: ${TEST_TIER}`);

    // Queue the job
    await addAuditToQueue(job);

    console.log(`✅ Test job queued successfully`);

    // Development mode: Process immediately
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          success: true,
          message: 'Test job created (DEV MODE)',
          note: 'In development, manually trigger the worker at /api/workers/process-audit',
          job,
        },
        { status: 200 }
      );
    }

    // Production mode: Job will be processed by QStash
    return NextResponse.json(
      {
        success: true,
        message: 'Test job queued successfully',
        job,
        next: [
          '1. Check QStash dashboard: https://console.upstash.com/qstash',
          `2. Wait for email at ${TEST_EMAIL}`,
          '3. Check spam folder if not received',
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Test queue failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
