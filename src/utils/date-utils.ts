// src/utils/date-utils.ts

/**
 * Format a date string or Date object into a readable format
 * @param date ISO date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'Unknown date';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  }
  
  /**
   * Convert an ISO date string to a Date object
   * @param dateString ISO date string
   * @returns Date object
   */
  export function parseDateString(dateString: string): Date {
    return new Date(dateString);
  }
  
  /**
   * Format a date for display in project cards
   * @param date ISO date string or Date object
   * @returns Short formatted date (e.g., "Mar 2023")
   */
  export function formatShortDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  }