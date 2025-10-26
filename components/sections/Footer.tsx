/**
 * FOOTER - Simple, Minimal
 *
 * DESIGN DECISIONS:
 * - Dark background (slate-800)
 * - White/gray text
 * - Horizontal links row
 * - Simple copyright
 */
export function Footer() {
  return (
    <footer className="bg-background border-t border/50 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm">
            <a href="#faq" className="text-muted hover:text-white transition-colors">
              FAQ
            </a>
            <a href="/privacy" className="text-muted hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="mailto:hi@landingpageauditor.com" className="text-muted hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted text-sm mb-2">
              © 2025 Landing Page Auditor. Made by a founder, for founders.
            </p>
            <p className="text-[#71717a] text-sm">
              Built in Wrocław, Poland 🇵🇱
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
