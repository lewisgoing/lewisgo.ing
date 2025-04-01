// src/utils/blob-utils.ts

/**
 * Gets the appropriate URL for an asset (audio or SVG)
 * This implementation safely handles the case where blob-urls.ts doesn't exist yet
 */
export function getAssetUrl(path: string): string {
    // For assets that are already full URLs, return them as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Try to use Blob URLs if available and in production
    try {
      // In production or if NEXT_PUBLIC_USE_VERCEL_BLOB is set, use Blob URLs
      if (process.env.NEXT_PUBLIC_USE_VERCEL_BLOB === 'true' && process.env.VERCEL_BLOB_URL) {
        // Clean the path by removing any leading ./ or /
        const cleanPath = path.replace(/^[\.\/]+/, '');
        
        // Construct the full Blob URL
        return `${process.env.VERCEL_BLOB_URL}/${cleanPath}`;
      }
    } catch (error) {
      console.warn(`Error constructing Blob URL for ${path}:`, error);
    }
    
    // If we can't use Blob URLs or there was an error, fall back to local path
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  /**
   * Gets the proper URL for an audio file
   */
  export function getAudioUrl(fileName: string): string {
    // Normalize the path
    const normalizedPath = fileName.replace(/^[\.\/]+audio\//, '');
    const path = `${normalizedPath}`;
    
    return getAssetUrl(path);
  }
  
  /**
   * Gets the proper URL for an SVG file
   */
export function getSvgUrl(fileName: string): string {
  // Extract just the filename if a full path is provided
  const svgFileName = fileName.includes('/') 
    ? fileName.split('/').pop() || fileName 
    : fileName;
    
  // Make sure it has .svg extension
  const withExtension = svgFileName.endsWith('.svg') 
    ? svgFileName 
    : `${svgFileName}.svg`;
    
  // Always use the public/svg path for consistency
  const path = `svg/${withExtension}`;
  
  // For debugging, log the resolved path
  console.log(`Resolving SVG: ${fileName} -> ${path}`);
  
  return getAssetUrl(path);
}