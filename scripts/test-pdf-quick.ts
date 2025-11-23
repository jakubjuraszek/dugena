import { generatePDF } from '../lib/pdf-generator';
import { writeFileSync } from 'fs';

const mockResult = {
  overallScore: 62,
  problems: [
    {
      id: 'p1',
      issue: 'Weak headline without clear value proposition',
      impact: 'Losing 35% of visitors who bounce without understanding what you offer',
      fix: 'Transform headline to outcome-focused format: "[Desired Result] in [Timeframe] without [Common Pain]"',
      beforeExample: 'Your headline says: "Modern software development"',
      afterExample: 'Transform your development process with 30% faster issue resolution and seamless project delivery',
      priority: 'P0' as const,
      category: 'Messaging'
    },
    {
      id: 'p2',
      issue: 'Missing social proof above fold',
      impact: 'Trust signals appear too late - most visitors scroll past without seeing credibility',
      fix: 'Add prominent logo wall or metric ("Join 2,847 product teams") within first 500px',
      beforeExample: 'No visible social proof in hero section',
      afterExample: '"Trusted by 2,847+ product teams at Google, Stripe, and Shopify"',
      priority: 'P0' as const,
      category: 'Trust'
    },
    {
      id: 'p3',
      issue: 'Generic CTA text lacks urgency',
      impact: 'Weak calls-to-action reduce click-through by 20-30%',
      fix: 'Use outcome-driven CTA: "Start [Desired Outcome]" instead of generic "Get Started"',
      beforeExample: 'Button says: "Get Started"',
      afterExample: '"Start building faster" or "See your first insight in 60 seconds"',
      priority: 'P0' as const,
      category: 'CTA'
    },
  ],
  quickWins: [
    {
      change: "Add 'No credit card required' text directly under the CTA button (gray text, 14px). Expected lift: +15% clicks",
      effort: '5 min' as const,
      impact: 'high' as const
    },
    {
      change: 'Change CTA button color from gray (#666666) to high-contrast orange (#FF6B2C) or green (#10B981). Expected lift: +8% visibility',
      effort: '5 min' as const,
      impact: 'medium' as const
    },
    {
      change: "Add specific social proof number above headline: '2,847 founders already using Linear'. Expected lift: +7% trust",
      effort: '20 min' as const,
      impact: 'high' as const
    },
  ],
};

async function main() {
  console.log('📄 Generating test PDF with all fixes...\n');

  const buffer = await generatePDF('https://example.com', mockResult, 'professional', 'en');
  writeFileSync('test-report-final.pdf', buffer);

  console.log('✅ PDF generated: test-report-final.pdf');
  console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB\n`);
}

main().catch(console.error);
