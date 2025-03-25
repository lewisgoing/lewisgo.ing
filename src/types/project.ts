// src/types/project.ts

/**
 * Defines the structure of a project
 */
export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    status?: 'completed' | 'in-progress' | 'planned';
    completedDate?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    thumbnailUrl?: string;
    projectUrl: string;
    featured?: boolean;
    category: 'web' | 'mobile' | 'design' | 'other' | 'research' | 'audio';
    images?: string[];
    detailedContent?: string;
  }

  export const harmonyHubProject: Project = {
    id: "harmony-hub",
    title: "Harmony Hub",
    description: "A personalized audio experience app for adults with hearing impairments, featuring tinnitus relief and customizable equalization.",
    longDescription: "Harmony Hub is an innovative web application designed to enhance the music listening experience for adults with hearing impairments. By leveraging advanced audio processing technology, it provides personalized sound adjustments and tinnitus relief through customizable equalization settings. The app features a clinically-validated tinnitus calibration system, split ear mode for asymmetric hearing conditions, preset management, and cloud synchronization to provide a truly accessible music experience.",
    status: "completed",
    completedDate: "March 2025",
    technologies: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Web Audio API",
      "Firebase",
      "Framer Motion",
      "Shadcn UI",
      "Firestore",
      "Vercel"
    ],
    projectUrl: "/projects/capstone",
    githubUrl: "https://github.com/lewisgoing/INFO-capstone-hearingheroes",
    liveUrl: "https://hearingheroes.vercel.app/",
    featured: true,
    category: "web",
    images: [
      "/projects/harmony-hub/main-view.png",
      "/projects/harmony-hub/tinnitus-calibration.png",
      "/projects/harmony-hub/split-ear-mode.png",
      "/projects/harmony-hub/mobile-view.png"
    ],
    detailedContent: `
      <h3>Project Overview</h3>
      <p>
        Harmony Hub aims to bridge the gap between music enjoyment and hearing impairments by providing tools that allow users to personalize their listening experience. Our application particularly focuses on supporting individuals with tinnitus through evidence-based sound therapy approaches integrated into a music player.
      </p>
      
      <h3>Key Features</h3>
      
      <h4>🎚️ Personalized Equalizer</h4>
      <p>
        Interactive EQ with frequency band adjustments, allowing users to customize sound based on their hearing profile. Double-click points to adjust Q-value (width of frequency adjustments) with visual feedback through real-time frequency response curves.
      </p>
      
      <h4>🔊 Tinnitus Calibration</h4>
      <p>
        A step-by-step wizard guides users to identify their exact tinnitus frequency and creates personalized "notch filter" presets based on clinical research. This evidence-based approach uses notched sound therapy techniques shown to reduce tinnitus perception over time.
      </p>
      
      <h4>👂 Split Ear Mode</h4>
      <p>
        Configures different EQ settings for each ear with independent preset selection for left and right channels and balance control between them - perfect for asymmetric hearing conditions.
      </p>
      
      <h4>💾 Presets Management</h4>
      <p>
        Includes built-in presets designed for common hearing needs, custom user presets for personal configurations, and specialized tinnitus presets created through the calibration process.
      </p>
      
      <h4>☁️ Cloud Sync</h4>
      <p>
        Save settings across devices with cloud synchronization when signed in, with offline functionality through local storage for a seamless experience.
      </p>
      
      <h3>Research Background</h3>
      <p>
        Harmony Hub's tinnitus relief features are based on peer-reviewed research on notched sound therapy, including Okamoto et al. (2010) - "Listening to tailor-made notched music reduces tinnitus loudness" and Pantev et al. (2012) - "Transient auditory plasticity in human auditory cortex induced by tailor-made notched music training."
      </p>
      
      <h3>Development Team</h3>
      <p>
        This project was developed by the Hearing Heroes team for the INFO Capstone 2024-2025 at the University of Washington, including Lewis Going, Bella Gatz, Paul Garces, Nathaniel Sayasack, and Brooke Pedersen.
      </p>
      
      <h3>Technical Implementation</h3>
      <p>
        The application leverages the Web Audio API for real-time audio processing, with custom hooks for managing EQ settings, audio context, and cloud synchronization. The UI is built with Next.js, TypeScript, and Tailwind CSS, with Framer Motion for smooth animations and transitions. Firebase and Firestore provide authentication and database features for cloud synchronization.
      </p>
      
      <h3>Future Development</h3>
      <p>
        Plans for future development include a native mobile app, integration with streaming services like YouTube and SoundCloud, advanced calibration features, haptic feedback support, AI-driven personalized recommendations, and community features for sharing presets.
      </p>
    `
  };
  
  /**
   * Collection of all projects
   */
  export const projects: Project[] = [
    harmonyHubProject,
    {
      id: "portfolio",
      title: "Portfolio Website",
      category: "web",
      description: "A modern personal website with interactive bento grid layout",
      longDescription: "This modern portfolio website showcases my skills and projects using a unique 'bento grid' layout that provides an interactive and visually engaging experience. Built with Next.js, TypeScript, and Tailwind CSS, it features real-time integrations with external services like Discord, GitHub, and Spotify. The site includes responsive design for all devices, interactive components, and optimized performance.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React Grid Layout", "Framer Motion"],
      thumbnailUrl: "/svg/discord.svg",
      projectUrl: "/projects/portfolio",
      githubUrl: "https://github.com/lewisgoing/portfolio",
      liveUrl: "https://lewisgo.ing",
      images: ["/svg/discord.svg", "/svg/discord.svg", "/svg/discord.svg"],
      completedDate: "2024-03",
      status: "completed"
    },
    {
      id: "music-tools",
      title: "Node-based Web Audio Playground",
      category: "web",
      description: "Audio processing tools for music production workflow",
      longDescription: "A collection of custom audio processing tools designed to enhance music production workflow. These tools include a harmonic analyzer, a vocal processing chain, and a MIDI arpeggiator with unique pattern generation capabilities. Built using React for the interface and the Web Audio API for real-time audio processing, these tools integrate with standard digital audio workstations through a custom plugin architecture.",
      technologies: ["React", "Web Audio API", "Node.js", "TypeScript", "TailwindCSS"],
      thumbnailUrl: "/svg/discord.svg",
      projectUrl: "/projects/music-tools",
      githubUrl: "https://github.com/lewisgoing/music-tools",
      liveUrl: "https://tools.lewisgo.ing",
      images: ["/svg/discord.svg", "/svg/discord.svg"],
    //   completedDate: "2023-11",
      status: "in-progress"
    },
    {
        id: "dis-paper",
        title: "Exploring the Collaborative Co-Creation Process with AI: A Case Study in Novice Music Production",
        category: "research",
        description: "...",
        longDescription: "...",
        technologies: ["Human-Centered Design", "Qualitative Research"],
        thumbnailUrl: "/svg/discord.svg",
        projectUrl: "/projects/dis-paper",
        githubUrl: "https://github.com/lewisgoing/",
        liveUrl: "https://arxiv.org/abs/2501.15276",
        images: ["/svg/discord.svg", "/svg/discord.svg"],
        completedDate: "2025-01",
        status: "completed"
      },
      {
        id: "ismir-paper",
        title: "ISMIR Paper",
        category: "research",
        description: "...",
        longDescription: "...",
        technologies: ["Human-Centered Design", "Qualitative Research"],
        thumbnailUrl: "/svg/discord.svg",
        projectUrl: "/projects/dis-paper",
        githubUrl: "https://github.com/lewisgoing/",
        liveUrl: "https://arxiv.org/abs/2501.15276",
        images: ["/svg/discord.svg", "/svg/discord.svg"],
        completedDate: "2025-03",
        status: "completed"
      },
      {
        id: "music-homepage",
        title: "Music Production Link Homepage",
        category: "web",
        description: "...",
        longDescription: "...",
        technologies: ["NextJS", "Creative Coding", "UX Design"],
        thumbnailUrl: "/svg/discord.svg",
        projectUrl: "/projects/dis-paper",
        githubUrl: "https://github.com/lewisgoing/lewisgoing-music-homepage",
        liveUrl: "https://lewisgoing.vercel.app/",
        images: ["/svg/discord.svg", "/svg/discord.svg"],
        completedDate: "2025-05",
        status: "completed"
      },
  ];
  
  /**
   * Get all projects
   */
  export function getAllProjects(): Project[] {
    return projects;
  }
  
// Function to get a project by ID
export function getProjectById(id: string): Project | undefined {
    return projects.find(project => project.id === id);
  }
  
  // Function to get related projects (based on category or technologies)
  export function getRelatedProjects(currentProjectId: string, limit: number = 3): Project[] {
    const currentProject = getProjectById(currentProjectId);
    
    if (!currentProject) return [];
    
    return projects
      .filter(project => 
        project.id !== currentProjectId && 
        (project.category === currentProject.category || 
         project.technologies.some(tech => 
           currentProject.technologies.includes(tech)))
      )
      .slice(0, limit);
  }