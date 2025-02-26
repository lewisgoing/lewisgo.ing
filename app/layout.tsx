// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import SectionContainer from "@/components/SectionContainer";
import siteMetadata from "public/data/siteMetaData";

// CSS imports
import "src/styles/globals.css";
import "src/styles/tailwind.css";

// Import other required CSS
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Configure font
const font = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-jetbrains-mono",
});

// Metadata for the app
export const metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.variable}>
      <head>
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#E9D3B6" />
      </head>
      <body>
        <SectionContainer>
          <div className="flex h-full flex-col justify-between font-sans">
            <main className="mb-auto">{children}</main>
            <Footer />
          </div>
        </SectionContainer>
        <Analytics />
      </body>
    </html>
  );
}