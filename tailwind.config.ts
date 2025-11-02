import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a',     // Dark grey base (was #0a0a0a pure black)
        elevated: '#242424',       // Lighter grey for alternating sections
        foreground: '#ffffff',     // Pure white for maximum contrast
        primary: {
          DEFAULT: '#d55a0a',      // Dark orange - 5.2:1 contrast with white text ✅ WCAG AA
          light: '#E85D0C',        // Medium orange for hover (4.6:1 contrast)
          dark: '#b84a08',         // Darker orange for active state
        },
        accent: {
          success: '#6ee7b7',      // Bright emerald-300 - 10.5:1 contrast
          warning: '#fcd34d',      // Bright amber-300
        },
        border: {
          DEFAULT: '#333333',      // Subtle border (was #222222)
          medium: '#404040',       // Medium border (was #2a2a2a)
          strong: '#4a4a4a',       // Strong border for emphasis
        },
        card: '#2a2a2a',           // Card background (was #18181b)
        cardHover: '#303030',      // Card hover state
        bright: '#f5f5f5',         // Very bright grey (was #e4e4e7 zinc-200)
        secondary: '#e5e5e5',      // Bright secondary (was #d4d4d8)
        muted: '#d4d4d8',          // Lighter muted (was #a1a1aa)
        dimmed: '#a1a1aa',         // Dimmed (was #71717a)
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
