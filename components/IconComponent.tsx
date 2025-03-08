// components/assets/IconComponent.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from 'src/utils/tailwind-helpers';

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