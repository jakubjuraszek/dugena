import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { getTranslations, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { CurrencyProvider } from '@/components/CurrencyContext'
import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

/**
 * GENERATE METADATA - SEO per locale
 *
 * Dynamically generates page metadata based on user's locale.
 * Supports both Polish (pl) and English (en).
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
    authors: [{ name: t('authors') }],
    icons: {
      icon: [
        { url: '/icon', type: 'image/png', sizes: '32x32' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon',
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
    },
  };
}

/**
 * GENERATE STATIC PARAMS
 *
 * Pre-generates pages for all supported locales at build time.
 * Required for static export.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * ROOT LAYOUT with i18n & Currency Detection
 *
 * - Validates locale parameter
 * - Sets html lang attribute based on locale
 * - Applies font variable
 * - Provides NextIntlClientProvider with messages for Client Components
 * - Reads server-side currency cookie for zero-flash pricing
 */
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'pl' | 'en')) {
    notFound();
  }

  // Load messages for the locale
  const messages = await getMessages();

  // Read currency from cookie (set by middleware)
  const cookieStore = await cookies();
  const initialCurrency = (cookieStore.get('user-currency')?.value as 'USD' | 'PLN') || 'USD';

  return (
    <html lang={locale} className={spaceGrotesk.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider initialCurrency={initialCurrency}>
            {children}
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
