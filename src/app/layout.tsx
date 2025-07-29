import '../styles/tailwind.css';
import '../styles/globals.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { fontClass } from '@/utils/fonts';
import { ThemeProviders } from '@/components/shared/ThemeProviders';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import MDXWrapper from '@/components/mdx/MDXProvider';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import siteMetadata from '../../public/data/siteMetaData';

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#E9D3B6" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#E9D3B6" />
      </head>
      <body className={`${fontClass} flex h-fit min-h-screen flex-col gap-y-6 font-mono antialiased`}>
        <ThemeProviders>
          <LayoutWrapper>
            <MDXWrapper>{children}</MDXWrapper>
          </LayoutWrapper>
          <Analytics />
        </ThemeProviders>
      </body>
    </html>
  );
}
