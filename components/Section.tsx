import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'background' | 'elevated' | 'card' | 'white' | 'slate';
  id?: string;
}

/**
 * Section Component - Deliberate Design Decisions:
 *
 * SPACING:
 * - py-24: 6rem (96px) vertical padding = generous breathing room
 * - md:py-16: 4rem mobile = 75% of desktop (optimal scrolling)
 * - px-4: Horizontal padding for mobile edge spacing
 *
 * CONTAINER:
 * - max-w-7xl: 80rem = readable width (prevents ultra-wide on 4K)
 * - mx-auto: Centers content (balanced composition)
 *
 * BACKGROUNDS:
 * - Alternating white/slate-50 creates visual separation
 * - Helps users chunk information (cognitive psychology)
 *
 * RATIONALE:
 * - Generous vertical spacing = "eye relief" (anti-cramped)
 * - Max-width prevents line lengths >100 characters (readability)
 * - Alternating backgrounds = clear section boundaries
 *
 * USAGE:
 * Odd sections (Hero, Solution, Pricing): background="white"
 * Even sections (Problem, Why Now): background="slate"
 */
export function Section({ children, className = '', background = 'background', id }: SectionProps) {
  const bgMap = {
    'background': 'bg-background',
    'elevated': 'bg-elevated',
    'card': 'bg-card',
    'white': 'bg-white',
    'slate': 'bg-background'
  };

  const bgClasses = bgMap[background] || 'bg-background';

  const combinedClasses = `
    py-24 md:py-16
    px-4
    ${bgClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <section id={id} className={combinedClasses}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
