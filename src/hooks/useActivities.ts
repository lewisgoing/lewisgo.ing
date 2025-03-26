// src/hooks/useActivities.ts
import { useState, useEffect } from 'react';

export interface Activity {
  emoji: string;
  label: string;
  content: string;
}

/**
 * Hook to manage current activities
 * This could be expanded to fetch from an API, local storage, or other data sources
 */
export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([
    { emoji: '📺', label: 'Watching', content: 'Severance' },
    { emoji: '🎧', label: 'Interested in', content: 'Ambient & Brian Eno' },
    { emoji: '🎵', label: 'Song of the week', content: 'Closer' },
    { emoji: '🔥', label: 'Excited about', content: 'Serum 2!' },
    { emoji: '💪', label: 'Training', content: 'Cardio' },
  ]);

  const updateActivity = (index: number, newActivity: Partial<Activity>) => {
    setActivities(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], ...newActivity };
      return updated;
    });
  };

  const addActivity = (activity: Activity) => {
    setActivities(current => [...current, activity]);
  };

  const removeActivity = (index: number) => {
    setActivities(current => current.filter((_, i) => i !== index));
  };

  return {
    activities,
    updateActivity,
    addActivity,
    removeActivity,
  };
}

// How to use with Bento.tsx
/*
import { useActivities } from '../src/hooks/useActivities';

// Inside your Bento component
const { activities } = useActivities();

// Then in your JSX
<div key="tall-gradient" className={`h-full w-full overflow-hidden ${gridItemClass}`}>
  <CurrentActivitiesBox 
    title="Currently"
    activities={activities}
    gradientConfig={{
      color1: "#FF0006",
      color2: "#003FFF",
      color3: "#4AA6FF"
    }}
  />
</div>
*/

// To persist activities between sessions, you could add localStorage support:
/*
// Enhanced version with localStorage persistence
export function useActivities() {
  // Initialize state from localStorage if available
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window === 'undefined') return defaultActivities;
    
    const saved = localStorage.getItem('currentActivities');
    return saved ? JSON.parse(saved) : defaultActivities;
  });

  // Save to localStorage when activities change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentActivities', JSON.stringify(activities));
    }
  }, [activities]);

  // Rest of the hook implementation...
}
*/