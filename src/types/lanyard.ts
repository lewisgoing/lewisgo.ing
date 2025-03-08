// src/types/lanyard.ts
// Define proper types for Lanyard API responses

export interface SpotifyData {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    track_id: string;
    timestamps?: {
      start: number;
      end: number;
    };
  }
  
  export interface DiscordUser {
    id: string;
    username: string;
    global_name?: string;
    display_name?: string;
    avatar: string;
    discriminator: string;
    bot?: boolean;
  }
  
  export interface LanyardActivity {
    type: number;
    name: string;
    id: string;
    state?: string;
    details?: string;
    application_id?: string;
    timestamps?: {
      start?: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
  }
  
  export interface LanyardData {
    active_on_discord_desktop: boolean;
    active_on_discord_mobile: boolean;
    active_on_discord_web: boolean;
    activities: LanyardActivity[];
    discord_status: string;
    discord_user: DiscordUser;
    kv: {
      spotify_last_played?: string;
      [key: string]: any;
    };
    listening_to_spotify: boolean;
    spotify?: SpotifyData | null;
  }
  
  export interface LanyardResponse {
    success: boolean;
    data: LanyardData;
  }
  
  // This represents what useLanyard() hook actually returns
  export interface LanyardSWRResponse {
    data?: LanyardResponse;
    error?: Error;
    isValidating: boolean;
    mutate: () => void;
  }