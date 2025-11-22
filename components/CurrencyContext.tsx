'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocale } from 'next-intl';

/**
 * CURRENCY CONTEXT - Global Currency State with Geo-Detection
 *
 * PURPOSE:
 * - Provides global currency state across all sections
 * - Auto-detects currency via /api/detect-currency (Vercel geo headers)
 * - Synchronizes currency across Hero, Pricing, Comparison, FinalCTA, etc.
 *
 * BEHAVIOR:
 * - On mount: Fetches currency from API (geo-detection)
 * - Fallback: Uses locale (pl → PLN, en → USD)
 * - All sections use the same currency state
 */

type Currency = 'USD' | 'PLN';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  // Fallback: currency based on locale
  const getLocaleCurrency = (): Currency => {
    return locale === 'pl' ? 'PLN' : 'USD';
  };

  const [currency, setCurrency] = useState<Currency>(getLocaleCurrency());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch currency from geo-detection API on mount
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch('/api/detect-currency');
        if (response.ok) {
          const data = await response.json();
          setCurrency(data.currency as Currency);
        } else {
          // Fallback to locale-based
          setCurrency(getLocaleCurrency());
        }
      } catch (error) {
        console.error('Failed to detect currency:', error);
        // Fallback to locale-based
        setCurrency(getLocaleCurrency());
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
