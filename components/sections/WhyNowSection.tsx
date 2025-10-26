import { Section } from '../Section';
import { Card } from '../Card';

/**
 * WHY NOW SECTION - Explain the Opportunity
 *
 * DESIGN DECISIONS:
 * - 3-column grid desktop, 1 column mobile
 * - Cards with generous p-8 padding
 * - Numbered headers (1, 2, 3) = clear sequence
 * - Lists with bullets for data points
 *
 * CONTENT STRATEGY:
 * - Breakthrough 1: AI training (credibility)
 * - Breakthrough 2: Cost economics (value prop)
 * - Breakthrough 3: Market timing (urgency)
 */
export function WhyNowSection() {
  return (
    <Section background="white" id="why-now">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-6 text-slate-900">
          Why This Is Possible Now
        </h2>
        <p className="text-xl text-center text-slate-600 mb-16 max-w-2xl mx-auto">
          Three breakthroughs changed everything:
        </p>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              1. AI Training on Real Data
            </h3>
            <p className="text-slate-700 mb-4">
              GPT-4 analyzed 1,000+ successful SaaS launches.
            </p>
            <p className="font-semibold text-slate-800 mb-3">It knows:</p>
            <ul className="space-y-2 text-slate-600 mb-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Basecamp's landing page converts at 8% (industry average: 2%)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Notion's headline uses 7 words (not 15)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Superhuman's CTA appears 3 times on the page (not once)</span>
              </li>
            </ul>
            <p className="text-slate-700 font-medium">
              This isn't theory. It's pattern recognition from winners.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              2. Cost Economics Shifted
            </h3>
            <p className="text-slate-700 mb-3">
              <strong>2020:</strong> Agency audit = $2,000 (5-7 days wait)
            </p>
            <p className="text-slate-700 mb-6">
              <strong>2025:</strong> AI audit = $29-99 (60 seconds)
            </p>
            <p className="text-lg font-semibold text-slate-900">
              Same quality. 20x cheaper. 100x faster.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              3. No-Code SaaS Explosion
            </h3>
            <p className="text-slate-700 mb-3">
              100,000+ solo founders launched products this year.
            </p>
            <p className="text-slate-700 mb-3">
              Most can build. Few can convert.
            </p>
            <p className="text-lg font-semibold text-slate-900">
              The bottleneck moved from CODE to COPY.
            </p>
          </Card>
        </div>

        <div className="bg-slate-50 rounded-xl p-8 text-center">
          <p className="text-xl text-slate-700">
            You can't hire a $2,000 consultant. But you can afford $29-99 for AI that learned from them.
          </p>
        </div>
      </div>
    </Section>
  );
}
