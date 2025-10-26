'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocale } from 'next-intl';

/**
 * CURRENCY CONTEXT - Global Currency State
 *
 * PURPOSE:
 * - Provides global currency state across all sections
 * - Auto-detects currency based on locale (pl → PLN, en → USD)
 * - Allows manual currency switching via toggle in PricingSection
 * - Synchronizes currency across Hero, Pricing, Comparison, FinalCTA, etc.
 *
 * BEHAVIOR:
 * - On mount: Sets currency based on locale
 * - User can override via currency toggle
 * - All sections use the same currency state
 */

type Currency = 'USD' | 'PLN';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  // Auto-detect currency based on locale
  const getDefaultCurrency = (): Currency => {
    return locale === 'pl' ? 'PLN' : 'USD';
  };

  const [currency, setCurrency] = useState<Currency>(getDefaultCurrency());

  // Update currency when locale changes
  useEffect(() => {
    setCurrency(getDefaultCurrency());
  }, [locale]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
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
