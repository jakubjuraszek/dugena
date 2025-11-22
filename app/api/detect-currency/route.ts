import { NextResponse } from 'next/server';

// Mark as dynamic route (uses request.headers)
export const dynamic = 'force-dynamic';

/**
 * GEO-DETECTION API - Detect user currency (USD/PLN)
 *
 * IMPLEMENTATION:
 * - Uses Vercel geo headers (x-vercel-ip-country)
 * - No external API calls, no rate limits
 * - Returns PLN for Poland, USD for everyone else
 * - Fallback to USD if header not available (local dev)
 *
 * USAGE:
 * - Called client-side on mount via CurrencyContext
 * - Updates currency state across all sections
 */
export async function GET(request: Request) {
  try {
    // Get country from Vercel geo headers
    const country = request.headers.get('x-vercel-ip-country');

    // Determine currency based on country
    const currency = country === 'PL' ? 'PLN' : 'USD';

    return NextResponse.json({
      currency,
      detected: !!country,
      country: country || 'unknown',
    });
  } catch (error) {
    console.error('Currency detection error:', error);
    // Fallback to USD on error
    return NextResponse.json({ currency: 'USD', detected: false, country: 'unknown' });
  }
}
