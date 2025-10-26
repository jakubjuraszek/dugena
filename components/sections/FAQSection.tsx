import { Section } from '../Section';

/**
 * FAQ SECTION - 10 Detailed Questions
 *
 * DESIGN DECISIONS:
 * - Simple list layout (not accordion for simplicity)
 * - Questions bold, answers normal weight
 * - Generous spacing between items
 * - Clear, direct language
 */
export function FAQSection() {
  const faqs = [
    {
      question: 'Q: How is this different from free tools like Fibr.ai or VWO?',
      answer: `A: Free tools give you a score (72/100). We tell you EXACTLY what to fix: "Your headline is unclear. Change from 'Revolutionary Platform for Teams' to 'Slack for Remote Teams' (7 words, clear benefit)." Plus, free tools are lead magnets. You'll get sales calls. We're a product, not a lead gen funnel.`
    },
    {
      question: 'Q: Can AI really match a human consultant?',
      answer: `A: For $29-99? Yes. Our AI analyzed 1,000+ successful launches (Basecamp, Notion, Linear, Superhuman). It learned their patterns. For $2,000, a human might spend 10 hours custom-analyzing your niche. But for quick wins? AI is faster and just as accurate. Think of it as "tier 1 support" that handles 80% of cases perfectly.`
    },
    {
      question: 'Q: What if my landing page is complex/technical/B2B?',
      answer: `A: AI trained on every category: Dev Tools, Enterprise SaaS, Fintech, Health Tech, Crypto. If you're B2B SaaS, it's seen 200+ similar pages. It knows your buyers care about ROI, integrations, security. Complex = more reason to audit. Simpler pages are easier to guess. Yours needs data.`
    },
    {
      question: 'Q: How long does it take?',
      answer: `A: 60-90 seconds after you submit URL. No waiting days for a consultant. You'll have your PDF in your inbox before you finish your coffee.`
    },
    {
      question: 'Q: What if I don\'t agree with the recommendations?',
      answer: `A: Then don't implement them. We show you data-backed patterns (e.g., "Notion's headline is 7 words, yours is 23"). You decide if it applies to your case. But remember: AI analyzed 1,000+ successful launches. Patterns exist for a reason.`
    },
    {
      question: 'Q: Do I need coding skills to implement fixes?',
      answer: `A: No. 80% of fixes are copy changes: Headline: Copy-paste new text, CTA: Change button text, Social proof: Add testimonial section. 20% are layout tweaks (move CTA higher, add pricing table). If you use Webflow/Wix/Squarespace, you can click-and-drag. No coding.`
    },
    {
      question: 'Q: What\'s included in the re-test?',
      answer: `A: Professional: 50% off second audit after 7 days ($24.50 instead of $49). Premium: FREE re-audit within 30 days. Use it after implementing fixes to measure improvement.`
    },
    {
      question: 'Q: Can I get a refund?',
      answer: `A: Yes. 30-day money-back guarantee, no questions asked. Stripe refund takes 5-10 business days to appear in your account.`
    },
    {
      question: 'Q: Is this a one-time payment or subscription?',
      answer: `A: One-time. No recurring charges. Pay once, get your audit. That's it.`
    },
    {
      question: 'Q: What if I implement these changes and it still doesn\'t work?',
      answer: `A: Then you'll know it's not your landing page. It's something else (product-market fit, traffic source, pricing). That clarity is worth $29-99. Most founders waste months guessing. You'll know in 60 seconds + 1 week of testing. Plus: 30-day money-back guarantee. You risk nothing.`
    }
  ];

  return (
    <Section background="slate" id="faq">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-4 text-slate-900">
          Frequently Asked Questions
        </h2>

        <p className="text-lg text-center text-slate-600 mb-16">
          Everything you need to know about Landing Page Auditor
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-start gap-3">
                <span className="text-blue-600 flex-shrink-0">Q:</span>
                <span>{faq.question.replace('Q: ', '')}</span>
              </h3>
              <div className="text-slate-700 leading-relaxed pl-8">
                <span className="font-semibold text-slate-900">A:</span> {faq.answer.replace('A: ', '')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
