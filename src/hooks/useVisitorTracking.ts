
import { useEffect } from 'react';
import { trackVisitor } from '../utils/visitorTracking';

/**
 * Hook to track visitor page views
 * @param pageName The name of the page being viewed
 * @param skipTracking Optional flag to skip tracking for certain pages
 */
export const useVisitorTracking = (pageName: string, skipTracking: boolean = false): void => {
  useEffect(() => {
    // Skip tracking if skipTracking is true
    if (skipTracking) {
      console.log(`Tracking skipped for page: ${pageName}`);
      return;
    }
    
    // Track the page visit when the component mounts
    trackVisitor(pageName);
    
    // We don't need to clean up as the tracking should occur once on mount
  }, [pageName, skipTracking]); // Re-track if the page name or skipTracking changes
};
