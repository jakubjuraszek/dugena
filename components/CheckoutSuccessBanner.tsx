'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle, X } from 'lucide-react';

/**
 * CHECKOUT SUCCESS BANNER
 *
 * Displays a success message after successful Paddle checkout.
 * - Shows when URL contains ?checkout=success
 * - Auto-dismisses after 10 seconds
 * - User can manually dismiss
 * - Removes query param from URL on dismiss
 */
export function CheckoutSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('checkout');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if checkout success param is present
    if (searchParams.get('checkout') === 'success') {
      setIsVisible(true);

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleDismiss = () => {
    setIsVisible(false);

    // Remove query param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('checkout');
    router.replace(url.pathname + url.search, { scroll: false });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 max-w-2xl">
        {/* Success Icon */}
        <div className="flex-shrink-0">
          <CheckCircle className="w-8 h-8" />
        </div>

        {/* Message */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{t('success.title')}</h3>
          <p className="text-sm text-white/90">{t('success.message')}</p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
