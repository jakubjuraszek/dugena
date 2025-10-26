'use client';

import { Section } from '../Section';
import { Card } from '../Card';
import { Button } from '../Button';
import { useState } from 'react';

/**
 * PRICING SECTION - ⭐ MOST IMPORTANT
 *
 * DESIGN DECISIONS:
 * - Professional card: featured (scale-105, border-2, shadow-lg)
 * - 3-column grid desktop, stacked mobile
 * - Badge absolute positioning (top-right)
 * - Full feature lists (transparency = trust)
 * - Currency toggle for USD/PLN
 *
 * VISUAL HIERARCHY:
 * - Professional (center) is visually largest
 * - Badge draws eye immediately
 * - Price is text-4xl (highly visible)
 *
 * EMOTIONAL GOAL:
 * - Calm confidence (not aggressive)
 * - Transparent value (all features listed)
 * - Clear recommendation (MOST POPULAR badge)
 */
export function PricingSection() {
  const [currency, setCurrency] = useState<'USD' | 'PLN'>('USD');

  const prices = {
    quick: currency === 'USD' ? '$29' : '119 PLN',
    professional: currency === 'USD' ? '$49' : '199 PLN',
    premium: currency === 'USD' ? '$99' : '399 PLN',
  };

  return (
    <Section background="white" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-3xl font-bold mb-4 text-slate-900">
            Choose Your Audit
          </h2>
          <p className="text-xl text-slate-600 mb-6">
            One-time payment. No subscription. Start at {currency === 'USD' ? '$29' : '119 PLN'}.
          </p>

          {/* Currency Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currency === 'USD'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              USD $
            </button>
            <button
              onClick={() => setCurrency('PLN')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currency === 'PLN'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              PLN zł
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Audit */}
          <Card>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Quick Audit</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">{prices.quick}</span>
            </div>
            <p className="text-lg text-slate-600 mb-8">Quick insights to start</p>

            <ul className="space-y-3 mb-8 text-slate-700">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>10-point conversion analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>PDF report (5-7 pages)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Problem heatmap (P0/P1/P2)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Top 3 Quick Wins (20 min to implement)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Before/After for top 3 issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>60-second delivery</span>
              </li>
            </ul>

            <p className="text-sm text-slate-600 mb-6 italic">
              Best for: First optimization, budget-conscious founders
            </p>

            <Button variant="secondary" className="w-full">
              Get Quick Audit - {prices.quick}
            </Button>
          </Card>

          {/* Professional Audit - FEATURED */}
          <Card featured badge="⭐ MOST POPULAR">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Professional Audit</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">{prices.professional}</span>
            </div>
            <p className="text-lg text-slate-600 mb-8">Everything you need to convert</p>

            <ul className="space-y-3 mb-8 text-slate-700">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span className="font-semibold">Everything in Quick, PLUS:</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>20-point analysis (vs 10)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>PDF report (10-15 pages)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Before/After for EVERY problem</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Top 5 Quick Wins (30 min to implement)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Competitor comparison (optional, 1-3 sites)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>50% off re-test in 7 days</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Priority email support</span>
              </li>
            </ul>

            <p className="text-sm text-slate-600 mb-6 italic">
              Best for: Serious founders, existing traffic with low conversion
            </p>

            <Button variant="primary" className="w-full">
              Get Professional Audit - {prices.professional}
            </Button>
          </Card>

          {/* Premium Audit */}
          <Card>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Premium Audit</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">{prices.premium}</span>
            </div>
            <p className="text-lg text-slate-600 mb-8">Professional insights + ongoing support</p>

            <ul className="space-y-3 mb-8 text-slate-700">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span className="font-semibold">Everything in Professional, PLUS:</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>30-point deep analysis (vs 20)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>PDF report (20-25 pages)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Video Walkthrough (5-10 min screen recording)</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>3 alternative headlines</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>3 alternative CTAs</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Dedicated mobile analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>FREE re-test within 30 days</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2">✅</span>
                <span>Priority support (24h response)</span>
              </li>
            </ul>

            <p className="text-sm text-slate-600 mb-6 italic">
              Best for: High-stakes launches, complex products, teams
            </p>

            <Button variant="secondary" className="w-full">
              Get Premium Audit - {prices.premium}
            </Button>
          </Card>
        </div>

        <div className="text-center bg-slate-50 rounded-xl p-6">
          <p className="text-slate-700">
            <strong>All packages include:</strong> 30-day money-back guarantee, instant delivery, specific fix instructions
          </p>
        </div>
      </div>
    </Section>
  );
}
