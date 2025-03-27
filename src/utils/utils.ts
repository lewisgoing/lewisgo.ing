// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple class names with Tailwind merger
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string | number) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate reading time in minutes
 */
export function readingTime(text: string): string {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s/g).length;
  const minutes = Math.ceil(numberOfWords / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Convert kebab case to title case
 */
export function kebabToTitleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse code block metadata
 * For syntax like: ```js title="filename.js" caption="Example code" showLineNumbers
 */
export function parseCodeBlockMeta(meta: string) {
  const result: Record<string, any> = {};
  
  // Match all attributes
  const titleMatch = meta.match(/title="([^"]*)"/);
  const captionMatch = meta.match(/caption="([^"]*)"/);
  const showLineNumbers = /showLineNumbers/.test(meta);
  const highlightMatch = meta.match(/highlight="([^"]*)"/);
  
  if (titleMatch) result.title = titleMatch[1];
  if (captionMatch) result.caption = captionMatch[1];
  if (showLineNumbers) result.showLineNumbers = true;
  
  // Parse highlighting
  if (highlightMatch) {
    const highlightRanges = highlightMatch[1].split(',');
    const highlightLines: number[] = [];
    
    highlightRanges.forEach(range => {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          highlightLines.push(i);
        }
      } else {
        highlightLines.push(Number(range));
      }
    });
    
    result.highlightLines = highlightLines;
  }
  
  return result;
}

function validateEnvVars() {
    const requiredVars = [
      'NEXT_PUBLIC_LANYARD_USER_ID',
      'NEXT_PUBLIC_VERCEL_BLOB_URL',
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

