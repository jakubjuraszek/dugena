# ConvertFix Email Templates

Premium, dark-themed email templates for ConvertFix audit delivery.

## Design Philosophy

- **Dark theme**: Professional #0a0a0a / #1a1a1a background
- **Sharp corners**: No border-radius (anti-rounded, modern aesthetic)
- **System fonts**: -apple-system, BlinkMacSystemFont, Segoe UI
- **Minimalist**: Lots of whitespace, clean hierarchy
- **Mobile-first**: Responsive tables, 600px max width
- **Email client compatible**: Inline styles, tested for Gmail/Outlook/Apple Mail

## Templates

### 1. `audit-ready.html`
Main HTML email template with:
- Fixed header with ConvertFix branding
- Hero section with personalized URL
- Quick stats preview (issues, quick wins, impact)
- Prominent CTA button
- "What's next" action steps
- Minimal footer

### 2. `audit-ready.txt`
Plain text fallback for email clients that don't support HTML.

### 3. `types.ts`
TypeScript types for template data:
```typescript
interface AuditEmailData {
  url: string;
  issueCount: number;
  criticalCount: number;
  quickWinsCount: number;
  impactPercent: number;
  ctaUrl: string;
}
```

## Usage with Resend

### Basic Usage (New Template)

```typescript
import { sendAuditEmail } from '@/lib/email';

await sendAuditEmail({
  to: 'customer@example.com',
  tier: 'professional',
  pdfBuffer: auditPdfBuffer,
  url: 'https://example.com',
  stats: {
    issueCount: 12,
    criticalCount: 3,
    quickWinsCount: 5,
    impactPercent: 42,
  },
});
```

### Legacy Template (Backwards Compatible)

If you don't provide `stats`, it falls back to the original light-themed template:

```typescript
await sendAuditEmail({
  to: 'customer@example.com',
  tier: 'quick',
  pdfBuffer: auditPdfBuffer,
  url: 'https://example.com',
  // No stats = legacy template
});
```

## Integration Example

### Complete Flow with PDF Attachment

```typescript
import { sendAuditEmail } from '@/lib/email';
import { generatePDF } from '@/lib/pdf-generator';
import { analyzeQuick } from '@/lib/ai-analyzer';

// 1. Analyze landing page
const analysis = await analyzeQuick(scrapedData);

// 2. Generate PDF report
const pdfBuffer = await generatePDF(
  'https://example.com',
  analysis,
  'quick',
  'en'
);

// 3. Send email with new dark template
await sendAuditEmail({
  to: 'customer@example.com',
  tier: 'quick',
  pdfBuffer,
  url: 'https://example.com',
  stats: {
    issueCount: analysis.problems.length,
    criticalCount: analysis.problems.filter(p => p.severity === 'critical').length,
    quickWinsCount: analysis.quickWins.length,
    impactPercent: 35, // Calculate based on your logic
  },
});
```

## Customizing Templates

### Changing Colors

Edit `audit-ready.html` and update these inline styles:

```css
/* Main backgrounds */
background-color: #0a0a0a; /* Outer wrapper */
background-color: #1a1a1a; /* Email container */
background-color: #0f0f0f; /* Header/footer/stats */

/* Accent color */
background-color: #d55a0a; /* ConvertFix orange (CTA, borders) */
color: #d55a0a; /* Accent text */

/* Text colors */
color: #ffffff; /* Primary text */
color: #a3a3a3; /* Secondary text */
color: #737373; /* Muted text */
color: #525252; /* Footer text */
```

### Changing CTA Link

The CTA button currently links to `#` (no action). Update in `lib/email.ts`:

```typescript
const templateData: AuditEmailData = {
  url,
  issueCount: stats.issueCount,
  criticalCount: stats.criticalCount,
  quickWinsCount: stats.quickWinsCount,
  impactPercent: stats.impactPercent,
  ctaUrl: 'https://yourdomain.com/dashboard', // ← Change this
};
```

Or make it dynamic per email:

```typescript
export interface AuditEmail {
  to: string;
  tier: 'quick' | 'professional';
  pdfBuffer: Buffer;
  url: string;
  ctaUrl?: string; // Optional custom CTA URL
  stats?: { /* ... */ };
}
```

## Email Client Testing

### Tested and Working
- ✅ Gmail (web, iOS, Android)
- ✅ Apple Mail (macOS, iOS)
- ✅ Outlook (web, desktop, mobile)
- ✅ Thunderbird
- ✅ ProtonMail

### Design Considerations
- **Inline styles**: All CSS is inline for maximum compatibility
- **Table-based layout**: Flexbox/Grid not supported in email
- **System fonts**: No external font loading (faster, more reliable)
- **No external images**: Text-only logo (no broken images)
- **Plain text fallback**: Included for accessibility

## Environment Variables

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your API key from [Resend Dashboard](https://resend.com/api-keys).

## Resend Configuration

### Current Setup
```typescript
from: 'ConvertFix <onboarding@resend.dev>'
```

### Production Setup (Custom Domain)

1. Add domain in [Resend Dashboard](https://resend.com/domains)
2. Verify DNS records
3. Update `lib/email.ts`:

```typescript
from: 'ConvertFix <audit@convertfix.com>'
```

## Advanced: React Email (Alternative)

If you want more maintainable templates, consider migrating to React Email:

```bash
npm install react-email @react-email/components
```

Create `lib/email-templates/AuditReady.tsx`:
```tsx
import { Html, Head, Body, Container, Section, Text } from '@react-email/components';

export default function AuditReady({ url, issueCount }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0a' }}>
        <Container>
          <Section>
            <Text>Your audit is ready for {url}!</Text>
            <Text>Found {issueCount} issues.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

Then render:
```typescript
import { render } from '@react-email/render';
import AuditReady from './email-templates/AuditReady';

const html = render(<AuditReady url={url} issueCount={12} />);
```

## Troubleshooting

### Template not found error
Make sure templates are in the correct directory:
```
lib/
  email-templates/
    audit-ready.html
    audit-ready.txt
    types.ts
  email.ts
```

### Styles not rendering
Email clients strip `<style>` tags. All CSS must be inline. Our templates already use inline styles.

### PDF not attaching
Ensure `pdfBuffer` is a Node.js `Buffer`:
```typescript
const pdfBuffer = await generatePDF(...); // Returns Buffer
```

### Email not sending
Check Resend API key:
```bash
echo $RESEND_API_KEY
```

Check Resend logs: [resend.com/logs](https://resend.com/logs)

## Example: Update Worker to Use New Template

Update `app/api/workers/process-audit/route.ts`:

```typescript
// After generating PDF...
await sendAuditEmail({
  to: job.email,
  tier: job.tier,
  pdfBuffer,
  url: job.url,
  stats: {
    issueCount: result.problems.length,
    criticalCount: result.problems.filter(p => p.severity === 'critical').length,
    quickWinsCount: result.quickWins.length,
    impactPercent: calculateImpact(result), // Your logic
  },
});
```

## License

Part of ConvertFix. Internal use only.
