import { Section } from '../Section';

/**
 * YOUR TRANSFORMATION SECTION - Timeline Journey
 *
 * DESIGN DECISIONS:
 * - Vertical timeline with left line and dots
 * - Time badges with blue background
 * - Cards for each step (ml-8 for offset)
 * - ROI note in green accent box
 *
 * EMOTIONAL GOAL:
 * - Visualize the journey (concrete steps)
 * - Show realistic timeline (builds trust)
 * - End with ROI punch (value reinforcement)
 */
export function TransformationSection() {
  const steps = [
    {
      time: '60 seconds',
      title: 'You submit your URL',
      description: 'AI scrapes your page, analyzes 10-30 points of conversion friction'
    },
    {
      time: '5 minutes',
      title: 'You read the report',
      description: 'PDF in your inbox. Skim executive summary. Identify top 3 Quick Wins.'
    },
    {
      time: '30 minutes',
      title: 'You implement fixes',
      description: 'Change headline. Strengthen CTA. Add social proof. (No coding required)'
    },
    {
      time: '1 week',
      title: 'You see results',
      description: 'Conversion rate goes 0.5% → 2% (4x improvement). 20 more signups from same 1,000 visitors'
    },
    {
      time: '1 month',
      title: 'You scale',
      description: 'With proven conversion, you confidently spend on ads. $49 audit → $5,000 in new MRR'
    }
  ];

  return (
    <Section background="white" id="transformation">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-3xl font-bold text-center mb-6 text-slate-900">
          Your Transformation
        </h2>
        <p className="text-xl text-center text-slate-600 mb-16">
          Here's what happens after you order:
        </p>

        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center mr-6">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-blue-200 mt-2" style={{minHeight: '60px'}}></div>
                )}
              </div>
              <div className="flex-1 pt-2">
                <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
                  {step.time}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900">{step.title}</h3>
                <p className="text-lg text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-8 text-center">
          <p className="text-xl font-semibold text-slate-900">
            Total time investment: 35 minutes. Total cost: $29-99. Potential return: Unlimited.
          </p>
        </div>
      </div>
    </Section>
  );
}
