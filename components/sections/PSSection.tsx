import { Section } from '../Section';

/**
 * P.S. SECTION - Personal Note
 *
 * DESIGN DECISIONS:
 * - bg-slate-50 box = intimate, personal feel
 * - Italic for introspection
 * - Signature right-aligned
 * - Max-width 2xl for readability
 *
 * EMOTIONAL GOAL:
 * - Human connection
 * - Founder-to-founder empathy
 * - Final trust builder
 */
export function PSSection() {
  return (
    <Section background="elevated" id="ps">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded p-12 shadow-sm border border-border">
          <div className="space-y-6 text-lg text-white leading-relaxed">
            <p>
              <strong className="text-foreground">P.S.</strong> – If you&apos;re still reading, you&apos;re the type of founder I built this for:
            </p>

            <p className="italic">
              You don&apos;t want hype. You want clarity.<br />
              You don&apos;t want to guess. You want data.<br />
              You don&apos;t want to waste time. You want to ship and iterate.
            </p>

            <p>
              $29-99 is less than a dinner. But it might unlock $10k in revenue.
            </p>

            <p className="text-xl font-semibold text-foreground">
              The decision is yours.
            </p>

            <hr className="border-border my-8" />

            <p>
              <strong className="text-foreground">P.P.S.</strong> – I built this after getting 0 sign-ups on my own landing page.
            </p>

            <p className="italic">
              7 years coding. Zero marketing skills.
            </p>

            <p>
              I needed feedback that didn&apos;t cost $800 or take a week.
            </p>

            <p>
              So I built this tool for myself and now I&apos;m sharing it with you.
            </p>

            <p className="font-medium text-foreground">
              No BS. Just a tool that helps you convert.
            </p>

            <p className="text-right text-xl font-semibold text-foreground mt-8">
              – Jakub
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
