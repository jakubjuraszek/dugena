import { NextResponse } from 'next/server';

/**
 * GEO-DETECTION API - Detect user currency (USD/PLN)
 *
 * IMPLEMENTATION:
 * - Uses ipapi.co for geo detection (free tier: 1000 req/day)
 * - Returns PLN for Poland, USD for everyone else
 * - Fallback to USD if detection fails
 *
 * USAGE:
 * - Called client-side on mount
 * - Updates currency state in PricingSection
 *
 * ALTERNATIVE (if ipapi.co limits hit):
 * - Use Vercel edge config
 * - Use CloudFlare geolocation headers
 * - Use browser language (navigator.language)
 */
export async function GET(request: Request) {
  try {
    // Get client IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '8.8.8.8'; // Fallback to Google DNS for testing

    // Call ipapi.co
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'Landing Page Auditor/1.0',
      },
    });

    if (!response.ok) {
      // Fallback to USD if API fails
      return NextResponse.json({ currency: 'USD', detected: false });
    }

    const data = await response.json();
    const currency = data.country_code === 'PL' ? 'PLN' : 'USD';

    return NextResponse.json({
      currency,
      detected: true,
      country: data.country_code,
    });
  } catch (error) {
    console.error('Currency detection error:', error);
    // Fallback to USD on error
    return NextResponse.json({ currency: 'USD', detected: false });
  }
}
