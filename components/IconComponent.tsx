// components/assets/IconComponent.tsx
import { cn } from 'scripts/utils/tailwind-helpers';

// Define icon sizes for consistency
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Map sizes to pixel values
const sizeMap: Record<IconSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64
};

interface IconProps {
  name: string; // The name of the icon (without extension)
  size?: IconSize;
  className?: string;
  alt?: string;
}

/**
 * A component for rendering optimized SVG icons
 * This uses Next.js Image for optimized loading
 */
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  className, 
  alt = 'icon' 
}) => {
  const pixelSize = sizeMap[size];
  
  return (
    <Image
      src={`/svg/${name}.svg`}
      alt={alt}
      width={pixelSize}
      height={pixelSize}
      className={cn("text-primary", className)}
      // Only use unoptimized for SVGs - Next.js doesn't optimize SVGs by default
      unoptimized
    />
  );
};

// components/assets/OptimizedImage.tsx
import React from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from '../shadcn/skeleton';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  skeletonClassName?: string;
  noSkeleton?: boolean;
}

/**
 * An optimized image component with skeleton loading
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  skeletonClassName,
  noSkeleton = false,
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(!priority);

  return (
    <div className="relative">
      {!noSkeleton && isLoading && (
        <Skeleton 
          className={cn(
            "absolute left-0 top-0 h-full w-full",
            skeletonClassName
          )} 
        />
      )}
      <Image
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        className={cn(className, isLoading ? "invisible" : "visible")}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
};

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