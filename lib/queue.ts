/**
 * QStash Queue for ConvertFix
 *
 * Handles async audit job processing with automatic retries.
 * Jobs are queued and processed by worker endpoint.
 */

import { Client } from '@upstash/qstash';

export interface AuditJob {
  id: string; // unique job ID (uuidv4)
  url: string; // landing page URL to audit
  email: string; // customer email
  tier: 'quick' | 'professional'; // audit package
  locale?: string; // language for PDF (en/pl)
  createdAt: string; // ISO timestamp
}

// Initialize QStash client
const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

/**
 * Add audit job to QStash queue
 * QStash will deliver to our worker endpoint with automatic retries
 *
 * @param job - Audit job details
 * @throws Error if QSTASH_TOKEN or NEXT_PUBLIC_URL is missing
 */
export async function addAuditToQueue(job: AuditJob): Promise<void> {
  // Validation
  if (!process.env.QSTASH_TOKEN) {
    throw new Error('Missing QSTASH_TOKEN environment variable');
  }

  if (!process.env.NEXT_PUBLIC_URL) {
    throw new Error('Missing NEXT_PUBLIC_URL environment variable');
  }

  // DEVELOPMENT: Process immediately instead of queueing
  // QStash can't reach localhost, so we skip the queue in dev mode
  if (process.env.NODE_ENV === 'development') {
    console.log('🚧 DEV MODE: Job queued (will process on worker call)');
    console.log(`📋 Job ${job.id}: ${job.url} (${job.tier}) → ${job.email}`);
    // In development, you can manually trigger the worker or use ngrok
    return;
  }

  // PRODUCTION: Use QStash
  const workerUrl = `${process.env.NEXT_PUBLIC_URL}/api/workers/process-audit`;

  try {
    await qstash.publishJSON({
      url: workerUrl,
      body: job,
      retries: 3, // Retry up to 3 times on failure
      delay: 10, // Start processing after 10 seconds (gives webhook time to return)
    });

    console.log(`✅ Audit queued: ${job.id} (${job.tier}) → ${workerUrl}`);
  } catch (error: any) {
    console.error('❌ Failed to queue audit:', error);
    throw new Error(`Queue error: ${error.message}`);
  }
}
