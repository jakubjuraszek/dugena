import { Section } from '../Section';

/**
 * HOW IT WORKS SECTION - 3 Simple Steps
 *
 * DESIGN DECISIONS:
 * - 3-column grid desktop, 1 column mobile
 * - Large numbered circles (text-4xl)
 * - Simple, clear language
 * - Guarantee box in green accent
 */
export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Package',
      description: 'Quick ($29), Professional ($49), or Premium ($99)'
    },
    {
      number: 2,
      title: 'Submit Your URL',
      description: 'After payment, enter your landing page URL'
    },
    {
      number: 3,
      title: 'Get Your Report',
      description: 'AI analyzes in 60 seconds. PDF delivered to your email.'
    }
  ];

  return (
    <Section background="background" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-16 text-foreground">
          How It Works
        </h2>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-white rounded-full text-4xl font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
              <p className="text-lg text-white leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded p-8 text-center border-2 border-accent-success/30">
          <p className="text-2xl font-bold text-foreground mb-2">
            30-Day Money-Back Guarantee
          </p>
          <p className="text-lg text-white leading-relaxed">
            Not happy? Full refund, no questions asked.
          </p>
        </div>
      </div>
    </Section>
  );
}
