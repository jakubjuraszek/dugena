/**
 * QSTASH AUDIT WORKER
 *
 * Async worker that processes landing page audits.
 * Triggered by QStash queue after successful Paddle payment.
 *
 * Flow:
 * 1. Verify QStash signature (security)
 * 2. Fetch landing page content (Jina AI)
 * 3. Analyze with OpenAI (GPT-4)
 * 4. Generate PDF audit
 * 5. Send email with PDF attachment (Resend)
 *
 * This endpoint must be accessible from QStash (public URL).
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import type { AuditJob } from '@/lib/queue';
import { Resend } from 'resend';

/**
 * QStash Worker - Process Audit Job
 *
 * POST body: AuditJob { id, url, email, tier, locale }
 */
async function handler(request: NextRequest) {
  console.log('🔧 Audit worker started');

  // Initialize Resend inside handler (not in module scope)
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1. Parse job data
    const job: AuditJob = await request.json();
    console.log(`📋 Processing job ${job.id}: ${job.url} (${job.tier}) → ${job.email}`);

    // 2. Fetch landing page content via Jina AI
    const jinaApiKey = process.env.JINA_API_KEY;
    if (!jinaApiKey) {
      throw new Error('Missing JINA_API_KEY');
    }

    console.log(`🔍 Fetching content from: ${job.url}`);
    const jinaResponse = await fetch(`https://r.jina.ai/${job.url}`, {
      headers: {
        'Authorization': `Bearer ${jinaApiKey}`,
        'X-Return-Format': 'markdown',
      },
    });

    if (!jinaResponse.ok) {
      throw new Error(`Jina AI failed: ${jinaResponse.status}`);
    }

    const pageContent = await jinaResponse.text();
    console.log(`✅ Content fetched: ${pageContent.length} chars`);

    // 3. Analyze with OpenAI GPT-4
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }

    console.log(`🤖 Analyzing with OpenAI (${job.tier})...`);

    // Different prompts based on tier
    const analysisPrompt = job.tier === 'professional'
      ? getProfessionalPrompt(job.locale || 'en')
      : getQuickPrompt(job.locale || 'en');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: analysisPrompt,
          },
          {
            role: 'user',
            content: `Analyze this landing page:\n\n${pageContent.slice(0, 30000)}`, // Limit to 30k chars
          },
        ],
        temperature: 0.7,
        max_tokens: job.tier === 'professional' ? 4000 : 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      throw new Error(`OpenAI failed: ${error}`);
    }

    const openaiData = await openaiResponse.json();
    const analysis = openaiData.choices[0].message.content;
    console.log(`✅ Analysis complete: ${analysis.length} chars`);

    // 4. Generate PDF (simplified for MVP - could use @react-pdf/renderer later)
    // For now, we'll send the analysis as text in email
    // TODO: Generate proper PDF with @react-pdf/renderer

    // 5. Send email with Resend
    console.log(`📧 Sending email to: ${job.email}`);

    const emailSubject = job.locale === 'pl'
      ? '🎯 Twój audyt landing page jest gotowy!'
      : '🎯 Your landing page audit is ready!';

    const emailHtml = getEmailTemplate(job, analysis);

    await resend.emails.send({
      from: 'ConvertFix Audits <audits@convertfix.app>',
      to: job.email,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log(`✅ Job ${job.id} completed successfully`);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      emailSent: true,
    });

  } catch (error: any) {
    console.error('❌ Worker failed:', error);

    // Return 500 to trigger QStash retry
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Professional tier analysis prompt
 */
function getProfessionalPrompt(locale: string): string {
  if (locale === 'pl') {
    return `Jesteś ekspertem od optymalizacji konwersji landing page. Przeanalizuj podaną stronę i stwórz szczegółowy raport audytu zawierający:

1. **Podsumowanie** (2-3 zdania) - ogólna ocena strony
2. **Pierwsza rzecz którą widzisz** - czy hero section jest jasny i przekonujący?
3. **Problem** - czy strona jasno identyfikuje problem użytkownika?
4. **Propozycja wartości** - czy jest oczywiste dlaczego powinienem kupić?
5. **Call-to-Action** - czy CTA są widoczne i przekonujące?
6. **Social Proof** - czy strona buduje zaufanie?
7. **Najważniejsze błędy** (Top 3) - co naprawić w pierwszej kolejności
8. **Konkretne rekomendacje** (5-7 punktów) - dokładne wskazówki co zmienić

Bądź konkretny i praktyczny. Pisz bezpośrednio, bez korporacyjnego języka.`;
  } else {
    return `You are a landing page conversion optimization expert. Analyze the provided page and create a detailed audit report including:

1. **Summary** (2-3 sentences) - overall page assessment
2. **First impression** - is the hero section clear and compelling?
3. **Problem** - does the page clearly identify the user's problem?
4. **Value proposition** - is it obvious why I should buy?
5. **Call-to-Action** - are CTAs visible and compelling?
6. **Social Proof** - does the page build trust?
7. **Critical Issues** (Top 3) - what to fix first
8. **Specific Recommendations** (5-7 points) - exact instructions on what to change

Be specific and practical. Write directly, avoid corporate language.`;
  }
}

/**
 * Quick tier analysis prompt (shorter, focused)
 */
function getQuickPrompt(locale: string): string {
  if (locale === 'pl') {
    return `Jesteś ekspertem od landing page. Stwórz krótki audyt (1 strona) zawierający:

1. **Podsumowanie** (2 zdania)
2. **Najważniejsze błędy** (Top 3)
3. **Szybkie winy** (3 rzeczy do naprawy w 10 minut)

Bądź konkretny i zwięzły.`;
  } else {
    return `You are a landing page expert. Create a quick audit (1 page) including:

1. **Summary** (2 sentences)
2. **Critical Issues** (Top 3)
3. **Quick Wins** (3 things to fix in 10 minutes)

Be specific and concise.`;
  }
}

/**
 * Email template with audit results
 */
function getEmailTemplate(job: AuditJob, analysis: string): string {
  const isPl = job.locale === 'pl';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #FF6B35;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #FF6B35;
      margin-bottom: 10px;
    }
    h1 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .url {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .analysis {
      background-color: #f9f9f9;
      border-left: 4px solid #FF6B35;
      padding: 20px;
      margin: 20px 0;
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 1.8;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 12px;
    }
    .cta-button {
      display: inline-block;
      background-color: #FF6B35;
      color: white;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      margin: 20px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ConvertFix</div>
      <h1>${isPl ? '🎯 Twój audyt jest gotowy!' : '🎯 Your audit is ready!'}</h1>
    </div>

    <p>${isPl
      ? `Dzięki za zamówienie audytu! Przeanalizowaliśmy Twoją landing page i mamy dla Ciebie konkretne wskazówki.`
      : `Thanks for ordering an audit! We've analyzed your landing page and have specific recommendations for you.`
    }</p>

    <div class="url">
      <strong>${isPl ? 'Audytowana strona:' : 'Audited page:'}</strong> ${job.url}
    </div>

    <div class="analysis">${analysis}</div>

    <p>${isPl
      ? `<strong>Co dalej?</strong><br>
      1. Przeczytaj uważnie rekomendacje<br>
      2. Zacznij od Top 3 najważniejszych błędów<br>
      3. Wdróż zmiany i przetestuj<br>
      4. Potrzebujesz pomocy? Napisz do nas!`
      : `<strong>What's next?</strong><br>
      1. Read the recommendations carefully<br>
      2. Start with the Top 3 critical issues<br>
      3. Implement changes and test<br>
      4. Need help? Write to us!`
    }</p>

    <div class="footer">
      <p>ConvertFix - Landing Page Audits<br>
      <a href="https://www.convertfix.app">www.convertfix.app</a></p>

      <p style="margin-top: 20px;">
        ${isPl
          ? 'Pytania? Odpowiedz na tego maila lub napisz na support@convertfix.app'
          : 'Questions? Reply to this email or write to support@convertfix.app'
        }
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Wrap handler with QStash signature verification
export const POST = verifySignatureAppRouter(handler);

// Export config for QStash
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max (for OpenAI API call)
