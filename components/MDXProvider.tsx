// components/MDXProvider.tsx
'use client';

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import InfoBox from './mdx/InfoBox';
import Challenge from './mdx/Challenge';
import CodeBlock from './mdx/CodeBlock';

// Import KaTeX CSS for math rendering
import 'katex/dist/katex.min.css';

// Define custom components for MDX
const components = {
  InfoBox,
  Challenge,
  pre: CodeBlock,
  // Add any other custom components here
};

interface MDXWrapperProps {
  children: React.ReactNode;
}

const MDXWrapper: React.FC<MDXWrapperProps> = ({ children }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MDXWrapper;