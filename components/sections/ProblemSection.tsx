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
    <Section background="elevated" id="problem">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-3xl font-bold mb-12 text-white tracking-tight">
          You&apos;re not alone.
        </h2>

        <p className="text-lg text-white leading-relaxed mb-8">
          This is the #1 frustration for solo founders:
        </p>

        <blockquote className="text-2xl md:text-xl italic text-white border-l-4 border-primary pl-6 py-4 mb-12 text-left leading-relaxed">
          &quot;I spent months building. My landing page gets 100 visitors and 0 sign-ups.&quot;
        </blockquote>

        <p className="text-2xl md:text-xl font-semibold text-white mb-3">
          The problem isn&apos;t your product.
        </p>
        <p className="text-2xl md:text-xl font-semibold text-white mb-16">
          It&apos;s your landing page.
        </p>

        <div className="bg-card border border-medium rounded p-8 shadow-lg mb-12 transition-colors hover:bg-cardHover hover:shadow-xl">
          <h3 className="text-2xl md:text-xl font-semibold mb-6 text-white">
            But you don&apos;t have time to:
          </h3>
          <ul className="text-left space-y-4 text-lg text-white leading-relaxed">
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

        <p className="text-lg text-white leading-relaxed mb-6">
          You need someone to tell you EXACTLY what to fix.
        </p>

        <p className="text-4xl md:text-3xl font-bold text-white">
          Fast.
        </p>
      </div>
    </Section>
  );
}
