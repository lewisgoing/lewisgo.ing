import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import SectionContainer from "../../components/SectionContainer";
import type { AppProps } from "next/app";
import siteMetadata from "../../public/data/siteMetadata";
// import { Analytics } from '@vercel/analytics/react'
import "../styles/tailwind.css";
import { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import AnimatedCursor from "react-animated-cursor";
// import { SearchConfig, SearchProvider } from 'pliny/search'
// import 'pliny/search/algolia.css'
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "../styles/globals.css";
import { ThemeProviders } from "../../components/ThemeProviders";

const font = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-jetbrains-mono",
});

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
    url: "./",
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: "summary_large_image",
    images: [siteMetadata.socialBanner],
  },
};

export default function App(
  { Component, pageProps }: AppProps) {
  return (
    <>
      <meta name="msapplication-TileColor" content="#000000" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#E9D3B6"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#E9D3B6"
      />
      {/* <body className="bg-background text-black antialiased dark:text-white"> */}
      <ThemeProviders>
        {/* <Analytics /> */}
        <SectionContainer>
          <AnimatedCursor
            innerSize={8}
            outerSize={8}
            color="193, 11, 111"
            outerAlpha={0.2}
            innerScale={0.7}
            outerScale={5}
            showSystemCursor={false}
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
              } as any,
            ]}
          />{" "}
                    {/* <AnimatedCursor
            innerSize={8}
            outerSize={16}
            color="193, 11, 111"
            outerAlpha={0.2}
            innerScale={0.7}
            outerScale={5}
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
          />{" "} */}
          <div className="flex h-full flex-col justify-between font-sans">
            {/* <SearchProvider searchConfig={siteMetadata.search as SearchConfig}> */}
            <NavBar />
            <Component {...pageProps} />
            {/* <main className="mb-auto">{children}</main> */}
            {/* </SearchProvider> */}
            <Footer />
          </div>
        </SectionContainer>
      </ThemeProviders>
      {/* </body> */}
    </>
  );
}
