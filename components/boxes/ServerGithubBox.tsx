'use cache';

import { MoveUpRight } from 'lucide-react';
import GitHubClientWrapper from './GitHubClientWrapper';

// Make this an async function to work with 'use cache'
export default async function ServerGithubBox() {
  // You could fetch GitHub data here if needed
  // const userData = await fetch('https://api.github.com/users/lewisgoing')
  //   .then(res => res.json());
  
  return (
    <GitHubClientWrapper />
  );
}