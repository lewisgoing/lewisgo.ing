'use client';

import React, { useEffect, useState, useRef, Suspense } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useLanyard } from "react-use-lanyard";
import { Skeleton } from "./shadcn/skeleton";
import dynamic from "next/dynamic";

// Component imports
import Image from "./assets/ImageBox";
// Use the simple gradient component instead of ShaderGradient
import SimpleGradient from "./SimpleGradient";
import AudioBox from "./boxes/AudioBox";
import DiscordPresence from "./boxes/DiscordStatusBox";
import GithubBox from "./boxes/GithubBox";
import GithubCalendar from "./boxes/GithubCalendar";
// Handle SkillsBox tooltip issue by dynamically importing it
const SkillsBox = dynamic(() => import("./boxes/SkillsBox"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-3xl" />
});
import SoundcloudBox from "./boxes/SoundcloudBox";

// Import the server component from app directory as a client component
import SpotifyBox from "components/spotify/SpotifyBox"; 

// Layout utilities
import { lgLayout, mdLayout, smLayout } from "../scripts/utils/bento-layouts";

// Apply WidthProvider to Responsive Grid Layout
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Bento() {
  // States
  const [introSilhouette, setIntroSilhouette] = useState(false);
  const [isDiscordLoaded, setDiscordLoaded] = useState(false);
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false);
  const [rowHeight, setRowHeight] = useState(280);
  
  // Refs
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lanyard data hook for Discord/Spotify integration
  const lanyard = useLanyard({
    userId: "661068667781513236",
  });

  // Handle responsive layout changes
  const handleWidthChange = (width: number) => {
    if (width <= 500) {
      setRowHeight(158);
    } else if (width <= 1100) {
      setRowHeight(180);
    } else {
      setRowHeight(280);
    }
  };

  // Drag handlers for grid items
  const handleDragStart = (element: HTMLElement) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    document.querySelectorAll(".react-grid-item").forEach((item) => {
      (item as HTMLElement).style.zIndex = "1";
    });

    element.style.zIndex = "10";
  };

  const handleDragStop = (element: HTMLElement) => {
    timeoutRef.current = setTimeout(() => {
      element.style.zIndex = "1";
    }, 500);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Only render after client-side hydration to avoid errors
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveGridLayout
      className="mx-auto max-w-[375px] bento-md:max-w-[800px] bento-lg:max-w-[1200px]"
      layouts={{ lg: lgLayout, md: mdLayout, sm: smLayout }}
      breakpoints={{ lg: 1199, md: 799, sm: 374 }}
      cols={{ lg: 4, md: 4, sm: 2 }}
      rowHeight={rowHeight}
      isResizable={false}
      isDraggable={true}
      onWidthChange={handleWidthChange}
      isBounded
      margin={[16, 16]}
      useCSSTransforms={true}
      onDragStart={(layout, oldItem, newItem, placeholder, e, element) =>
        handleDragStart(element)
      }
      onDragStop={(layout, oldItem, newItem, placeholder, e, element) =>
        handleDragStop(element)
      }
    >
      {/* Intro Box with Simple Gradient */}
      <div key="intro" className="relative">
        <SimpleGradient
          className="rounded-3xl"
          color1="#FF0006"
          color2="#003FFF"
          color3="#4AA6FF"
          type="sphere"
          animate="on"
        />
        
        {/* SVG Overlay */}
        <Image
          src="/svg/lewis-card-hover-4.svg"
          alt="Bento Intro Silhouette"
          fill
          className="rounded-3xl object-cover absolute top-0 left-0 z-10"
          skeletonClassName="rounded-3xl"
          noRelative
          unoptimized
          priority
        />
      </div>

      {/* GitHub Box */}
      <div
        key="github"
        className="group"
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <GithubBox />
      </div>

      {/* Tall Gradient Box */}
      <div key="tall-gradient" className="h-full w-full overflow-hidden">
        <SimpleGradient
          className="rounded-3xl"
          color1="#FF0006"
          color2="#003FFF"
          color3="#4AA6FF"
          type="plane"
          animate="on"
        />
      </div>

      {/* Discord Status Box */}
      <div key="discord">
        {lanyard.data && !lanyard.isValidating ? (
          <DiscordPresence
            lanyard={lanyard.data}
            onLoad={() => setDiscordLoaded(true)}
          />
        ) : (
          <Skeleton className="w-full h-full rounded-3xl" />
        )}
      </div>

      {/* Audio Player Box */}
      <div
        key="audiobox"
        className="group"
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <AudioBox />
      </div>

      {/* SoundCloud Box */}
      <div
        key="twitter"
        className="group"
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <SoundcloudBox />
      </div>

      {/* Spotify Status Box */}
      <div
        key="spotify"
        className="group"
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        {lanyard.data && !lanyard.isValidating ? (
          <Suspense fallback={<Skeleton className="w-full h-full rounded-3xl z-[1]" />}>
            {/* @ts-expect-error Server Component */}
            <SpotifyBox
              lanyard={lanyard.data}
              onLoad={() => setIsSpotifyLoaded(true)}
            />
          </Suspense>
        ) : (
          <Skeleton className="w-full h-full rounded-3xl z-[1]" />
        )}
      </div>

      {/* Skills Box */}
      <div key="tech" className="flex justify-center items-center">
        <SkillsBox />
      </div>

      {/* GitHub Contributions Box */}
      <div
        key="contributions"
        className="group flex items-center justify-center"
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <GithubCalendar
          username="lewisgoing"
          hideColorLegend
          hideTotalCount
          blockMargin={6}
          blockSize={20}
          blockRadius={7}
        />
      </div>
    </ResponsiveGridLayout>
  );
}