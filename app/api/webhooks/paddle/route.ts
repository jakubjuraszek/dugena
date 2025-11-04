/**
 * Paddle webhook handler for ConvertFix
 *
 * Receives payment notifications from Paddle and queues audit jobs.
 * Must respond within 10s to avoid timeout.
 *
 * Flow:
 * 1. Verify Paddle signature (security)
 * 2. Parse payment data
 * 3. Queue audit job to QStash
 * 4. Return 200 OK immediately
 *
 * Paddle Docs: https://developer.paddle.com/webhooks/overview
 */

import { NextRequest, NextResponse } from 'next/server';
import { addAuditToQueue } from '@/lib/queue';
import type { AuditJob } from '@/lib/queue';
import crypto from 'crypto';

/**
 * Verify Paddle webhook signature
 * Prevents unauthorized webhook calls
 */
function verifyPaddleSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  console.log('🔔 Paddle webhook received');

  try {
    // 1. Parse webhook payload
    const payload = await request.text();
    const signature = request.headers.get('paddle-signature');

    // 2. Verify signature (optional in development, required in production)
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    if (process.env.NODE_ENV === 'production' && webhookSecret) {
      const isValid = verifyPaddleSignature(payload, signature, webhookSecret);
      if (!isValid) {
        console.error('❌ Invalid Paddle signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 3. Parse JSON data
    const data = JSON.parse(payload);

    // 4. Extract payment details
    // Paddle webhook structure: https://developer.paddle.com/webhooks/overview
    const eventType = data.event_type;

    // Only process successful payments
    if (eventType !== 'transaction.completed') {
      console.log(`ℹ️ Ignoring event: ${eventType}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Extract customer email and custom data
    const customerEmail = data.data?.customer?.email;
    const customData = data.data?.custom_data;

    if (!customerEmail) {
      console.error('❌ Missing customer email in webhook');
      return NextResponse.json(
        { error: 'Missing customer email' },
        { status: 400 }
      );
    }

    // Custom data should contain: { url, tier }
    // These are passed when creating the Paddle checkout
    const url = customData?.url;
    const tier = customData?.tier as 'quick' | 'professional';

    if (!url || !tier) {
      console.error('❌ Missing custom_data (url or tier) in webhook');
      return NextResponse.json(
        { error: 'Missing required custom data' },
        { status: 400 }
      );
    }

    // 5. Create audit job
    const job: AuditJob = {
      id: crypto.randomUUID(),
      url,
      email: customerEmail,
      tier,
      createdAt: new Date().toISOString(),
    };

    console.log(`📋 Creating job: ${job.id} (${tier}) → ${customerEmail}`);

    // 6. Queue the job (returns immediately)
    await addAuditToQueue(job);

    console.log(`✅ Webhook processed successfully`);

    // 7. Return 200 OK immediately (Paddle requires response within 10s)
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Webhook processing failed:', error);

    // Still return 200 to avoid Paddle retries
    // Log error for manual investigation
    return NextResponse.json(
      { received: true, error: error.message },
      { status: 200 }
    );
  }
}
