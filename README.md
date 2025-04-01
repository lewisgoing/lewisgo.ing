# lewisgo.ing

A modern personal portfolio website with an interactive "bento grid" layout showcasing music, skills, GitHub activity, and real-time Discord status.

## Features

- **Interactive Bento Layout**: Responsive grid of interactive components
- **Real-time Integrations**:
  - Discord presence via Lanyard API
  - GitHub contribution visualization
  - Music playback and status
- **Audio Playback**: Custom audio player with music samples
- **Visual Effects**: Interactive shader gradients and animations
- **Dark/Light Mode**: Theme switching with persisted preference
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **MDX Content**: Rich content with syntax highlighting and math

## Tech Stack

This project leverages modern web technologies:

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS with typography plugin
- **Components**: 
  - Radix UI primitives
  - Custom UI components
  - React Grid Layout
- **Animations & Effects**:
  - Framer Motion
  - GSAP
  - Three.js / React Three Fiber
  - ShaderGradient
  - Lottie animations
- **Content**: MDX with remark/rehype plugins
- **APIs & Integrations**:
  - Lanyard API (Discord)
  - Last.fm API (Music)
  - GitHub Contributions
- **Data Storage**: 
  - Upstash Redis
  - Vercel Blob
- **Deployment**: Vercel

## Project Structure

```
/
├── content/            # MDX content files
│   └── projects/       # Project content
├── public/             # Static assets
│   ├── audio/          # Music files
│   ├── data/           # Site metadata
│   ├── images/         # Images and artwork
│   └── svg/            # SVG assets
├── src/
│   ├── components/     # UI Components
│   │   ├── assets/     # Asset components
│   │   ├── common/     # Common UI elements
│   │   ├── features/   # Feature components
│   │   │   ├── about/  # About page components
│   │   │   ├── bento/  # Bento grid components
│   │   │   └── projects/ # Project components
│   │   ├── layout/     # Layout components
│   │   ├── mdx/        # MDX rendering components
│   │   ├── shared/     # Shared components
│   │   └── ui/         # Base UI components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
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
   git clone https://github.com/lewisgoing/lewisgo.ing.git
   cd lewisgo.ing
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the required variables.

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
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run format:check` - Check formatting

### Customization

- **Theme**: Edit theme configuration in ThemeProviders.tsx
- **Layout**: Modify bento grid layouts in `src/utils/bento-layouts.tsx`
- **Content**: Update site metadata in `public/data/siteMetaData.js`

## Deployment

This project is optimized for deployment on Vercel.

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure your environment variables
4. Deploy!

## API Integrations

### Lanyard (Discord Status)

This project uses the Lanyard API to display real-time Discord status.

### Last.fm / Music

Music integration to display currently playing or recently played tracks.

### GitHub Contributions

GitHub contribution graph visualization of activity history.

## License

MIT © [lewisgoing](https://github.com/lewisgoing)

---

Made with ❤️ using Next.js, TypeScript and Tailwind CSS