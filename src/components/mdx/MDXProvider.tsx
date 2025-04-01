// components/MDXProvider.tsx
'use client';

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import InfoBox from '@/components/mdx/InfoBox';
import Challenge from '@/components/mdx/Challenge';
import CodeBlock from '@/components/mdx/CodeBlock';
import AudioPlayer from '@/components/mdx/AudioPlayer';
import Badge from '@/components/mdx/Badge'
import ProjectCard from '@/components/mdx/ProjectCard';
import ProjectMetrics from '@/components/mdx/ProjectMetrics'
import ResearchPublication from '@/components/mdx/ResearchPublication';
import TechStack from '@/components/mdx/TechStack';
import WebAudioDemo from '@/components/mdx/WebAudioDemo';


// Import KaTeX CSS for math rendering
import 'katex/dist/katex.min.css';

// Define custom components for MDX
const components = {
  InfoBox,
  Challenge,
  ProjectCard,
  CodeBlock,
  AudioPlayer,
  Badge,
  ProjectMetrics,
  ResearchPublication,
  TechStack,
  WebAudioDemo
  // Add any other custom components here
};

interface MDXWrapperProps {
  children: React.ReactNode;
}

const MDXWrapper: React.FC<MDXWrapperProps> = ({ children }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MDXWrapper;