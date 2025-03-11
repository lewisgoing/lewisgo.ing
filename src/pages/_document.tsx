// src/pages/_document.tsx
'use cache';
import { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <Analytics />
        <NextScript />
        <SpeedInsights />
      </body>
    </Html>
  );
}
