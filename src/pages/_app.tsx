// src/pages/_app.tsx

import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import SectionContainer from '../../components/SectionContainer';
import type { AppProps } from 'next/app';
import siteMetadata from '../../public/data/siteMetaData';

import '../styles/tailwind.css';
import { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import AnimatedCursor from 'react-animated-cursor';

// import { SearchConfig, SearchProvider } from 'pliny/search'
// import 'pliny/search/algolia.css'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import '../styles/globals.css';
import { ThemeProviders } from '../../components/ThemeProviders';
import { Analytics } from '@vercel/analytics/next';

import { fontClass } from '../utils/fonts';
import LayoutWrapper from '@/components/LayoutWrapper';

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#E9D3B6" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#E9D3B6" />
      {/* <body className="bg-background text-black antialiased dark:text-white"> */}
      <ThemeProviders>
        {/* <Analytics /> */}
        {/* <SectionContainer> */}

             {/* <div className={`${fontClass} flex h-full flex-col justify-between font-mono`}> */}
            {/* <SearchProvider searchConfig={siteMetadata.search as SearchConfig}> */}
            {/* <NavBar /> */}
            <LayoutWrapper>
              <Component {...pageProps} /> 
              {/* <Footer />  */}
            </LayoutWrapper>
            
            {/* <main className="mb-auto">{children}</main> */}
            {/* </SearchProvider> */}

        
          {/* </div> */}
        {/* </SectionContainer> */}

        <Analytics />

      </ThemeProviders>
    </>
  );
}
