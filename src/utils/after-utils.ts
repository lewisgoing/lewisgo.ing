// src/utils/after-utils.ts
import { unstable_after as after } from 'next/server';

/**
 * Log analytics data after response is sent
 * @param data Data to be logged
 */
export function logAnalyticsAfterResponse(data: Record<string, any>) {
  after(() => {
    // In a real implementation, you'd send this to your analytics service
    console.log('Logging analytics data:', data);
  });
}

/**
 * Update cache after response is sent
 * @param key Cache key to update
 * @param value New value
 */
export function updateCacheAfterResponse(key: string, value: any) {
  after(async () => {
    // Example implementation - in a real app, you'd use your caching solution
    console.log(`Updating cache for ${key}:`, value);
  });
}

/**
 * Record page visit after response is sent
 * @param path Page path
 * @param userId Optional user identifier
 */
export function recordPageVisitAfterResponse(path: string, userId?: string) {
  after(() => {
    const timestamp = new Date().toISOString();
    console.log(`Page visit recorded - Path: ${path}, User: ${userId || 'anonymous'}, Time: ${timestamp}`);
  });
}