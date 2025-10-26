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
    font-semibold text-lg
    px-8 py-4
    rounded-lg
    transform hover:scale-105
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700
      text-white
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-white hover:bg-gray-50
      text-blue-600
      border-2 border-blue-600
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
