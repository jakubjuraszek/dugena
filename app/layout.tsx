import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Landing Page Auditor - AI-Powered Conversion Analysis in 60 Seconds',
  description: 'Get a professional landing page audit in 60 seconds. AI analyzes your page and shows exactly what to fix. Starting at $29. No subscription.',
  keywords: ['landing page audit', 'conversion optimization', 'SaaS', 'AI analysis', 'CRO'],
  authors: [{ name: 'Jakub' }],
  openGraph: {
    title: 'Landing Page Auditor - Fix Your Conversions in 60 Seconds',
    description: 'AI analyzes your landing page and tells you exactly what to fix. $29-99, no subscription.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
