import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
}

/**
 * Button Component - Deliberate Design Decisions:
 *
 * PRIMARY CTA (Professional package):
 * - bg-blue-600: Trust, action, brand color
 * - px-8 py-4: Large touch target (mobile-friendly, min 44x44px)
 * - font-semibold: Calls to action (not regular weight)
 * - text-lg: Visible from distance, hierarchically important
 * - rounded-lg: Friendly, modern (not sharp corners)
 * - shadow-lg: Elevates above page (visual prominence)
 * - hover:scale-105: Micro-interaction (feels alive, responsive)
 * - transition-all: Smooth animations (professional feel)
 * - focus:ring: Accessibility for keyboard users
 *
 * SECONDARY CTA (Quick/Premium):
 * - border-2: Outline style, lower visual weight
 * - Same spacing/size: Consistent touch targets
 * - hover:bg-gray-50: Subtle feedback
 */
export function Button({ variant = 'primary', children, href, className = '', ...props }: ButtonProps) {
  const baseClasses = `
    font-bold text-lg
    px-8 py-4
    rounded-md
    transform hover:scale-[1.02]
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-primary/20
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variantClasses = {
    primary: `
      bg-primary
      hover:bg-primary-light
      text-white
      shadow-lg hover:shadow-xl shadow-primary/20
    `,
    secondary: `
      bg-transparent hover:bg-primary/10
      text-foreground
      border-2 border-border hover:border-primary
      shadow-sm hover:shadow-md
    `,
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim().replace(/\s+/g, ' ');

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        role="button"
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
