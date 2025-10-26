import { ImageResponse } from 'next/og';

/**
 * APPLE TOUCH ICON - ConvertFix for iOS/Safari
 *
 * DESIGN CONCEPT:
 * - Larger version of main favicon (180x180 for iOS)
 * - Same design: Document with checkmark
 * - Primary orange (#ff8c4a) on dark background (#1a1a1a)
 * - Optimized for home screen icons on iOS devices
 *
 * TECHNICAL:
 * - Next.js App Router convention: app/apple-icon.tsx
 * - Standard Apple touch icon size: 180x180
 * - Used when adding site to iOS home screen
 */

// Apple icon metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Generate the Apple touch icon
export default function AppleIcon() {
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
          borderRadius: '22.5%', // Apple's standard rounded corners
        }}
      >
        {/* Document/Report Icon with Checkmark - scaled up for 180x180 */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document outline */}
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke="#ff8c4a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Document fold corner */}
          <path
            d="M14 2v6h6"
            stroke="#ff8c4a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Checkmark inside document */}
          <path
            d="M9 13l2 2 4-4"
            stroke="#ff8c4a"
            strokeWidth="1.5"
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
