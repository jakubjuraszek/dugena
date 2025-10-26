# 🚀 Quick Start Guide

## Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14.2.24
- React 18.3.1
- TypeScript 5.6.3
- Tailwind CSS 3.4.16
- Lucide React 0.462.0

### Step 2: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Check the Landing Page

You should see:
1. ✅ Hero section with "You built a product. Nobody's converting."
2. ✅ All 14 sections scrolling down
3. ✅ Pricing cards with currency toggle (USD/PLN)
4. ✅ Responsive mobile layout
5. ✅ Smooth scroll navigation

### Step 4: Test Currency Detection

The page automatically detects your location and shows USD or PLN.
- Click the currency toggle buttons at the top of Pricing section
- Prices update: $29/$49/$99 ↔ 119/199/399 PLN

---

## 📁 Project Structure

```
dugena/
├── app/
│   ├── api/
│   │   └── detect-currency/route.ts  # Geo-detection API
│   ├── globals.css                    # Global styles + Tailwind
│   ├── layout.tsx                     # Root layout + metadata
│   └── page.tsx                       # Main landing page
├── components/
│   ├── Button.tsx                     # Reusable button (Primary/Secondary)
│   ├── Card.tsx                       # Reusable card (with featured variant)
│   ├── Section.tsx                    # Section wrapper (consistent spacing)
│   └── sections/                      # All 14 landing page sections
│       ├── HeroSection.tsx
│       ├── ProblemSection.tsx
│       ├── WhyNowSection.tsx
│       ├── ThisWorksSection.tsx
│       ├── PricingSection.tsx         # ⭐ Main conversion driver
│       ├── ComparisonSection.tsx
│       ├── TransformationSection.tsx
│       ├── SocialProofSection.tsx
│       ├── HowItWorksSection.tsx
│       ├── FAQSection.tsx
│       ├── BetaPricingSection.tsx
│       ├── FinalCTASection.tsx
│       ├── PSSection.tsx
│       └── Footer.tsx
├── public/                            # Static assets (images, favicon)
├── package.json                       # Dependencies
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # Full documentation
```

---

## 🎨 Design System Reference

### Colors (Tailwind Classes)
```tsx
// Primary CTA
bg-blue-600 hover:bg-blue-700

// Text
text-slate-900  // Headings
text-slate-700  // Body
text-slate-600  // Secondary text
text-slate-500  // Tertiary text

// Backgrounds
bg-white        // Main sections
bg-slate-50     // Alternating sections

// Success/Accent
text-emerald-500  // Checkmarks
bg-emerald-50     // Success boxes
```

### Typography
```tsx
// Headings
text-5xl font-bold  // h1 (Hero)
text-4xl font-bold  // h2 (Section headings)
text-2xl font-bold  // h3 (Card headings)

// Body
text-xl             // Large body text
text-lg             // Default body text
text-sm             // Small text
```

### Spacing
```tsx
// Sections
py-24   // Desktop vertical padding
py-16   // Mobile vertical padding

// Cards
p-8     // Internal padding

// Between elements
mb-8    // Small gap
mb-12   // Medium gap
mb-16   // Large gap
```

---

## 🔧 Common Tasks

### Update Pricing

Edit [components/sections/PricingSection.tsx](components/sections/PricingSection.tsx):

```tsx
const prices = {
  quick: currency === 'USD' ? '$29' : '119 PLN',
  professional: currency === 'USD' ? '$49' : '199 PLN',
  premium: currency === 'USD' ? '$99' : '399 PLN',
};
```

### Change Hero Headline

Edit [components/sections/HeroSection.tsx](components/sections/HeroSection.tsx):

```tsx
<h1 className="...">
  Your new headline here
</h1>
```

### Add Stripe Payment Links

Update Button `href` props in PricingSection.tsx:

```tsx
<Button variant="primary" href="https://buy.stripe.com/your-link-here">
  Get Professional Audit - {prices.professional}
</Button>
```

### Update Beta Counter

Edit [components/sections/BetaPricingSection.tsx](components/sections/BetaPricingSection.tsx):

```tsx
<p className="text-lg">
  ⏰ <strong>87 / 100 spots taken</strong> {/* Update this number */}
</p>
```

Later: Connect to Stripe API to auto-update.

---

## 📊 Testing Checklist

### Visual Check
- [ ] Hero headline is clear and bold
- [ ] Pricing section has Professional card featured (larger, blue border)
- [ ] Currency toggle works (USD ↔ PLN)
- [ ] Footer shows "Built in Wrocław, Poland 🇵🇱"
- [ ] All sections have proper spacing (not cramped)

### Responsive Check
```bash
# Open dev tools (F12)
# Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
# Test these sizes:
- iPhone SE (375px width)
- iPhone 14 (390px width)
- iPad (768px width)
- Desktop (1280px+ width)
```

- [ ] Pricing cards stack on mobile
- [ ] Buttons are full-width on mobile
- [ ] Text is readable without zoom
- [ ] No horizontal scroll

### Functionality Check
- [ ] All anchor links work (#pricing, #faq, etc.)
- [ ] Hover states work on buttons/cards
- [ ] Currency toggle updates all prices
- [ ] Smooth scroll works

---

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# When happy, deploy to production
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. Push to GitHub:
```bash
git add .
git commit -m "Complete landing page"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Click "Deploy"

Vercel auto-detects Next.js and configures everything.

---

## 🐛 Troubleshooting

### "Module not found: Can't resolve '@/components/...'"

**Fix:** Run `npm install` to ensure all dependencies are installed.

### Tailwind classes not working

**Fix:**
1. Check `tailwind.config.ts` includes correct content paths
2. Restart dev server: `npm run dev`

### Currency detection not working locally

**Reason:** ipapi.co can't detect localhost IP.

**Fix:** Currency toggle works manually. On production (Vercel), auto-detection will work.

### Build errors about TypeScript

**Fix:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Next Steps After Launch

1. **Add Google Analytics:**
   - Get GA4 tracking ID
   - Add to `app/layout.tsx`

2. **Integrate Stripe:**
   - Create Stripe account
   - Generate payment links
   - Update Button `href` props

3. **Collect Testimonials:**
   - Update `SocialProofSection.tsx`
   - Replace placeholder with real quotes

4. **Monitor Performance:**
   ```bash
   # Run Lighthouse
   npm run build
   npm start
   # Open Chrome DevTools > Lighthouse > Run audit
   ```

5. **A/B Test Headlines:**
   - Try 3 variations of hero headline
   - Use Vercel Analytics or Google Optimize

---

## 💡 Tips for Success

1. **Don't over-optimize before launch**
   - Ship at 80% quality
   - Iterate based on real user feedback

2. **Focus on conversion metrics**
   - Track clicks on pricing CTAs
   - Monitor scroll depth (are people reading?)
   - A/B test one thing at a time

3. **Keep the calm aesthetic**
   - Resist urge to add countdown timers
   - No pop-ups or aggressive tactics
   - Trust the "bootstrapper-to-bootstrapper" vibe

4. **Update honestly**
   - If beta counter reaches 100, either increase or remove
   - Add real testimonials as they come
   - Update FAQ based on actual questions

---

**You're ready to launch! 🚀**

Questions? Check [README.md](README.md) for full documentation.
