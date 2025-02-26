'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import AnimatedCursor with no SSR to avoid hydration errors
const AnimatedCursor = dynamic(() => import('react-animated-cursor'), {
  ssr: false
});

export default function AnimatedCursorWrapper() {
  // Only render the cursor after client-side hydration is complete
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={8}
      color="193, 11, 111"
      outerAlpha={0.2}
      innerScale={0.7}
      outerScale={5}
      showSystemCursor={true} // Change to true to avoid cursor:none hydration errors
      clickables={[
        "a",
        'input[type="text"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        "label[for]",
        "select",
        "textarea",
        "button",
        ".link",
        {
          target: ".react-grid-item",
          options: {
            innerSize: 12,
            outerSize: 16,
            color: "255, 255, 255",
            outerAlpha: 0.3,
            innerScale: 0.7,
            outerScale: 5,
          },
        },
      ]}
    />
  );
}