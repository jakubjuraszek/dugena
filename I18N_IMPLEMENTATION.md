# i18n Implementation Guide - Landing Page Auditor

## 📋 Overview

This landing page now supports **Polish (PL)** and **English (EN)** using **next-intl** (best practice for Next.js App Router in 2025).

## 🚀 What Was Implemented

### 1. **Configuration Files**
- ✅ `i18n/routing.ts` - Routing configuration (locales, defaultLocale, navigation helpers)
- ✅ `i18n/request.ts` - Server-side request configuration
- ✅ `middleware.ts` - Automatic locale detection from Accept-Language header
- ✅ `next.config.js` - Updated with next-intl plugin

### 2. **Translation Files**
- ✅ `messages/pl.json` - Polish translations (fully populated)
- ✅ `messages/en.json` - English translations (copy of PL, ready for translation)

### 3. **Routing Structure**
```
app/
  [locale]/
    layout.tsx     ← Root layout with locale param
    page.tsx       ← Main landing page
    api/           ← API routes (moved here)
```

### 4. **Updated Components**
All 14 sections + Header + Footer now use translations:

| Component | Namespace | Status |
|-----------|-----------|--------|
| Header | `header` | ✅ Updated + LanguageSwitcher |
| HeroSection | `hero` | ✅ Updated |
| ProblemSection | `problem` | ✅ Updated |
| WhyNowSection | `whyNow` | ✅ Updated |
| ThisWorksSection | `thisWorks` | ✅ Updated |
| PricingSection | `pricing` | ✅ Updated (preserves currency toggle) |
| ComparisonSection | `comparison` | ✅ Updated |
| TransformationSection | `transformation` | ✅ Updated |
| SocialProofSection | `socialProof` | ✅ Updated |
| HowItWorksSection | `howItWorks` | ✅ Updated |
| FAQSection | `faq` | ✅ Updated |
| BetaPricingSection | `betaPricing` | ✅ Updated |
| FinalCTASection | `finalCTA` | ✅ Updated |
| PSSection | `ps` | ✅ Updated |
| Footer | `footer` | ✅ Updated |

### 5. **Language Switcher**
- ✅ New component: `components/LanguageSwitcher.tsx`
- ✅ Integrated in Header (top-right corner)
- ✅ PL/EN buttons with active state highlighting
- ✅ Preserves current path when switching languages

## 🌐 How Routing Works

### URLs
- **Polish (default)**: `https://your-domain.com/` → no prefix
- **English**: `https://your-domain.com/en/`

### Locale Detection
1. **First visit**: Middleware checks `Accept-Language` header
   - Browser language = EN → redirect to `/en`
   - Browser language = PL or other → stays at `/` (Polish)
2. **Subsequent visits**: Cookie stores user's choice
3. **Manual switch**: User clicks PL/EN buttons in header

## 🛠️ Development Workflow

### Running the App
```bash
npm run dev
```

Visit:
- Polish: http://localhost:3000/
- English: http://localhost:3000/en

### Adding New Translations

1. **Add key to both JSON files**:
```json
// messages/pl.json
{
  "newSection": {
    "title": "Polski tytuł",
    "description": "Polski opis"
  }
}

// messages/en.json
{
  "newSection": {
    "title": "English title",
    "description": "English description"
  }
}
```

2. **Use in component**:
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function NewSection() {
  const t = useTranslations('newSection');

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Working with Arrays
```tsx
const items = t.raw('items') as string[];
{items.map((item, i) => <li key={i}>{item}</li>)}
```

### Working with Nested Objects
```tsx
{t('pricing.tiers.quick.name')}
```

### Interpolation
```tsx
{t('hero.socialProof', { count: 1247 })}
```

## 📝 Translation Status

### Polish (pl.json)
✅ **100% complete** - All landing page text extracted from components

### English (en.json)
⚠️ **0% translated** - Currently identical to pl.json
- **TODO**: Translate all values to English
- Structure is ready, just replace Polish text with English

## 🔍 Testing Checklist

Before deploying, verify:

- [ ] Polish version loads at `/`
- [ ] English version loads at `/en`
- [ ] Language switcher in header works
- [ ] Active language is highlighted
- [ ] Switching preserves scroll position
- [ ] All sections show correct translations
- [ ] No console errors
- [ ] Metadata (SEO) changes per language
- [ ] Accept-Language detection works (test in different browsers)

## 🚨 Known Limitations

1. **English translations**: Currently showing Polish text (needs manual translation)
2. **npm package**: Added to package.json but not installed yet (run `npm install` first)
3. **Currency in Pricing**: Currently hardcoded USD/PLN - could be locale-aware in future

## 🎯 Next Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Translate en.json**:
   - Hire translator or use AI (DeepL, ChatGPT)
   - Maintain same JSON structure
   - Test English version thoroughly

3. **Optional improvements**:
   - Add more languages (es, de, fr, etc.)
   - Auto-detect currency based on locale
   - Add language-specific metadata images
   - Implement language preference in localStorage

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [TypeScript with next-intl](https://next-intl-docs.vercel.app/docs/workflows/typescript)

## 🙋 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all translation keys exist in both pl.json and en.json
3. Ensure components have `'use client';` directive when using `useTranslations`
4. Check middleware.ts is properly configured

---

**Implementation Date**: 2025-10-26
**next-intl Version**: 3.23.5
**Next.js Version**: 14.2.24
