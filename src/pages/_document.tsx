// src/pages/_document.tsx

import { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div className='box-border flex h-fit min-h-screen flex-col gap-y-6 font-mono antialiased'>
          <main className='flex-grow'>
            <Main />
          </main>
          <NextScript />
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </Html>
  );
}