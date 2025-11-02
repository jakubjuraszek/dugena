import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/Header';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

/**
 * TERMS OF SERVICE PAGE
 *
 * DESIGN:
 * - Dark theme (bg-background)
 * - Orange accents (#d55a0a) on links
 * - Max-width 800px for readability
 * - Clean typography with proper spacing
 * - Mobile responsive
 * - Markdown content rendered as HTML
 */

async function getMarkdownContent(locale: string) {
  const filePath = path.join(process.cwd(), `public/legal/terms-of-service-${locale}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const processedContent = await remark()
    .use(html)
    .process(fileContents);

  return processedContent.toString();
}

export default async function TermsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  const contentHtml = await getMarkdownContent(locale);

  return (
    <main className="relative min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back to Home Link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-muted hover:text-primary transition-colors mb-8"
        >
          {t('backToHome')}
        </Link>

        {/* Page Header */}
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t('terms.title')}
          </h1>
          <p className="text-muted text-lg">
            {t('terms.description')}
          </p>
        </header>

        {/* Markdown Content */}
        <article
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:border-b prose-h1:border-border prose-h1:pb-4
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-primary
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8
            prose-p:text-muted prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:text-muted prose-ul:my-4
            prose-ol:text-muted prose-ol:my-4
            prose-li:mb-2
            prose-code:text-accent-success prose-code:bg-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted
            prose-table:text-muted prose-table:border-collapse
            prose-th:border prose-th:border-border prose-th:bg-card prose-th:px-4 prose-th:py-2 prose-th:text-foreground
            prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
            prose-hr:border-border prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Footer Navigation */}
        <footer className="mt-16 pt-8 border-t border-border">
          <nav className="flex flex-wrap gap-6 text-sm text-muted justify-center">
            <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">
              {t('privacy.title')}
            </Link>
            <span className="text-border">·</span>
            <Link href={`/${locale}/refund`} className="hover:text-primary transition-colors">
              {t('refund.title')}
            </Link>
            <span className="text-border">·</span>
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {t('backToHome')}
            </Link>
          </nav>

          <p className="text-center text-muted text-sm mt-6">
            © 2025 ConvertFix. All rights reserved.
          </p>
          <p className="text-center text-dimmed text-sm mt-2">
            Contact: <a href="mailto:support@convertfix.app" className="text-primary hover:underline">support@convertfix.app</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
