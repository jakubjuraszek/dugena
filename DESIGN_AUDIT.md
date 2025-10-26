# 🎨 Design Excellence Audit Checklist

Use this checklist before deploying to ensure professional quality.

---

## A. SPACING AUDIT ✅

### Sections
- [ ] All sections have `py-24` (desktop) / `py-16` (mobile)
- [ ] No sections feel "cramped" or "squeezed"
- [ ] Sections alternate white/slate-50 backgrounds
- [ ] Clear visual separation between sections

### Cards
- [ ] All cards have `p-8` internal padding
- [ ] Cards have border-slate-200 (subtle, not black)
- [ ] Featured pricing card has `scale-105` and blue border
- [ ] Hover effects work on all interactive cards

### Typography Spacing
- [ ] Headings have `mb-12` or more before content
- [ ] Paragraphs have `mb-6` to `mb-8` between them
- [ ] List items have `space-y-3` or more
- [ ] No text elements touching each other

**Fix cramped spacing:**
```tsx
// ❌ Bad
<h2 className="mb-2">Title</h2>
<p>Text</p>

// ✅ Good
<h2 className="mb-12">Title</h2>
<p>Text</p>
```

---

## B. TYPOGRAPHY AUDIT ✅

### Hierarchy
- [ ] h1 (Hero): `text-5xl` (56px) - clearly largest
- [ ] h2 (Sections): `text-4xl` (40px) - second largest
- [ ] h3 (Cards): `text-2xl` (30px) - third largest
- [ ] Body: `text-lg` (18px) - comfortable reading
- [ ] Small text: `text-sm` (14px) - footnotes only

### Readability
- [ ] All paragraphs have `max-w-2xl` or similar (65-75 chars)
- [ ] Body text has `leading-relaxed` (line-height 1.6+)
- [ ] No text blocks wider than 800px
- [ ] Headings have `leading-tight`

### Weight
- [ ] Headings: `font-bold` (700)
- [ ] Body: `font-normal` (400)
- [ ] Emphasis: `font-semibold` (600)
- [ ] No `font-light` or `font-black` used

**Check this visually:**
- Stand 2 meters from screen
- Can you still identify h1 vs h2 vs body?
- If not, increase size difference

---

## C. COLOR AUDIT ✅

### Primary Usage
- [ ] Blue-600 used ONLY for CTAs and links
- [ ] No rainbow effect (max 3-4 colors total)
- [ ] Slate shades consistent (800/700/600/500/200)
- [ ] Emerald-500 only for success states (✅)

### Contrast (WCAG AA)
- [ ] All text on white: slate-800/700/600 (4.5:1+)
- [ ] White text on blue-600: sufficient contrast
- [ ] No pure black (#000) - use slate-900 instead
- [ ] Borders subtle (slate-200, not gray-400)

**Test contrast:**
- Use Chrome DevTools contrast checker
- Or: https://webaim.org/resources/contrastchecker/

### Backgrounds
- [ ] White for primary content sections
- [ ] Slate-50 for alternating sections
- [ ] Blue-50 for highlighted info boxes
- [ ] Emerald-50 for success/guarantee boxes
- [ ] No gradients or patterns

---

## D. INTERACTION AUDIT ✅

### Buttons
- [ ] All buttons have hover state (scale-105 or bg change)
- [ ] Primary CTA: blue-600 → blue-700 on hover
- [ ] Secondary CTA: white → gray-50 on hover
- [ ] Focus states visible (ring-2 for keyboard users)
- [ ] Disabled states: opacity-50 + cursor-not-allowed

### Links
- [ ] All links have hover effect
- [ ] Footer links: text-slate-300 → white on hover
- [ ] Anchor links work (#pricing, #faq)
- [ ] Smooth scroll enabled globally

### Cards
- [ ] Interactive cards have hover:shadow-md
- [ ] Non-interactive cards have static shadow-sm
- [ ] Pricing cards: Professional has scale-105
- [ ] Badge on Professional card positioned correctly

### Transitions
- [ ] All animations use `duration-200` or `duration-300`
- [ ] No jarring instant changes
- [ ] Hover effects feel smooth, not laggy

**Test:**
- Tab through entire page with keyboard
- Every interactive element should show focus ring
- Every button should respond to Enter key

---

## E. MOBILE AUDIT 📱

### Responsive Breakpoints
Test at these widths:
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 768px (iPad)
- [ ] 1024px (Desktop)
- [ ] 1280px+ (Large desktop)

### Layout
- [ ] Pricing cards: 3-column → 1-column stack
- [ ] Why Now cards: 3-column → 1-column stack
- [ ] How It Works: 3-column → 1-column stack
- [ ] Buttons: side-by-side → stacked (w-full)
- [ ] Header/Footer: responsive (stack if needed)

### Touch Targets
- [ ] All buttons minimum 44x44px (iOS guideline)
- [ ] Buttons have px-8 py-4 (large enough)
- [ ] Links have padding (not just text)
- [ ] No tiny clickable areas

### Typography (Mobile)
- [ ] h1: `md:text-4xl` (40px on mobile)
- [ ] h2: `md:text-3xl` (30px on mobile)
- [ ] Body: stays `text-lg` (readable without zoom)
- [ ] No text smaller than 16px

### Spacing (Mobile)
- [ ] Sections: `md:py-16` (less than desktop py-24)
- [ ] Cards: `md:p-6` (less than desktop p-8)
- [ ] Gaps: `md:gap-6` (less than desktop gap-8)

**Test mobile:**
```bash
# Chrome DevTools
F12 → Toggle device toolbar (Ctrl+Shift+M)
# Test all interactions with mouse emulating touch
```

---

## F. ACCESSIBILITY AUDIT ♿

### Semantic HTML
- [ ] Page uses `<main>` wrapper
- [ ] Sections use `<section>` tags
- [ ] Footer uses `<footer>` tag
- [ ] Lists use `<ul>` / `<ol>` properly
- [ ] Buttons are `<button>` (not `<div>`)
- [ ] Links are `<a>` with `href`

### Heading Hierarchy
- [ ] One h1 per page (Hero)
- [ ] h2 for section headings
- [ ] h3 for subsections/cards
- [ ] No skipping levels (h1 → h3)

### Keyboard Navigation
- [ ] Tab key navigates through all interactive elements
- [ ] Focus ring visible on all elements
- [ ] Enter key activates buttons/links
- [ ] No keyboard traps
- [ ] Skip to main content link (optional)

### Screen Reader
- [ ] All images have alt text (when added)
- [ ] Links have descriptive text (not "click here")
- [ ] Buttons have clear labels
- [ ] Form fields have labels (when added)

**Test with screen reader:**
- macOS: VoiceOver (Cmd+F5)
- Windows: NVDA (free)

---

## G. PERFORMANCE AUDIT ⚡

### Lighthouse Score
Target scores:
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 95+

**Run Lighthouse:**
```bash
npm run build
npm start
# Chrome DevTools > Lighthouse > Generate report
```

### Images
- [ ] All images use Next.js Image component
- [ ] Images are WebP format
- [ ] Images have width/height specified
- [ ] Alt text provided
- [ ] Lazy loading for below-fold images

### Fonts
- [ ] Inter loaded from Google Fonts with `display=swap`
- [ ] No FOUT (flash of unstyled text)
- [ ] Preload critical fonts if needed

### Bundle Size
- [ ] Only necessary dependencies imported
- [ ] No unused components in build
- [ ] Tailwind purges unused CSS
- [ ] JavaScript bundle < 300kb (gzipped)

**Check bundle:**
```bash
npm run build
# Look at .next/static/chunks sizes
```

---

## H. CONTENT AUDIT 📝

### Copy Accuracy
- [ ] Hero headline: "You built a product. Nobody's converting."
- [ ] Pricing: $29 / $49 / $99 (USD)
- [ ] Pricing: 119 / 199 / 399 (PLN)
- [ ] Professional badge: "⭐ MOST POPULAR"
- [ ] Beta counter: "67 / 100 spots taken" (update before launch)
- [ ] Footer: "Built in Wrocław, Poland 🇵🇱"
- [ ] Signature: "— Jakub"

### Tone Consistency
- [ ] No hype language ("revolutionary", "game-changing")
- [ ] No fake urgency ("Only 2 left!")
- [ ] Honest about beta status
- [ ] Bootstrapper-to-bootstrapper voice
- [ ] Direct, clear, calm throughout

### Call-to-Actions
- [ ] Primary CTA: "Get Professional Audit - $49"
- [ ] Secondary CTA: "See How It Works ↓"
- [ ] CTAs appear in Hero, Pricing, Final CTA sections
- [ ] All CTAs link to #pricing (or Stripe when ready)

---

## I. FUNCTIONAL AUDIT 🔧

### Navigation
- [ ] Smooth scroll enabled
- [ ] Anchor links work (#pricing, #faq, #how-it-works)
- [ ] Currency toggle updates all prices
- [ ] Currency persists during session
- [ ] No console errors

### API
- [ ] `/api/detect-currency` returns JSON
- [ ] Falls back to USD if detection fails
- [ ] Works on Vercel deployment
- [ ] No rate limiting issues (ipapi.co 1000/day)

### Forms (Future)
- [ ] Email input validation
- [ ] Stripe checkout works
- [ ] Success/error states
- [ ] Loading states

**Test:**
```bash
# Start dev server
npm run dev

# Test currency API
curl http://localhost:3000/api/detect-currency

# Should return:
# {"currency":"USD","detected":false} (localhost)
```

---

## J. PRE-LAUNCH CHECKLIST 🚀

### Final Checks
- [ ] All sections render correctly
- [ ] No Lorem ipsum or placeholder text
- [ ] Beta counter accurate (67/100 or current)
- [ ] Contact email works (hi@landingpageauditor.com)
- [ ] Privacy/Terms links go somewhere (or remove)
- [ ] No broken links
- [ ] No console errors or warnings

### SEO
- [ ] Title tag: "Landing Page Auditor - AI-Powered..."
- [ ] Meta description set (155 chars)
- [ ] Open Graph tags (for social sharing)
- [ ] Favicon added to /public
- [ ] robots.txt allows indexing
- [ ] sitemap.xml generated (optional)

### Analytics
- [ ] Google Analytics installed (or Plausible)
- [ ] Event tracking on CTA clicks
- [ ] Page view tracking works
- [ ] Conversion goals set up

### Business
- [ ] Stripe account created
- [ ] Payment links generated
- [ ] Update Button hrefs with Stripe URLs
- [ ] Test purchase flow end-to-end
- [ ] Refund policy documented

---

## ✅ FINAL SIGN-OFF

Before deploying to production, verify:

- [ ] I've tested on mobile (iPhone, Android)
- [ ] I've tested on tablet (iPad)
- [ ] I've tested on desktop (Chrome, Safari, Firefox)
- [ ] Lighthouse score > 90 (all categories)
- [ ] No accessibility violations
- [ ] All CTAs link correctly
- [ ] Currency toggle works
- [ ] Professional card is featured (larger, badge)
- [ ] Footer shows correct info
- [ ] No spelling errors
- [ ] Design feels calm, professional, trustworthy
- [ ] I would personally pay $29-99 based on this page

**Deployment command:**
```bash
vercel --prod
```

---

## 🐛 Common Issues & Fixes

### Issue: Pricing cards not aligning
**Fix:** Check grid classes: `lg:grid-cols-3` on container

### Issue: Featured card not centered/larger
**Fix:** Ensure `scale-105` and `featured` prop set

### Issue: Colors look "off"
**Fix:** Check Tailwind config has correct primary/secondary colors

### Issue: Mobile spacing too tight
**Fix:** Add `md:` responsive classes: `py-24 md:py-16`

### Issue: Buttons too small on mobile
**Fix:** Add `w-full` class for mobile buttons

### Issue: Currency toggle not working
**Fix:** Check PricingSection is using `'use client'` directive

---

**Remember: Perfect is the enemy of done.**

If 90% of checklist is ✅, you're ready to ship. Iterate based on real user feedback.

Good luck, Jakub! 🚀
