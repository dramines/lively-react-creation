
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseEnhancedScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  staggerDelay?: number;
}

export const useEnhancedScrollAnimation = (options: UseEnhancedScrollAnimationOptions = {}) => {
  const { threshold = 0.1, triggerOnce = true, delay = 0, staggerDelay = 0 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && !hasTriggered) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        if (triggerOnce) {
          setHasTriggered(true);
        }
      }, delay + staggerDelay);
    } else if (!triggerOnce && !entry.isIntersecting) {
      setIsVisible(false);
    }
  }, [hasTriggered, triggerOnce, delay, staggerDelay]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { 
      threshold,
      rootMargin: '50px 0px -50px 0px'
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, handleIntersection]);

  return { ref, isVisible };
};
