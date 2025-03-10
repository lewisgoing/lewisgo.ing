// components/Bento.tsx
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useLanyard } from "react-use-lanyard";
import { Skeleton } from "./shadcn/skeleton";

// Component imports
import Image from "./assets/ImageBox";
import ShaderGradientBox from "./boxes/ShaderGradientBox";
import AudioBox from "./boxes/AudioBox";
import DiscordPresence from "./boxes/DiscordStatusBox";
import GithubBox from "./boxes/GithubBox";
import GithubCalendar from "./boxes/GithubCalendar";
import SkillsBox from "./boxes/SkillsBox";
import SoundcloudBox from "./boxes/SoundcloudBox";
import SpotifyBox from "./spotify/SpotifyBoxClient";

// Layout utilities
import { lgLayout, mdLayout, smLayout } from "../src/utils/bento-layouts";

// TypeScript interfaces
interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  bot: boolean;
  // Add other properties as needed
}

interface LanyardData {
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
  activities: any[]; // Adjust the type according to your data structure
  discord_status: string; // Include discord_status here
  discord_user: DiscordUser;
  kv: {
    spotify_last_played: string; // or any other type as per your data structure
  };
  listening_to_spotify: boolean;
  spotify: null; // or the correct type if spotify data is available
}

interface LanyardResponse {
  data: LanyardData;
}



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
    userId: process.env.NEXT_PUBLIC_LANYARD_USER_ID || "661068667781513236",
    // Reduce polling to prevent excessive API calls
    pollInterval: 30000, // Poll every 60 seconds instead of default 15 seconds
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
      {/* Intro Box with Shader Gradient */}
      <div key="intro" className="relative">
        <ShaderGradientBox
          className="rounded-3xl object-cover transition-opacity duration-300 skeleton"
          animate="on"
          control="props"
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={10}
          rotationZ={50}
          color1="#FF0006"
          color2="#003FFF"
          color3="#4AA6FF"
          wireframe={false}
          shader="defaults"
          type="sphere"
          uAmplitude={1.4}
          uDensity={1.2}
          uFrequency={1.5}
          uSpeed={0.04}
          uStrength={1.4}
          cDistance={10}
          cameraZoom={20}
          cAzimuthAngle={0}
          cPolarAngle={90}
          uTime={2}
          lightType="3d"
          envPreset="dawn"
          reflection={0.4}
          brightness={1.9}
          grain="off"
          toggleAxis={false}
          hoverState="off"
        />
        
        {/* SVG Overlay - placed after ShaderGradientBox to appear on top */}
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
        <ShaderGradientBox
          className="rounded-3xl object-cover transition-opacity duration-300 skeleton"
          animate="on"
          control="props"
          positionX={1}
          positionY={0}
          positionZ={2}
          rotationX={1}
          rotationY={10}
          rotationZ={50}
          color1="#FF0006"
          color2="#003FFF"
          color3="#4AA6FF"
          wireframe={false}
          shader="defaults"
          type="plane"
          uAmplitude={1.4}
          uDensity={1.2}
          uFrequency={1.5}
          uSpeed={0.08}
          uStrength={1.4}
          cDistance={10}
          cameraZoom={29}
          cAzimuthAngle={30}
          cPolarAngle={90}
          uTime={2}
          lightType="3d"
          envPreset="dawn"
          reflection={0.4}
          brightness={1.5}
          grain="off"
          toggleAxis={false}
          hoverState="off"
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
  {/* Pass the full lanyard object to the SpotifyBox component */}
  {!lanyard.isValidating ? (
    <SpotifyBox
      lanyard={lanyard}
      onLoad={() => setIsSpotifyLoaded(true)}
    />
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