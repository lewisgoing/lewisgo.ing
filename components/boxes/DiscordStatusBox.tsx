// components/boxes/DiscordStatusBox.tsx
import Image from 'next/image'
import React, { useEffect, useState, useCallback, memo } from 'react'
import { FaDiscord } from 'react-icons/fa'

// Define proper TypeScript interfaces
interface DiscordUser {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  discriminator?: string;
}

interface Activity {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id: string;
  timestamps?: {
    start: number;
    end?: number;
  };
  assets?: {
    large_image: string;
    small_image: string;
    large_text?: string;
    small_text?: string;
  };
}

interface LanyardData {
  data: {
    discord_user: DiscordUser;
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
    activities: Activity[];
  }
}

interface DiscordStatusBoxProps {
  lanyard: LanyardData;
  onLoad?: () => void;
}

/**
 * Format elapsed time from a Unix timestamp
 */
const getElapsedTime = (unixTimestamp: number): string => {
  const createdAt = new Date(unixTimestamp)
  const now = new Date()
  let difference = now.getTime() - createdAt.getTime()

  const hours = Math.floor(difference / (1000 * 60 * 60))
  difference -= hours * (1000 * 60 * 60)

  const minutes = Math.floor(difference / (1000 * 60))
  difference -= minutes * (1000 * 60)

  const seconds = Math.floor(difference / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString().padStart(2, '0')} elapsed`
}

/**
 * StatusIndicator component to display Discord status
 */
const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'online':
      return (
        <div className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary border-4 border-background" />
      );
    case 'idle':
      return (
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary border-4 border-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-[10px] h-[10px] rounded-full" />
        </div>
      );
    case 'dnd':
      return (
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-destructive flex items-center justify-center border-4 border-background">
          <div className="bg-background w-[11px] h-[4px] rounded-full" />
        </div>
      );
    default: // offline
      return (
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center border-4 border-background">
          <div className="bg-background w-2 h-2 rounded-full" />
        </div>
      );
  }
};

/**
 * Mobile version of the status indicator
 */
const MobileStatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'online':
      return (
        <div className="absolute -bottom-0 right-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary border-4 border-background" />
      );
    case 'idle':
      return (
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary border-4 border-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background w-[7px] h-[7px] rounded-full" />
        </div>
      );
    case 'dnd':
      return (
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-destructive flex items-center justify-center border-4 border-background">
          <div className="bg-background w-2 h-1 rounded-full" />
        </div>
      );
    default: // offline
      return (
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-muted-foreground flex items-center justify-center border-4 border-background">
          <div className="bg-background w-[6px] h-[6px] rounded-full" />
        </div>
      );
  }
};

/**
 * ActivityDisplay component to render the current Discord activity
 */
const ActivityDisplay: React.FC<{
  activity: Activity;
  elapsedTime: string;
}> = memo(({ activity, elapsedTime }) => {
  return (
    <>
      <div className="relative">
        <Image
          src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets?.large_image}.png`}
          alt="Discord Activity"
          width={0}
          height={0}
          className="w-16 rounded-lg grayscale"
          unoptimized
        />
        {activity.assets?.small_image && (
          <Image
            src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`}
            alt="Activity Details"
            width={0}
            height={0}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-border grayscale"
            unoptimized
          />
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-xs leading-relaxed line-clamp-1">
          {activity.name}
        </div>
        {activity.details && (
          <div className="text-[10px] text-muted-foreground line-clamp-1">
            {activity.details}
          </div>
        )}
        {activity.state && (
          <div className="text-[10px] text-muted-foreground line-clamp-1">
            {activity.state}
          </div>
        )}
        {elapsedTime && (
          <div className="text-[10px] text-muted-foreground">
            {elapsedTime}
          </div>
        )}
      </div>
    </>
  );
});

ActivityDisplay.displayName = 'ActivityDisplay';

/**
 * DiscordStatusBox - Display your Discord status and activity
 */
const DiscordStatusBox: React.FC<DiscordStatusBoxProps> = ({ lanyard, onLoad }) => {
  // Find a valid activity (type 0 with assets)
  const mainActivity = lanyard.data.activities.find(
    (activity) => activity.type === 0 && activity.assets
  );
  
  const hasMainActivity = !!mainActivity;
  
  // Track elapsed time
  const [elapsedTime, setElapsedTime] = useState<string>(
    mainActivity?.timestamps?.start
      ? getElapsedTime(mainActivity.timestamps.start)
      : ''
  );
  
  // Update elapsed time every second if we have a start timestamp
  useEffect(() => {
    if (mainActivity?.timestamps?.start) {
      const interval = setInterval(() => {
        setElapsedTime(getElapsedTime(mainActivity.timestamps.start));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mainActivity]);
  
  // Call onLoad callback when activity data is available
  useEffect(() => {
    if (hasMainActivity && onLoad) {
      onLoad();
    }
  }, [hasMainActivity, onLoad]);
  
  // Helper to render the empty activity fallback
  const renderEmptyActivity = useCallback(() => (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Image
        src="svg/discord.svg"
        alt="No Discord activity"
        width={0}
        height={0}
        className="h-full w-fit rounded-lg"
      />
    </div>
  ), []);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden bento-lg:relative w-full h-full bento-lg:flex flex-col">
        {/* User Avatar with Status */}
        <div className="absolute top-5 left-4 z-10">
          <div className="relative">
            <Image
              className="rounded-full grayscale"
              src={`https://api.lanyard.rest/${lanyard.data.discord_user.id}.png`}
              alt="Discord Avatar"
              width={96}
              height={96}
            />
            <StatusIndicator status={lanyard.data.discord_status} />
          </div>
        </div>
        
        {/* Discord Logo */}
        <div className="absolute right-0 top-0 z-20 w-14 h-14 flex items-center justify-center m-3 rounded-full bg-primary">
          <FaDiscord size={50} className="text-secondary p-1" />
        </div>
        
        {/* Top Header */}
        <div className="bg-tertiary/50 w-full h-[80px] rounded-t-3xl flex-shrink-0" />
        
        {/* Content */}
        <div className="m-3 flex flex-col h-full gap-3">
          {/* Badges */}
          <div className="h-6 flex-shrink-0">
            <div className="bg-tertiary/50 rounded-lg w-[40%] h-full ml-auto">
              <Image
                src="svg/discord-badges.svg"
                alt="Discord Badges"
                width={0}
                height={0}
                className="w-full rounded-lg grayscale"
              />
            </div>
          </div>
          
          {/* Username */}
          <div className="text-sm h-fit px-2 py-1 rounded-lg bg-tertiary/50 leading-snug">
            <div>{lanyard.data.discord_user.display_name}</div>
            <div className="text-[10px] text-muted-foreground">
              @{lanyard.data.discord_user.username}
            </div>
          </div>
          
          {/* Activity */}
          <div className="flex h-full p-2 rounded-lg bg-tertiary/50 leading-snug gap-2 items-center">
            {hasMainActivity ? (
              <ActivityDisplay activity={mainActivity} elapsedTime={elapsedTime} />
            ) : (
              renderEmptyActivity()
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile/Tablet Layout */}
      <div className="relative w-full h-full flex flex-col bento-lg:hidden">
        <div className="flex flex-col h-full gap-2 m-2 justify-between">
          {/* User Info and Badges */}
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  className="bento-sm:w-[55px] bento-sm:h-[55px] bento-md:w-[70px] bento-md:h-[70px] rounded-full grayscale"
                  src={`https://api.lanyard.rest/${lanyard.data.discord_user.id}.png`}
                  alt="Discord Avatar"
                  width={96}
                  height={96}
                  unoptimized
                />
                <MobileStatusIndicator status={lanyard.data.discord_status} />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-sm leading-snug ml-1">
                <div>{lanyard.data.discord_user.display_name}</div>
                <div className="text-[10px] text-muted-foreground">
                  @{lanyard.data.discord_user.username}
                </div>
              </div>
              <Image
                src="svg/discord-badges.svg"
                alt="Discord Badges"
                width={0}
                height={0}
                className="h-full w-full rounded-md grayscale"
              />
            </div>
          </div>
          
          {/* Activity */}
          <div className="flex h-full py-1 px-2 bento-md:p-2 bg-tertiary/50 leading-snug gap-2 items-center rounded-2xl">
            {hasMainActivity ? (
              <ActivityDisplay activity={mainActivity} elapsedTime={elapsedTime} />
            ) : (
              renderEmptyActivity()
            )}
          </div>
          
          {/* Discord Logo */}
          <div className="absolute right-0 top-0 z-10 w-14 h-14 flex items-center justify-center m-3 rounded-full bg-primary">
            <FaDiscord size={40} className="text-secondary p-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(DiscordStatusBox);