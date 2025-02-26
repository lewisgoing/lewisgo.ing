// app/page.tsx
import dynamic from 'next/dynamic';

// Use dynamic import for Bento with ssr: false to avoid React Three Fiber issues
const BentoGrid = dynamic(() => import('@/components/Bento'), {
  ssr: true,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  ),
});

// For cursor animation, use client component
const AnimatedCursorWrapper = dynamic(() => import('@/components/AnimatedCursorWrapper'), {
  ssr: true,
});

export default function Home() {
  return (
    <div className="divide-y divide-gray-200">
      <div className="mx-auto bento-md:-mx-[5vw] bento-lg:-mx-[20vw]">
        {/* Use a div wrapper to avoid React Three Fiber errors */}
        <div id="bento-container">
          <BentoGrid />
        </div>
        <AnimatedCursorWrapper />
      </div>
    </div>
  );
}