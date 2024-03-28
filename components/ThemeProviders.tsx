'use client'

import siteMetadata from '../public/data/siteMetaData'
import { ThemeProvider } from 'next-themes'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
            {children}
        </ThemeProvider>
    )
}
