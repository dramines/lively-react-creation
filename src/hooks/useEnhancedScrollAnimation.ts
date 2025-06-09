
import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setTimeout(() => {
            setIsVisible(true);
            if (triggerOnce) {
              setHasTriggered(true);
            }
          }, delay + staggerDelay);
          
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { 
        threshold,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, triggerOnce, delay, staggerDelay, hasTriggered]);

  return { ref, isVisible };
};
