import { useEffect, RefObject } from 'react';

/**
 * Hook that triggers a callback when a click event occurs outside the referenced element
 * @param ref - React ref object for the element to monitor clicks outside of
 * @param handler - Callback function to trigger when a click outside occurs
 */
export const useClickAway = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
