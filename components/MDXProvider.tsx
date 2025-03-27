// components/MDXProvider.tsx
'use client';

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import InfoBox from './mdx/InfoBox';
import Challenge from './mdx/Challenge';
import CodeBlock from './mdx/CodeBlock';
import AudioPlayer from './mdx/AudioPlayer';
import Badge from './mdx/Badge'
import ProjectCard from './mdx/ProjectCard';
import ProjectMetrics from './mdx/ProjectMetrics'
import ResearchPublication from './mdx/ResearchPublication';
import TechStack from './mdx/TechStack';
import WebAudioDemo from './mdx/WebAudioDemo';


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