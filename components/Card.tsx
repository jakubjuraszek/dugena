import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  badge?: React.ReactNode;
  hover?: boolean;
}

/**
 * Card Component - Deliberate Design Decisions:
 *
 * CONTAINER:
 * - bg-white: Contrast with slate-50 section backgrounds
 * - border-slate-200: Subtle separator (not aggressive black)
 * - rounded-xl: 12px radius = modern, friendly (not sharp)
 * - p-8: 2rem padding = generous breathing room inside
 *
 * ELEVATION:
 * - shadow-sm: Subtle depth (not flat, not overly 3D)
 * - hover:shadow-md: Feedback that card is interactive
 *
 * FEATURED VARIANT (for Professional pricing):
 * - border-2 border-blue-600: Double border = featured prominence
 * - scale-105: 5% larger than siblings
 * - shadow-lg: More elevation
 *
 * ANIMATION:
 * - transition-all duration-200: Smooth state changes
 *
 * RATIONALE:
 * - Generous spacing prevents "cramped" feeling (common programmer mistake)
 * - Subtle borders maintain clean aesthetic (Basecamp/Linear inspiration)
 * - Hover states provide interactivity feedback
 */
export function Card({ children, className = '', featured = false, badge, hover = true }: CardProps) {
  const baseClasses = `
    bg-card
    rounded
    p-8
    relative
  `;

  const borderClasses = featured
    ? 'border-2 border-primary'
    : 'border border-border';

  const shadowClasses = featured
    ? 'shadow-lg hover:shadow-xl shadow-primary/20'
    : hover
    ? 'shadow-sm hover:shadow-md'
    : 'shadow-sm';

  const scaleClasses = featured
    ? 'transform scale-105 md:scale-110 z-10'
    : '';

  const transitionClasses = hover ? 'transition-all duration-200' : '';

  const combinedClasses = `
    ${baseClasses}
    ${borderClasses}
    ${shadowClasses}
    ${scaleClasses}
    ${transitionClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses}>
      {badge && (
        <div className="absolute -top-3 right-4 bg-primary text-white px-4 py-1 rounded text-sm font-bold shadow-md">
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}
