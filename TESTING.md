# Testing Guide - ConvertFix Beta Async Flow

This guide explains how to test the async audit processing with QStash + email delivery.

## Architecture Overview

```
User submits form (URL + Email)
      ↓
POST /api/generate-pdf (instant response <1s)
      ↓
QStash Queue (job stored, webhook triggered)
      ↓
POST /api/workers/process-audit (5min timeout)
      ├─ Scrape page (10-30s)
      ├─ AI analysis (20-50s)
      ├─ Generate PDF (2-5s)
      └─ Send email (1-2s)
      ↓
Customer receives PDF via email
```

## Prerequisites

1. **Environment Variables** - Copy `.env.example` to `.env.local` and fill in:
   - `OPENAI_API_KEY` - For AI analysis
   - `JINA_API_KEY` - For web scraping
   - `RESEND_API_KEY` - For email delivery
   - `QSTASH_TOKEN` - From Upstash Console
   - `QSTASH_CURRENT_SIGNING_KEY` - From Upstash Console
   - `QSTASH_NEXT_SIGNING_KEY` - From Upstash Console
   - `NEXT_PUBLIC_APP_URL` - See below for dev/prod setup

2. **Packages** - Install dependencies:
   ```bash
   npm install
   ```

## Local Testing (Development)

### Option A: Using ngrok (Recommended)

QStash needs to reach your local server via public URL. Use ngrok:

1. **Install ngrok:**
   ```bash
   brew install ngrok  # macOS
   # or download from https://ngrok.com/download
   ```

2. **Start your Next.js dev server:**
   ```bash
   npm run dev
   ```

3. **In another terminal, expose port 3000:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
   ```

6. **Restart dev server** to load new env var

7. **Test the flow:**
   - Go to `http://localhost:3000/en/audit`
   - Enter a URL and your email
   - Click "Queue Audit"
   - Check QStash dashboard: https://console.upstash.com/qstash
   - Wait 2-3 minutes
   - Check your email inbox

### Option B: Manual Worker Trigger (Quick Test)

Skip QStash queue and call worker directly:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Trigger worker with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/workers/process-audit \
     -H "Content-Type: application/json" \
     -d '{
       "id": "test-123",
       "url": "https://linear.app",
       "email": "your@email.com",
       "tier": "professional",
       "locale": "en",
       "createdAt": "2024-01-01T00:00:00Z"
     }'
   ```

3. **Check console logs** for progress

4. **Check your email** for PDF delivery

**Note:** This bypasses QStash verification, only use for dev testing.

## Production Testing (Vercel)

### 1. Deploy to Vercel

```bash
vercel --prod
```

### 2. Add Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables:

```
OPENAI_API_KEY=sk-proj-...
JINA_API_KEY=jina_...
RESEND_API_KEY=re_...
QSTASH_TOKEN=...
QSTASH_CURRENT_SIGNING_KEY=sig_...
QSTASH_NEXT_SIGNING_KEY=sig_...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
PADDLE_WEBHOOK_SECRET=... (optional)
```

**Important:** `NEXT_PUBLIC_APP_URL` must match your production domain.

### 3. Test on Production

1. Go to `https://your-domain.vercel.app/en/audit`
2. Submit audit form
3. Check QStash logs: https://console.upstash.com/qstash
4. Check email delivery

## Monitoring & Debugging

### QStash Dashboard

Monitor job status: https://console.upstash.com/qstash

- **Queued** - Job waiting to be processed
- **Delivered** - Worker received the job
- **Failed** - Job failed (will retry up to 3x)
- **Dead Letter Queue** - Failed after 3 retries

### Resend Dashboard

Check email delivery: https://resend.com/emails

- **Sent** - Email delivered successfully
- **Bounced** - Email address invalid
- **Failed** - Delivery error

### Vercel Logs

View worker execution logs:

```bash
vercel logs --follow
```

Or in Vercel Dashboard → Functions → Select your function

### Common Issues

**1. "Missing QSTASH_TOKEN"**
- Check `.env.local` has `QSTASH_TOKEN`
- Restart dev server after adding env vars

**2. "Missing NEXT_PUBLIC_APP_URL"**
- Set to ngrok URL (dev) or production domain (prod)
- Must be publicly accessible for QStash

**3. "QStash signature verification failed"**
- Check `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY`
- Get latest keys from Upstash Console

**4. "Resend error: 403 Forbidden"**
- Verify email domain in Resend
- Or use Resend sandbox email: `onboarding@resend.dev`

**5. Worker timeout (60s)**
- Vercel Hobby plan has 60s limit
- Worker should finish in 20-60s typically
- Check logs to see which step is slow
- Consider upgrading to Vercel Pro (300s limit)

**6. Email not received**
- Check spam folder
- Verify email in Resend Dashboard
- Check worker logs for "Email sent successfully"
- Test with different email provider

## Testing Checklist

Before deploying:

- [ ] Form submission returns instant success (<1s)
- [ ] QStash receives job (check dashboard)
- [ ] Worker processes job successfully (check logs)
- [ ] PDF generates correctly
- [ ] Email delivers with PDF attachment
- [ ] PDF opens and renders properly
- [ ] Multi-language support works (EN/PL)
- [ ] Error handling works (invalid URL, email)
- [ ] Retry logic works (simulate worker failure)

## Performance Benchmarks

Expected timings:

- **Form submit → Response:** <1s (instant)
- **Queue → Worker trigger:** 10-15s (QStash delay)
- **Scraping:** 10-30s (depends on page size)
- **AI Analysis:** 20-50s (depends on content)
- **PDF Generation:** 2-5s
- **Email Delivery:** 1-2s
- **Total (user perspective):** 60-120s (2-3 minutes)

## Next Steps

After successful testing:

1. **Rate Limiting** - Add limits to prevent abuse (see `app/api/generate-pdf/route.ts`)
2. **Error Emails** - Send failure notifications to users
3. **Job Status Page** - Let users check audit status
4. **Webhooks** - Add status callbacks for integrations

## Support

Questions or issues? Check:

- QStash Docs: https://upstash.com/docs/qstash
- Resend Docs: https://resend.com/docs
- Vercel Docs: https://vercel.com/docs
