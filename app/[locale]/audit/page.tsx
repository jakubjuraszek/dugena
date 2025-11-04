'use client';

import { useState, FormEvent } from 'react';
import { FileText, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function AuditPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Translations
  const translations = {
    en: {
      title: 'ConvertFix Beta',
      subtitle: 'Test the audit engine - Enter your landing page URL and email to get a professional CRO audit',
      urlLabel: 'Landing Page URL',
      urlPlaceholder: 'https://linear.app',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your@email.com',
      emailHelper: "We'll send the PDF to this email (2-3 minutes)",
      buttonIdle: 'Queue Audit',
      buttonLoading: 'Queueing audit...',
      successTitle: 'Audit Queued!',
      successMessage: 'Check your email in 2-3 minutes. The PDF will arrive shortly.',
      generateAnother: 'Generate Another Audit',
      betaInfo: 'Free beta testing - No payment required',
      tryExamples: 'Try these examples:',
    },
    pl: {
      title: 'ConvertFix Beta',
      subtitle: 'Testuj silnik audytu - Wpisz URL strony i email, aby otrzymać profesjonalny audyt CRO',
      urlLabel: 'URL Strony',
      urlPlaceholder: 'https://linear.app',
      emailLabel: 'Adres Email',
      emailPlaceholder: 'twoj@email.com',
      emailHelper: 'Wyślemy PDF na ten email (2-3 minuty)',
      buttonIdle: 'Zakolejkuj Audyt',
      buttonLoading: 'Kolejkowanie audytu...',
      successTitle: 'Audyt Zakolejkowany!',
      successMessage: 'Sprawdź email za 2-3 minuty. PDF zostanie wkrótce wysłany.',
      generateAnother: 'Wygeneruj Kolejny Audyt',
      betaInfo: 'Darmowy test beta - Bez płatności',
      tryExamples: 'Wypróbuj przykłady:',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email, locale }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to queue audit');
      }

      // Success - show confirmation message
      setSuccess(true);
      setUrl('');
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">
              ConvertFix <span className="text-primary">Beta</span>
            </h1>
          </div>
          <p className="text-muted text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-1">{t.successTitle}</h3>
                <p className="text-sm text-green-300">{t.successMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="w-full mt-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {t.generateAnother}
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                {t.urlLabel}
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.urlPlaceholder}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dimmed" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                />
              </div>
              <p className="mt-2 text-xs text-dimmed">
                {t.emailHelper}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !url || !email}
              className="w-full bg-primary hover:bg-primary-light active:bg-primary-dark text-white font-semibold px-6 py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.buttonLoading}</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>{t.buttonIdle}</span>
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-dimmed text-center">
              {t.betaInfo}
            </p>
          </div>
        </div>

        {/* Example URLs */}
        <div className="mt-8 text-center">
          <p className="text-sm text-dimmed mb-2">{t.tryExamples}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['https://linear.app', 'https://vercel.com', 'https://paddle.com'].map((exampleUrl) => (
              <button
                key={exampleUrl}
                onClick={() => setUrl(exampleUrl)}
                disabled={loading}
                className="text-sm px-3 py-1 bg-card border border-border rounded-md hover:border-primary text-muted hover:text-primary transition-colors disabled:opacity-50"
              >
                {exampleUrl.replace('https://', '')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
