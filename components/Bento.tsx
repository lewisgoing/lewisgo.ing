// components/Bento.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { useLanyard } from 'react-use-lanyard';
import { Skeleton } from './shadcn/skeleton';
import { useActivities } from '../src/hooks/useActivities';

// Component imports
import Image from './assets/ImageBox';
import ShaderGradientBox from './boxes/ShaderGradientBox';
import AudioBox from './boxes/AudioBox';
import DiscordPresence from './boxes/DiscordStatusBox';
import GithubBox from './boxes/GithubBox';
import GithubCalendar from './boxes/GithubCalendar';
import SkillsBox from './boxes/SkillsBox';
import SoundcloudBox from './boxes/SoundcloudBox';
import SpotifyBox from './boxes/SpotifyBox';
import ProjectsBox from './boxes/ProjectsBox';

// Toast functionality
import { ToastProvider } from '@/components/shadcn/toast-provider';
import { useToast } from './shadcn/use-toast';

// Layout utilities
import { lgLayout, mdLayout, smLayout, xlLayout } from 'src/utils/bento-layouts';
import { KeySquare } from 'lucide-react';
import KeyboardShortcutsIndicators from './KeyboardShortcutIndicator';
import CurrentActivitiesBox from './boxes/CurrentActivitiesBox';

// Store the original layouts for reset functionality
const defaultLayouts = {
  lg: lgLayout,
  md: mdLayout,
  sm: smLayout,
  xl: xlLayout
};

const MinimalistFooterPills = ({ isDraggable }) => {
  return (
    <div className="mx-auto flex justify-center gap-4 py-2 mt-3 mb-6">
      <div className="flex items-center px-3 py-1 rounded-full bg-secondary/40 backdrop-blur-sm border border-border/50">
        <KeySquare size={12} className="text-primary mr-1.5" />
        <span className="text-xs font-medium mx-0.5">⌘L</span>
        <span className="text-xs text-muted-foreground ml-1 mr-0.5">
          {isDraggable ? 'Lock' : 'Unlock'}
        </span>
      </div>
      
      <div className="flex items-center px-3 py-1 rounded-full bg-secondary/40 backdrop-blur-sm border border-border/50">
        <KeySquare size={12} className="text-primary mr-1.5" />
        <span className="text-xs font-medium mx-0.5">⌘K</span>
        <span className="text-xs text-muted-foreground ml-1 mr-0.5">Reset</span>
      </div>
    </div>
  );
};

// Apply WidthProvider to Responsive Grid Layout
const ResponsiveGridLayout = WidthProvider(Responsive);

// Helper component to use toast inside the main component
const BentoWithToast = () => {
  const { toast } = useToast();
  const { activities } = useActivities();
  
  // States
  const [introSilhouette, setIntroSilhouette] = useState(false);
  const [isDiscordLoaded, setDiscordLoaded] = useState(false);
  const [isSpotifyLoaded, setIsSpotifyLoaded] = useState(false);
  const [rowHeight, setRowHeight] = useState(280);
  
  // New states for draggability and layouts
  const [isDraggable, setIsDraggable] = useState(true);
  const [layouts, setLayouts] = useState(defaultLayouts);
  
  // Refs
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Lanyard data hook for Discord/Spotify integration
  const lanyard = useLanyard({
    userId: process.env.NEXT_PUBLIC_LANYARD_USER_ID || '661068667781513236',
    // Reduce polling to prevent excessive API calls
    pollInterval: 600000, // Poll every 60 seconds instead of default 15 seconds
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle draggability with Command+D
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsDraggable(prev => !prev);
        toast({
          title: isDraggable ? "Dragging disabled" : "Dragging enabled",
          description: isDraggable 
            ? "Use ⌘L to re-enable dragging" 
            : "Drag boxes to rearrange your dashboard",
          duration: 2000,
        });
      }
      
      // Reset layout with Command+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLayouts(defaultLayouts);
        toast({
          title: "Layout reset",
          description: "All boxes have been reset to their default positions",
          duration: 2000,
        });
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDraggable, toast]);

  // Handle responsive layout changes
  const handleWidthChange = (width: number) => {
    if (width <= 500) {
      setRowHeight(158); // For small screens
    } else if (width <= 800) {
      setRowHeight(180); // For medium screens
    } else if (width <= 1200) {
      setRowHeight(280); // For large screens
    } else {
      setRowHeight(350); // For xl screens
    }
  };
  

  // Drag handlers for grid items
  const handleDragStart = (element: HTMLElement) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    document.querySelectorAll('.react-grid-item').forEach((item) => {
      (item as HTMLElement).style.zIndex = '1';
    });

    element.style.zIndex = '10';
  };

  const handleDragStop = (element: HTMLElement) => {
    timeoutRef.current = setTimeout(() => {
      element.style.zIndex = '1';
    }, 500);
  };
  
  // Track layout changes
  const onLayoutChange = (layout: Layout[], allLayouts: any) => {
    // Only save changes if dragging is enabled
    if (isDraggable) {
      setLayouts(allLayouts);
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Visual indicator for draggable state
  const gridItemClass = isDraggable 
    ? "react-grid-item" 
    : "react-grid-item transition-all duration-300 hover:cursor-default";

  return (
    <>
<ResponsiveGridLayout
  className="mx-auto max-w-[375px] bento-md:max-w-[800px] bento-lg:max-w-[1200px] bento-xl:max-w-[1600px]"
  layouts={layouts}
  breakpoints={{ xl: 1600, lg: 1199, md: 799, sm: 374 }} // Add XL breakpoint
  cols={{ xl: 4, lg: 4, md: 4, sm: 2 }} // Add cols for XL
  rowHeight={rowHeight}
  isResizable={false}
  isDraggable={isDraggable}
  onWidthChange={handleWidthChange}
  isBounded
  margin={[16, 16]} // Slightly larger margins
  useCSSTransforms={true}
  onDragStart={(layout, oldItem, newItem, placeholder, e, element) => handleDragStart(element)}
  onDragStop={(layout, oldItem, newItem, placeholder, e, element) => handleDragStop(element)}
  onLayoutChange={onLayoutChange}
  draggableCancel=".drag-blocker"
>
      {/* Intro Box with Shader Gradient */}
      <div key="intro" className={`relative ${gridItemClass}`}>
      <ShaderGradientBox
  className="rounded-3xl object-cover transition-opacity duration-300 skeleton"
  animate="on"
  control="props"
  positionX={0}
  positionY={0}
  positionZ={0}
  rotationX={50}
  rotationY={0}
  rotationZ={-60}
  color1="#606080" // Golden tone
  color2="#8d7dca" // Muted purple for transition
  color3="#212121" // Deep navy blue
  wireframe={false}
  shader="a"
  type="waterPlane"
  uAmplitude={1.4}
  uDensity={1.5}
  uFrequency={1.0}
  uSpeed={0.1} // Slightly slowed down for smoother motion
  uStrength={1.5}
  cDistance={2.8}
  cameraZoom={29}
  cAzimuthAngle={180}
  cPolarAngle={80}
  uTime={2}
  lightType="3d"
  reflection={0.4}
  brightness={0.3}
  grain="on"
  // grainBlending=
  toggleAxis={false}
  hoverState="off"
  enableTransition={true}
  />

{/* <ShaderGradientBox
  className="rounded-3xl object-cover transition-opacity duration-300 skeleton"
  animate="on"
  control="props"
  positionX={-1.2}
  positionY={-2.1}
  positionZ={-0.4}
  rotationX={0}
  rotationY={15}
  rotationZ={225}
  color1="#ff6a1a"
  color2="#c73c00"
  color3="#FD4912"
  wireframe={false}
  shader="defaults"
  type="waterPlane"
  uAmplitude={0}
  uDensity={1.8}
  uFrequency={1.5}
  uSpeed={0.1}
  uStrength={3}
  cDistance={2.4}
  cameraZoom={1}
  cAzimuthAngle={180}
  cPolarAngle={95}
  uTime={0.2}
  lightType="3d"

  reflection={0.1}
  brightness={0.6}
  grain="off"
  toggleAxis={true}
  hoverState="off"
  enableTransition={true}
/> */}

        {/* SVG Overlay - placed after ShaderGradientBox to appear on top */}
        <Image
  src="/svg/lewis-card-hover-4.svg"
  alt="Bento Intro Silhouette"
  fill
  className="rounded-3xl object-contain absolute top-0 left-0 z-10" // Changed from object-cover to object-contain
  skeletonClassName="rounded-3xl"
  noRelative
  unoptimized
  priority
/>
      </div>

      {/* GitHub Box */}
      <div
        key="github"
        className={`group ${gridItemClass}`}
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <GithubBox />
      </div>

      {/* Tall Gradient Box */}
      <div key="tall-gradient" className={`h-full w-full overflow-hidden ${gridItemClass}`}>
      <ShaderGradientBox
  className="rounded-3xl object-cover transition-opacity duration-300 skeleton"
  animate="on"
  control="props"
  positionX={1.2}
  positionY={0}
  positionZ={0}
  rotationX={50}
  rotationY={20}
  rotationZ={-60}
  color1="#606080" 
  color2="#ffbe7b" // color to tweak
  color3="#212121" 
  wireframe={false}
  shader="a"
  type="waterPlane"
  uAmplitude={1.4}
  uDensity={1.5}
  uFrequency={1.0}
  uSpeed={0.1} // Slightly slowed down for smoother motion
  uStrength={1.5}
  cDistance={2.8}
  cameraZoom={29}
  cAzimuthAngle={180}
  cPolarAngle={80}
  uTime={4}
  lightType="3d"
  reflection={0.4}
  brightness={0.27}
  grain="on"
  // grainBlending=
  toggleAxis={false}
  hoverState="off"
  enableTransition={true}
  />
      </div>
      {/* commented out while refining styles */}
      {/* <div key="tall-gradient" className={`h-full w-full overflow-hidden ${gridItemClass}`}>
      <CurrentActivitiesBox 
    title="Currently"
    activities={[
      { 
        emoji: '📺', 
        label: 'Watching', 
        content: 'Severance' 
      },
      { 
        emoji: '🎧', 
        label: 'Interested in', 
        content: 'Ambient & Brian Eno',
        links: [
          { text: 'Ambient', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY' },
          { text: 'Brian Eno', url: 'https://open.spotify.com/artist/7MSUfLeTdDEoZiJPDSBXgi' }
        ]
      },
      { 
        emoji: '🎵', 
        label: 'Song of the week', 
        content: 'Simon Doty - Tattoo',
        links: [
          { text: 'Simon Doty - Tattoo', url: "https://open.spotify.com/track/508o8MvH1j1ldM4qLvZqe5?si=97be701fec294bb4"},
        ] 
      },
      { 
        emoji: '🔥', 
        label: 'Excited about', 
        content: 'Xfer Serum 2!' 
      },
      { 
        emoji: '💪', 
        label: 'Training', 
        content: 'Cardio for triathalon' 
      }
    ]}
    gradientConfig={{
      color1: "#606080",
      color2: "#ffbe7b",
      color3: "#212121"
    }}
  />
</div> */}

      {/* Discord Status Box */}
      <div key="discord" className={gridItemClass}>
        {lanyard.data && !lanyard.isValidating ? (
          <DiscordPresence lanyard={lanyard.data} onLoad={() => setDiscordLoaded(true)} />
        ) : (
          <Skeleton className="w-full h-full rounded-3xl" />
        )}
      </div>

      {/* Audio Player Box */}
      <div
        key="audiobox"
        className={`group ${gridItemClass}`}
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <AudioBox />
      </div>

      {/* Projects Box */}
      <div
        key="projects"
        className={`group ${gridItemClass}`}
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <SoundcloudBox />
        {/* <ProjectsBox /> */}
      </div>

      {/* Spotify Status Box */}
      <div
        key="spotify"
        className={`group ${gridItemClass}`}
        onMouseEnter={() => setIntroSilhouette(true)}
        onMouseLeave={() => setIntroSilhouette(false)}
      >
        <SpotifyBox />
      </div>

      {/* Skills Box */}
      <div key="tech" className={`flex justify-center items-center ${gridItemClass}`}>
        <SkillsBox />
      </div>

      {/* GitHub Contributions Box */}
      <div
        key="contributions"
        className={`group flex items-center justify-center ${gridItemClass}`}
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
    <KeyboardShortcutsIndicators isDraggable={isDraggable} />
    {/* <MinimalistFooterPills isDraggable={isDraggable} /> */}
    </>
  );
};

// Main export with toast provider
export default function Bento() {
  return (
    <>
        <ToastProvider>
      <BentoWithToast />
      
    </ToastProvider>
    <KeyboardShortcutsIndicators />
    {/* <div className="w-full mx-auto flex h-[60px] justify-around">

            <div className="flex">

              <p className="px-6 py-2 text-xs font-xs text-muted-foreground hover:text-foreground">
                Command + D to toggle dragging</p>
                <p className="px-6 py-2 text-xs font-xs text-muted-foreground hover:text-foreground">
              Command + K to reset layout
              </p>
            </div>
            </div> */}

            
    </>

  );
}