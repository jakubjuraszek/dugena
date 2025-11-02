'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Mail, Send } from 'lucide-react';

/**
 * CONTACT PAGE
 *
 * DESIGN:
 * - Dark theme matching site style (bg-background)
 * - Simple form: Name, Email, Message
 * - Email info section with support@convertfix.app
 * - Orange accents on buttons and links
 * - Mobile responsive
 */

export default function ContactPage() {
  const t = useTranslations('contact');
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // For now, just simulate form submission
    // In production, you'd send this to an API endpoint
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="relative min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back to Home Link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-muted hover:text-primary transition-colors mb-8"
        >
          ← {t('title')}
        </Link>

        {/* Page Header */}
        <header className="mb-12 border-b border-border pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t('title')}
          </h1>
          <p className="text-muted text-lg">
            {t('subtitle')}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-primary" />
              {t('formTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  {t('nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('namePlaceholder')}
                  required
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  {t('emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('emailPlaceholder')}
                  required
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  {t('messageLabel')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('messagePlaceholder')}
                  required
                  rows={6}
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-md transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === 'submitting' ? t('submitting') : t('submitButton')}
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="bg-accent-success/10 border border-accent-success text-accent-success rounded-md p-4 text-sm">
                  {t('successMessage')}
                </div>
              )}

              {status === 'error' && (
                <div className="bg-accent-warning/10 border border-accent-warning text-accent-warning rounded-md p-4 text-sm">
                  {t('errorMessage')}
                </div>
              )}
            </form>
          </div>

          {/* Email Info Section */}
          <div className="flex flex-col gap-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-primary" />
                {t('orEmailTitle')}
              </h2>

              <p className="text-muted mb-6">
                {t('subtitle')}
              </p>

              <a
                href={`mailto:${t('emailAddress')}`}
                className="inline-block bg-gradient-to-b from-[#2a2a2a] to-[#222222] border border-primary hover:border-primary-light text-primary hover:text-primary-light font-bold py-3 px-6 rounded-md transition-all hover:scale-[1.02]"
              >
                {t('emailAddress')}
              </a>

              <p className="text-sm text-muted mt-6">
                {t('responseTime')}
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-b from-[#222222] to-[#1a1a1a] border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                ConvertFix
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {locale === 'en'
                  ? 'AI-powered landing page audits in 60 seconds. Made by a founder, for founders.'
                  : 'Audyty landing page z AI w 60 sekund. Stworzony przez foundera, dla founderów.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <footer className="mt-16 pt-8 border-t border-border">
          <nav className="flex flex-wrap gap-6 text-sm text-muted justify-center">
            <Link href={`/${locale}/terms`} className="hover:text-primary transition-colors">
              {locale === 'en' ? 'Terms of Service' : 'Warunki Usługi'}
            </Link>
            <span className="text-border">·</span>
            <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">
              {locale === 'en' ? 'Privacy Policy' : 'Polityka Prywatności'}
            </Link>
            <span className="text-border">·</span>
            <Link href={`/${locale}/refund`} className="hover:text-primary transition-colors">
              {locale === 'en' ? 'Refund Policy' : 'Polityka Zwrotów'}
            </Link>
            <span className="text-border">·</span>
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {locale === 'en' ? 'Back to Home' : 'Wróć do Strony Głównej'}
            </Link>
          </nav>

          <p className="text-center text-muted text-sm mt-6">
            © 2025 ConvertFix. {locale === 'en' ? 'All rights reserved.' : 'Wszelkie prawa zastrzeżone.'}
          </p>
        </footer>
      </div>
    </main>
  );
}
