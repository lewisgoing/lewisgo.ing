// utils/image-utils.ts
/**
 * Utility functions for image optimization
 */

/**
 * Gets the correct image URL based on environment
 * Helps with compatibility between development and production
 */
export function getImageUrl(path: string): string {
    // Remove leading slash if present
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Check if running on Vercel or in production
    if (process.env.VERCEL_URL || process.env.NODE_ENV === 'production') {
      // Use the CDN URL if available
      const cdnBase = process.env.NEXT_PUBLIC_CDN_URL || '';
      if (cdnBase) {
        return `${cdnBase}/${normalizedPath}`;
      }
    }
    
    // Default to relative path
    return `/${normalizedPath}`;
  }
  
  /**
   * Determines if an image should be priority loaded
   * @param index The index of the image in a list
   * @param importance How important is this image (0-10)
   * @returns boolean indicating if this should be priority loaded
   */
  export function shouldPrioritize(index: number, importance: number = 5): boolean {
    // Only prioritize the first few images or very important ones
    return index < 3 || importance > 7;
  }
  
  /**
   * Generates responsive image width array for srcSet
   */
  export function getResponsiveWidths(baseWidth: number): number[] {
    return [
      Math.round(baseWidth * 0.5),
      baseWidth,
      Math.round(baseWidth * 1.5),
      Math.round(baseWidth * 2)
    ];
  }