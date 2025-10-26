import { Section } from '../Section';

/**
 * THIS WORKS FOR YOU SECTION - Address Objections
 *
 * DESIGN DECISIONS:
 * - Vertical list (not grid) = easier mobile reading
 * - Green checkmark headers = positive framing
 * - Bold "Perfect/This is/Even better" = confidence
 *
 * CONTENT STRATEGY:
 * - Pre-empt 5 common objections
 * - Flip each into a benefit
 */
export function ThisWorksSection() {
  const scenarios = [
    {
      title: '✅ "I\'m pre-launch (no traffic yet)"',
      emphasis: 'Perfect.',
      content: `Fix your page BEFORE you spend on ads. Most founders waste $500-2000 on traffic to a broken page. You'll spend $29-99 to fix it first.`
    },
    {
      title: '✅ "I have traffic but zero conversions"',
      emphasis: 'This is literally your use case.',
      content: `We'll pinpoint what's killing conversions: Unclear headline? Weak CTA? No social proof? You'll know in 60 seconds.`
    },
    {
      title: '✅ "I\'m not technical"',
      emphasis: 'Even better.',
      content: `Report shows EXACTLY what to change: "Change headline from [this] to [that]" "Move CTA button from [here] to [there]" No coding. Just copy-paste.`
    },
    {
      title: '✅ "My product is complex/B2B/niche"',
      emphasis: 'AI trained on 1,000+ pages.',
      content: `Including: Enterprise SaaS, DevTools, Fintech, Health Tech. It's seen your niche. It knows your buyers.`
    },
    {
      title: '✅ "I tried free tools already"',
      emphasis: 'Free tools give generic scores.',
      content: `We give specific fixes: "Your headline is 23 words. Shorten to 7 words like Notion." That's the difference.`
    }
  ];

  return (
    <Section background="slate" id="this-works">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-6 text-slate-900">
          This Works For You
        </h2>
        <p className="text-xl text-center text-slate-600 mb-16">
          Even if you think your case is different:
        </p>

        <div className="space-y-8">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-emerald-600">
                {scenario.title}
              </h3>
              <p className="text-lg text-slate-700">
                <strong className="text-slate-900">{scenario.emphasis}</strong> {scenario.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
