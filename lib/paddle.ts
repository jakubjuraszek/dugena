import { initializePaddle, Paddle } from '@paddle/paddle-js';

// Paddle instance (singleton pattern)
let paddleInstance: Paddle | undefined | null = null;

/**
 * Initialize Paddle.js SDK
 * Must be called before opening checkout
 */
export async function getPaddle(): Promise<Paddle | undefined | null> {
  // Return existing instance if already initialized
  if (paddleInstance) {
    return paddleInstance;
  }

  // Get environment variables
  // Paddle Billing requires client-side token (test_xxx or live_xxx)
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production';

  if (!clientToken) {
    console.error('❌ Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN');
    console.error('Get it from: https://sandbox-vendors.paddle.com/ → Developer Tools → Authentication');
    return null;
  }

  try {
    console.log(`🔧 Initializing Paddle in ${environment} mode...`);
    console.log(`🔑 Token: ${clientToken.substring(0, 10)}... (length: ${clientToken.length})`);

    // Initialize Paddle Billing SDK with client-side token
    paddleInstance = await initializePaddle({
      environment: environment || 'sandbox',
      token: clientToken,
      pwCustomer: {}, // Required for Paddle Retain - empty object for guest checkout
    });

    if (paddleInstance) {
      console.log('✅ Paddle initialized successfully');
    }

    return paddleInstance || null;
  } catch (error) {
    console.error('❌ Failed to initialize Paddle:', error);
    console.error('Make sure you have a valid Client-side token from Paddle Dashboard');
    return null;
  }
}

/**
 * Get Paddle Price ID based on tier and currency
 */
export function getPriceId(tier: 'quick' | 'professional'): string | null {
  if (tier === 'quick') {
    return process.env.NEXT_PUBLIC_QUICK_AUDIT_PRICE_ID || null;
  } else if (tier === 'professional') {
    return process.env.NEXT_PUBLIC_PROFESSIONAL_AUDIT_PRICE_ID || null;
  }
  return null;
}

/**
 * Open Paddle Checkout
 *
 * @param tier - 'quick' or 'professional'
 * @param landingPageUrl - URL of the landing page to audit
 * @param locale - User's locale ('en' or 'pl')
 * @param onSuccess - Callback on successful payment
 * @param onError - Callback on payment error
 */
export async function openPaddleCheckout(
  tier: 'quick' | 'professional',
  landingPageUrl: string,
  locale: string,
  onSuccess?: () => void,
  onError?: (error: any) => void
): Promise<void> {
  const paddle = await getPaddle();

  if (!paddle) {
    console.error('Paddle not initialized');
    onError?.(new Error('Payment system not available'));
    return;
  }

  const priceId = getPriceId(tier);

  if (!priceId) {
    console.error(`Missing price ID for tier: ${tier}`);
    onError?.(new Error('Invalid pricing configuration'));
    return;
  }

  try {
    const checkoutData = {
      items: [
        {
          priceId,
          quantity: 1,
        },
      ],
      // Paddle Billing requires 'custom' key for custom data
      custom: {
        landingPageUrl,
        tier,
        locale,
      },
      settings: {
        successUrl: `${window.location.origin}/${locale}?checkout=success`,
        // IMPORTANT: Paddle requires displayMode to be set
        displayMode: 'overlay' as const,
        theme: 'dark' as const,
        // Locale for checkout UI
        locale: locale === 'pl' ? 'pl' : 'en',
      },
    };

    console.log('🛒 Opening Paddle checkout with:', {
      priceId,
      landingPageUrl,
      tier,
      locale,
      successUrl: checkoutData.settings.successUrl,
    });

    // Open Paddle Checkout
    paddle.Checkout.open(checkoutData);

    // Call success callback after opening checkout
    // Note: Actual payment success will redirect to successUrl
    console.log('✅ Paddle checkout opened successfully');
  } catch (error) {
    console.error('❌ Failed to open Paddle Checkout:', error);
    onError?.(error);
  }
}
