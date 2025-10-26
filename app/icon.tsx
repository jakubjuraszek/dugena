import { ImageResponse } from 'next/og';

/**
 * FAVICON ICON - ConvertFix Brand Identity
 *
 * DESIGN CONCEPT:
 * - Document/report icon with checkmark (represents audit/analysis)
 * - Primary orange (#ff8c4a) on dark background (#1a1a1a)
 * - Matches Header logo (FileText from Lucide React)
 * - Simple, recognizable at small sizes (browser tabs)
 *
 * TECHNICAL:
 * - Next.js App Router convention: app/icon.tsx
 * - Uses ImageResponse API from next/og
 * - Generates PNG dynamically
 */

// Icon metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Generate the icon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a1a', // Dark background (matches brand)
        }}
      >
        {/* Document/Report Icon with Checkmark */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document outline */}
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke="#ff8c4a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Document fold corner */}
          <path
            d="M14 2v6h6"
            stroke="#ff8c4a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Checkmark inside document */}
          <path
            d="M9 13l2 2 4-4"
            stroke="#ff8c4a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
