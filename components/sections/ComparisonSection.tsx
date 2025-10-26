import { Section } from '../Section';
import { Star } from 'lucide-react';

/**
 * COMPARISON TABLE SECTION
 *
 * DESIGN DECISIONS:
 * - Table with responsive overflow-x scroll on mobile
 * - Highlight rows (bg-blue-50) for our products
 * - Featured row (Professional) with border-left-4
 * - Clear typography with good spacing
 */
export function ComparisonSection() {
  return (
    <Section background="slate" id="comparison">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-16 text-slate-900">
          How We Compare
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Option</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Time</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Cost</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">What You Get</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 text-slate-700">Free tools (Fibr, VWO)</td>
                <td className="px-6 py-4 text-slate-700">5 min</td>
                <td className="px-6 py-4 text-slate-700">$0</td>
                <td className="px-6 py-4 text-slate-600">Generic feedback, lead gen trap</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-6 py-4 font-semibold text-slate-900">Quick Audit</td>
                <td className="px-6 py-4 text-slate-700">60 sec</td>
                <td className="px-6 py-4 text-slate-700">$29</td>
                <td className="px-6 py-4 text-slate-700">10-point AI analysis, specific fixes</td>
              </tr>
              <tr className="bg-blue-50 border-l-4 border-blue-600">
                <td className="px-6 py-4 font-bold text-slate-900">
                  <span className="inline-flex items-center gap-1">
                    Professional Audit <Star className="w-4 h-4 inline" fill="currentColor" />
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700">60 sec</td>
                <td className="px-6 py-4 text-slate-700">$49</td>
                <td className="px-6 py-4 text-slate-700">20 points + competitors + re-test</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-6 py-4 font-semibold text-slate-900">Premium Audit</td>
                <td className="px-6 py-4 text-slate-700">90 sec</td>
                <td className="px-6 py-4 text-slate-700">$99</td>
                <td className="px-6 py-4 text-slate-700">30 points + video + copy + mobile</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-700">Freelancer (Upwork)</td>
                <td className="px-6 py-4 text-slate-700">3-5 hours</td>
                <td className="px-6 py-4 text-slate-700">$200-500</td>
                <td className="px-6 py-4 text-slate-600">Human review, 2-5 days wait</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-700">Agency</td>
                <td className="px-6 py-4 text-slate-700">5-7 days</td>
                <td className="px-6 py-4 text-slate-700">$800-2000</td>
                <td className="px-6 py-4 text-slate-600">Comprehensive, slow, expensive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
