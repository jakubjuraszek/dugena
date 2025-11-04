# Async Audit Processing - Setup Complete ✅

## What Was Implemented

Your ConvertFix app now has async audit processing with QStash queue and email delivery!

**Problem solved:** Paddle webhooks timeout after 10s, but audits take 20-60s.

**Solution:** Queue jobs with QStash, process async, send email with PDF.

## Architecture

```
Paddle Payment
    ↓
/api/webhooks/paddle (responds in <1s)
    ↓
QStash Queue (automatic retries)
    ↓
/api/workers/process-audit (20-60s processing)
    ↓
Resend Email with PDF attachment
    ↓
✅ Customer receives audit
```

## Files Created/Modified

### Created:
1. `lib/queue.ts` - QStash queue abstraction
2. `lib/email.ts` - Resend email sender with HTML template
3. `app/api/workers/process-audit/route.ts` - Worker endpoint
4. `app/api/webhooks/paddle/route.ts` - Paddle webhook handler
5. `app/api/test-queue/route.ts` - Testing endpoint

### Modified:
1. `.env.local` - Added QStash + Resend credentials
2. `package.json` - Added @upstash/qstash and resend dependencies

## Environment Variables (Already Added)

```env
# QStash (Upstash) - Already configured ✅
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="eyJVc2VySUQiOi..."
QSTASH_CURRENT_SIGNING_KEY="sig_6bzEE7MmBituLTthomvM5w2nCKsa"
QSTASH_NEXT_SIGNING_KEY="sig_5Nm4kKqQyYQ6VGFKzAmqNVAN38az"

# Resend - YOU NEED TO GET THIS ⚠️
RESEND_API_KEY=re_xxxxxxxxxxxxx

# App URL
NEXT_PUBLIC_URL=http://localhost:3000

# Paddle (optional in dev)
# PADDLE_WEBHOOK_SECRET=your_webhook_secret_here
```

## What You Need To Do

### 1. Setup Resend (5 minutes)

**Step 1: Sign up**
- Go to: https://resend.com/signup
- Free tier: 3,000 emails/month (enough for MVP)
- Verify your email

**Step 2: Get API key**
- Dashboard → API Keys → Create API Key
- Copy the key (starts with `re_`)

**Step 3: Add to .env.local**
```bash
RESEND_API_KEY=re_your_actual_key_here
```

**Step 4 (Optional): Custom domain**
- Dashboard → Domains → Add Domain
- Add DNS records for `convertfix.app`
- Update `lib/email.ts` line 35:
  ```typescript
  from: 'ConvertFix <audit@convertfix.app>',
  ```

**For now, use the onboarding domain:**
- `onboarding@resend.dev` (works immediately, no setup)

### 2. Deploy to Vercel (2 minutes)

```bash
vercel deploy
```

**In Vercel Dashboard:**
1. Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `QSTASH_URL`
   - `QSTASH_TOKEN`
   - `QSTASH_CURRENT_SIGNING_KEY`
   - `QSTASH_NEXT_SIGNING_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_URL=https://convertfix.app`
   - `OPENAI_API_KEY`
   - `JINA_API_KEY`
3. Redeploy

### 3. Test Everything (5 minutes)

**Option A: Test endpoint (recommended)**

1. Update [app/api/test-queue/route.ts:21-23](app/api/test-queue/route.ts#L21-L23):
   ```typescript
   const TEST_EMAIL = 'your@email.com'; // ← Your actual email
   const TEST_URL = 'https://linear.app'; // ← Any landing page
   const TEST_TIER: 'quick' | 'professional' = 'quick';
   ```

2. Visit: `https://convertfix.app/api/test-queue`

3. Check:
   - QStash dashboard: https://console.upstash.com/qstash
   - Your email (check spam folder)
   - PDF attachment

**Option B: Test with Paddle (production)**

1. Setup Paddle webhook:
   - Paddle Dashboard → Developer Tools → Webhooks
   - Add endpoint: `https://convertfix.app/api/webhooks/paddle`
   - Copy webhook secret → Add to `.env.local`

2. Test checkout:
   - Pass `custom_data` with checkout:
     ```json
     {
       "url": "https://example.com",
       "tier": "quick"
     }
     ```

3. Complete payment (use Paddle test mode)

4. Check email for PDF

## How It Works

### Development Mode
- Queue bypassed (QStash can't reach localhost)
- Jobs logged but not processed automatically
- Use test endpoint to trigger manually

### Production Mode
- Full async processing with QStash
- Automatic retries (3x on failure)
- Dead Letter Queue for failed jobs

## Monitoring

### QStash Dashboard
https://console.upstash.com/qstash

Monitor:
- Queued jobs
- Processing jobs
- Completed jobs
- Failed jobs (retry count)
- Dead Letter Queue (after 3 failures)

### Resend Dashboard
https://resend.com/dashboard

Monitor:
- Sent emails
- Delivery status
- Bounces / Spam reports
- Email analytics

### Vercel Logs
```bash
vercel logs --follow
```

See:
- Webhook calls
- Worker execution
- Errors and retries

## Cost

**Free tier limits:**
- QStash: 500 messages/day ✅
- Resend: 3,000 emails/month ✅
- **Total: $0/month until you scale**

**After free tier:**
- QStash: $10/month for 10k messages
- Resend: $20/month for 50k emails

## Troubleshooting

### "Missing RESEND_API_KEY"
→ Add it to `.env.local` and restart dev server

### "invalid destination url: loopback address"
→ Expected in development. Deploy to production to test QStash.

### "Email not received"
1. Check spam folder
2. Check Resend dashboard for delivery status
3. Verify `RESEND_API_KEY` is correct
4. Check Resend logs for errors

### "Worker timeout"
→ Increase `maxDuration` in [app/api/workers/process-audit/route.ts:90](app/api/workers/process-audit/route.ts#L90)
   - Hobby: max 60s
   - Pro: max 300s

### "Job failed 3 times"
→ Check QStash Dead Letter Queue:
   - https://console.upstash.com/qstash
   - View failed job details
   - Check error logs in Vercel
   - Fix issue and retry manually

## Next Steps

### Now:
1. ✅ Setup Resend API key
2. ✅ Deploy to Vercel
3. ✅ Test with test endpoint
4. ✅ Verify email delivery

### Later (Optional):
1. Add custom domain to Resend (better deliverability)
2. Create admin dashboard to view queue status
3. Add Slack/email notifications for failed jobs
4. Store failed jobs in database for manual retry
5. Add job status endpoint for customer support

## Support Resources

- **QStash Docs:** https://upstash.com/docs/qstash
- **Resend Docs:** https://resend.com/docs
- **Paddle Webhooks:** https://developer.paddle.com/webhooks/overview
- **Vercel Serverless:** https://vercel.com/docs/functions

## Questions?

Common questions:

**Q: Can I process audits synchronously for testing?**
A: Yes! Call the worker directly from your code:
```typescript
import { scrapePage } from '@/lib/scraper';
import { analyzeQuick } from '@/lib/ai-analyzer';
import { generatePDF } from '@/lib/pdf-generator';
import { sendAuditEmail } from '@/lib/email';

// Process immediately without queue
const scraped = await scrapePage(url);
const result = await analyzeQuick(scraped);
const pdf = await generatePDF(url, result, 'quick', 'en');
await sendAuditEmail({ to: email, tier: 'quick', pdfBuffer: pdf, url });
```

**Q: How do I change the email template?**
A: Edit [lib/email.ts:39-107](lib/email.ts#L39-L107)

**Q: Can I use a different email provider?**
A: Yes! Replace Resend in `lib/email.ts` with your provider (SendGrid, Mailgun, etc.)

**Q: What if QStash is down?**
A: Jobs are queued in QStash's infrastructure. If down temporarily, they'll process when back up. For critical reliability, consider adding fallback direct processing.

---

**Status: ✅ Ready for production**

Last updated: 2025-11-03
