import { Section } from '../Section';
import { CheckCircle } from 'lucide-react';

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
      title: '✅ "I&apos;m pre-launch (no traffic yet)"',
      emphasis: 'Perfect.',
      content: `Fix your page BEFORE you spend on ads. Most founders waste $500-2000 on traffic to a broken page. You&apos;ll spend $29-99 to fix it first.`
    },
    {
      title: '✅ "I have traffic but zero conversions"',
      emphasis: 'This is literally your use case.',
      content: `We&apos;ll pinpoint what&apos;s killing conversions: Unclear headline? Weak CTA? No social proof? You&apos;ll know in 60 seconds.`
    },
    {
      title: '✅ "I&apos;m not technical"',
      emphasis: 'Even better.',
      content: `Report shows EXACTLY what to change: &quot;Change headline from [this] to [that]&quot; &quot;Move CTA button from [here] to [there]&quot; No coding. Just copy-paste.`
    },
    {
      title: '✅ "My product is complex/B2B/niche"',
      emphasis: 'AI trained on 1,000+ pages.',
      content: `Including: Enterprise SaaS, DevTools, Fintech, Health Tech. It&apos;s seen your niche. It knows your buyers.`
    },
    {
      title: '✅ "I tried free tools already"',
      emphasis: 'Free tools give generic scores.',
      content: `We give specific fixes: &quot;Your headline is 23 words. Shorten to 7 words like Notion.&quot; That&apos;s the difference.`
    }
  ];

  return (
    <Section background="background" id="this-works">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-6 text-white tracking-tight">
          This Works For You
        </h2>
        <p className="text-xl text-center text-white leading-relaxed mb-16">
          Even if you think your case is different:
        </p>

        <div className="space-y-8">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-card border border-medium rounded p-8 shadow-lg transition-colors hover:bg-cardHover hover:shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-accent-success flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span>{scenario.title.replace('✅ ', '')}</span>
              </h3>
              <p className="text-lg text-white leading-relaxed">
                <strong className="text-white">{scenario.emphasis}</strong> {scenario.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
