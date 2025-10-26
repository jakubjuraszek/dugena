import { Section } from '../Section';

/**
 * PROBLEM SECTION - Identify with Pain
 *
 * DESIGN DECISIONS:
 * - Blockquote: italic, border-left-4, larger text = testimonial style
 * - Pain points: List with ❌ icons (visual negative)
 * - "Fast." standalone: Bold, larger = emphasis punch
 *
 * EMOTIONAL GOAL:
 * - Empathy first (you're not alone)
 * - Articulate exact frustration
 * - Build urgency through relatability (not fake scarcity)
 */
export function ProblemSection() {
  return (
    <Section background="slate" id="problem">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-3xl font-bold mb-12 text-slate-900">
          You&apos;re not alone.
        </h2>

        <p className="text-lg text-slate-700 mb-8">
          This is the #1 frustration for solo founders:
        </p>

        <blockquote className="text-2xl md:text-xl italic text-slate-600 border-l-4 border-blue-600 pl-6 py-4 mb-12 text-left">
          &quot;I spent months building. My landing page gets 100 visitors and 0 sign-ups.&quot;
        </blockquote>

        <p className="text-2xl md:text-xl font-semibold text-slate-900 mb-3">
          The problem isn&apos;t your product.
        </p>
        <p className="text-2xl md:text-xl font-semibold text-slate-900 mb-16">
          It&apos;s your landing page.
        </p>

        <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
          <h3 className="text-2xl md:text-xl font-semibold mb-6 text-slate-900">
            But you don&apos;t have time to:
          </h3>
          <ul className="text-left space-y-4 text-lg text-slate-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-3 text-xl">❌</span>
              <span>Learn conversion optimization (40+ hours)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-3 text-xl">❌</span>
              <span>Hire a consultant ($800-2000)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-3 text-xl">❌</span>
              <span>Guess and test endlessly</span>
            </li>
          </ul>
        </div>

        <p className="text-lg text-slate-700 mb-6">
          You need someone to tell you EXACTLY what to fix.
        </p>

        <p className="text-4xl md:text-3xl font-bold text-slate-900">
          Fast.
        </p>
      </div>
    </Section>
  );
}
