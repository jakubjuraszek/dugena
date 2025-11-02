'use client';

import { useState, FormEvent } from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function AuditPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, locale }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate PDF');
      }

      // Download PDF
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const domain = new URL(url).hostname.replace('www.', '');
      a.download = `convertfix-audit-${domain}.pdf`;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);

      // Reset form
      setUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
            Test the audit engine - Enter any landing page URL to generate a professional CRO audit PDF
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                Landing Page URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://linear.app"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-dimmed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
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
              disabled={loading || !url}
              className="w-full bg-primary hover:bg-primary-light active:bg-primary-dark text-white font-semibold px-6 py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating audit... (takes ~60 seconds)</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Generate Audit PDF</span>
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-dimmed text-center">
              Free beta testing - No payment required
            </p>
          </div>
        </div>

        {/* Example URLs */}
        <div className="mt-8 text-center">
          <p className="text-sm text-dimmed mb-2">Try these examples:</p>
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
