// components/assets/OptimizedImage.tsx
'use cache';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from '../shadcn/skeleton';
import { cn } from '@/utils/tailwind-helpers';
import { applyStaticContentCacheProfile } from '@/utils/cache-utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  skeletonClassName?: string;
  noSkeleton?: boolean;
}

/**
 * An optimized image component with skeleton loading
 * Uses NextJS 15 caching features for better performance
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
  // Apply static content caching for images
  applyStaticContentCacheProfile();

  return (
    <ClientOptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      skeletonClassName={skeletonClassName}
      noSkeleton={noSkeleton}
      priority={priority}
      {...props}
    />
  );
};

// Client component for interactive features
'use client';
const ClientOptimizedImage: React.FC<OptimizedImageProps> = ({
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
        <Skeleton className={cn('absolute left-0 top-0 h-full w-full', skeletonClassName)} />
      )}
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        className={cn(className, isLoading ? 'invisible' : 'visible')}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;