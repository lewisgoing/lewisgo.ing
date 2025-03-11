# lewisgo.ing

A modern personal portfolio website with an interactive "bento grid" layout showcasing music, skills, GitHub activity, and real-time Discord status.

<!-- ![Portfolio Preview](https://via.placeholder.com/800x400) -->

## Features

- **Interactive Bento Layout**: Draggable and responsive grid of interactive components
- **Real-time Integrations**:
  - Discord presence via Lanyard API
  - GitHub contribution visualization
  - Spotify/Last.fm current/recently played tracks
- **Audio Playback**: Custom audio player with music samples
- **Visual Effects**: Interactive shader gradients and animations
- **Dark Mode**: Sleek dark-themed design (light mode in development)
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

This project leverages modern web technologies:

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: 
  - Shadcn UI
  - React Grid Layout
- **Animations & Effects**:
  - Framer Motion
  - Three.js
  - ShaderGradient
- **APIs & Integrations**:
  - Lanyard API (Discord)
  - Last.fm API (Music)
  - GitHub Contributions API
- **Data Storage**: Upstash Redis
- **Deployment**: Vercel

## Project Structure

```
/
├── components/         # UI Components
│   ├── assets/         # Asset components
│   ├── boxes/          # Bento box components
│   └── shadcn/         # Shadcn UI components
├── public/             # Static assets
│   ├── audio/          # Music files
│   ├── data/           # Site metadata
│   └── svg/            # SVG assets
├── src/
│   ├── context/        # React context
│   ├── pages/          # Next.js pages
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
└── ...                 # Config files
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lewisgoing/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   LANYARD_KV_KEY=your_lanyard_key
   NEXT_PUBLIC_LANYARD_USER_ID=your_discord_id
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

### Customization

- **Color Theme**: Edit the color variables in `src/styles/globals.css`
- **Layout**: Modify bento grid layouts in `src/utils/bento-layouts.tsx`
- **Content**: Update personal info in `public/data/siteMetaData.js`

## Deployment

This project is optimized for deployment on Vercel.

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure your environment variables
4. Deploy!

## API Integrations

### Lanyard (Discord Status)

This project uses the Lanyard API to display real-time Discord status. You'll need:
- A Discord user ID
- Lanyard API key

### Last.fm / Spotify

The Spotify integration uses Last.fm as a proxy to display currently playing or recently played tracks. To set up:
- Replace my username (trancepilled) with your own in the SpotifyBox component

### GitHub Contributions

The GitHub contribution graph uses a third-party API to fetch and display your contribution history.

## License

MIT © [lewisgoing](https://github.com/lewisgoing)

---

Made with ❤️ using Next.js, TypeScript and Tailwind CSS