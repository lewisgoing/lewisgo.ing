// src/utils/cache-utils.ts
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

/**
 * Utility function to apply blog content caching profile
 * Suitable for content that changes infrequently (blog posts, etc.)
 */
export function applyBlogCacheProfile() {
  'use cache';
  cacheLife('blog');
}

/**
 * Utility function to apply static content caching profile
 * Suitable for content that rarely changes (assets, static pages)
 */
export function applyStaticContentCacheProfile() {
  'use cache';
  cacheLife('staticContent');
}

/**
 * Tags content related to Spotify data for revalidation
 */
export function tagSpotifyContent() {
  'use cache';
  cacheTag('spotify-data');
}

/**
 * Tags content related to Discord data for revalidation
 */
export function tagDiscordContent() {
  'use cache';
  cacheTag('discord-data');
}

/**
 * Tags content related to GitHub data for revalidation
 */
export function tagGithubContent() {
  'use cache';
  cacheTag('github-data');
}