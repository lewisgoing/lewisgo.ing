// pages/projects/[slug].tsx
import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ProjectLayout from '@/components/projects/ProjectLayout';
import { TOCHeading } from '@/components/projects/TOC';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// MDX components
import Challenge from '@/components/mdx/Challenge';
import InfoBox from '@/components/mdx/InfoBox';
import CodeBlock from '@/components/mdx/CodeBlock';

// Define projects directory path
const projectsDirectory = path.join(process.cwd(), 'content/projects');

// MDX components mapping
const components = {
  Challenge,
  InfoBox,
  pre: CodeBlock,
  // Add any other custom components here
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Check if directory exists first
  if (!fs.existsSync(projectsDirectory)) {
    return { paths: [], fallback: false };
  }

  const fileNames = fs.readdirSync(projectsDirectory);
  
  const paths = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => ({
      params: { slug: fileName.replace(/\.mdx$/, '') },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return { notFound: true };
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Serialize the MDX content
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug, 
        [rehypeAutolinkHeadings, { behavior: 'wrap' }], 
        rehypePrism,
        rehypeKatex
      ],
    },
    scope: data,
  });
  
  // Extract headings for table of contents
  const headings: TOCHeading[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({ id, text, level });
    }
  });
  
  // Get all project files for navigation
  const projectFiles = fs.readdirSync(projectsDirectory)
    .filter(file => file.endsWith('.mdx'));
  
  const projects = projectFiles.map(fileName => {
    const id = fileName.replace(/\.mdx$/, '');
    const filePath = path.join(projectsDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    
    return {
      id,
      title: data.title,
      date: new Date(data.date),
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Find current project index
  const currentIndex = projects.findIndex(project => project.id === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  
  // Parse dates from string to Date objects
  const projectData = {
    ...data,
    id: slug,
    date: new Date(data.date),
  };
  
  return {
    props: {
      project: projectData,
      content: mdxSource,
      headings,
      prevProject,
      nextProject,
    },
  };
};

export default function ProjectPage({ 
  project, 
  content, 
  headings, 
  prevProject, 
  nextProject 
}) {
  return (
    <ProjectLayout
      project={project}
      headings={headings}
      prevProject={prevProject}
      nextProject={nextProject}
    >
      <MDXRemote {...content} components={components} />
    </ProjectLayout>
  );
}