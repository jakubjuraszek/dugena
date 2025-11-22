'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * CURRENCY CONTEXT - Global Currency State with Server-Side Detection
 *
 * PURPOSE:
 * - Provides global currency state across all sections
 * - Uses server-detected currency from middleware (zero-flash!)
 * - Synchronizes currency across Hero, Pricing, Comparison, FinalCTA, etc.
 *
 * BEHAVIOR:
 * - Initial: Uses server-detected currency from cookie (instant, no flash)
 * - Background: Optional verification via API (silent, only updates if changed)
 * - All sections use the same currency state
 */

type Currency = 'USD' | 'PLN';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
  initialCurrency: Currency;
}

export function CurrencyProvider({ children, initialCurrency }: CurrencyProviderProps) {
  // Use server-detected currency (zero flash!)
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Optional: Background verification (silent, no UI change unless necessary)
  useEffect(() => {
    const verifyCurrency = async () => {
      try {
        const response = await fetch('/api/detect-currency');
        if (response.ok) {
          const data = await response.json();
          // Only update if different from server-detected currency
          if (data.currency !== currency) {
            setCurrency(data.currency as Currency);
            // Update cookie to reflect new detection
            document.cookie = `user-currency=${data.currency}; max-age=31536000; path=/; samesite=lax`;
          }
        }
      } catch (error) {
        console.error('Currency verification failed:', error);
        // Keep using server-detected currency (no change)
      }
    };

    // Silent verification - doesn't affect initial render
    verifyCurrency();
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
