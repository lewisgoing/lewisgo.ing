// src/utils/fonts.ts
import { JetBrains_Mono, Inter } from 'next/font/google';

// Define the Inter font
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Define the JetBrains Mono font
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// Export the combined font classes
export const fontClass = `${inter.variable} ${jetbrainsMono.variable}`;