// src/hooks/useScrollAnimation.ts
import { useState, useEffect, useCallback } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;        // Value between 0-1, percentage of element visible needed to trigger
  rootMargin?: string;       // Margin around the root
  triggerOnce?: boolean;     // Whether to trigger only once
  root?: Element | null;     // The viewport element
}

/**
 * Custom hook for triggering animations based on scroll position
 * 
 * @param options Configuration options for the intersection observer
 * @returns Object containing the ref to attach and animation state
 */
export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  root = null
}: ScrollAnimationOptions = {}) {
  // Reference to the element we're observing
  const [ref, setRef] = useState<Element | null>(null);
  
  // Animation state
  const [inView, setInView] = useState(false);
  
  // Progress value (0-1) for more granular animations
  const [progress, setProgress] = useState(0);
  
  // Setup the observer with the callback
  const observer = useCallback(() => {
    return new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setInView(entry.isIntersecting);
        
        // Calculate a progress value (how much of the element is visible)
        // This is useful for more granular animations
        if (entry.isIntersecting) {
          const viewportHeight = window.innerHeight;
          const elementTop = entry.boundingClientRect.top;
          const elementHeight = entry.boundingClientRect.height;
          
          // Calculate how far the element has been scrolled into view (0-1)
          const visibleRatio = Math.max(
            0,
            Math.min(
              1,
              (viewportHeight - elementTop) / (viewportHeight + elementHeight)
            )
          );
          
          setProgress(visibleRatio);
          
          // If triggerOnce is true, unobserve after triggering
          if (triggerOnce && entry.isIntersecting) {
            // Check if the element exists before attempting to unobserve
            if (ref) {
              observer().unobserve(ref);
            }
          }
        }
      },
      { threshold, rootMargin, root }
    );
  }, [threshold, rootMargin, triggerOnce, root, ref]);
  
  // Setup and cleanup the observer
  useEffect(() => {
    if (!ref) return;
    
    const observerInstance = observer();
    observerInstance.observe(ref);
    
    return () => {
      observerInstance.disconnect();
    };
  }, [ref, observer]);
  
  return { 
    ref: setRef,   // Attach this to your element
    inView,        // Boolean indicating if element is in view
    progress       // Number (0-1) indicating how much of the element is visible
  };
}

export default useScrollAnimation;