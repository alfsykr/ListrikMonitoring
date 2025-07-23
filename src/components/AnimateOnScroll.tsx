import React, { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-up';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  type: AnimationType;
  delay?: 100 | 200 | 300 | 400 | 500;
  className?: string;
}

// Shared IntersectionObserver instance to reduce memory usage
const createObserver = (options: IntersectionObserverInit) => {
  // Check if the browser supports IntersectionObserver
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        // Add the animate-active class when element is visible
        element.classList.add('animate-active');
        // Unobserve after animation is triggered
        observer.unobserve(element);
        
        // Clean up will-change after animation completes to free up resources
        const animationDuration = 500; // 0.5s animation + buffer
        setTimeout(() => {
          if (element && document.body.contains(element)) {
            element.style.willChange = 'auto';
          }
        }, animationDuration + 50);
      }
    });
  }, options);
};

// Create a single shared observer with common options
const sharedObserver = createObserver({
  threshold: 0.1, // Trigger when 10% of element is visible
  rootMargin: '20px' // Slightly increased for better performance
});

export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  type,
  delay,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  // Check for reduced motion preference
  const [prefersReducedMotion] = useState(
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !sharedObserver || prefersReducedMotion) {
      // If reduced motion is preferred, make content visible immediately
      if (element && prefersReducedMotion) {
        element.style.opacity = '1';
        element.style.transform = 'none';
      }
      return;
    }

    // Start observing the element
    sharedObserver.observe(element);

    // Cleanup observer on component unmount
    return () => {
      if (element && sharedObserver) {
        sharedObserver.unobserve(element);
      }
    };
  }, [prefersReducedMotion]);

  // Construct animation classes
  const animationClass = prefersReducedMotion ? '' : `animate-${type}`;
  const delayClass = (delay && !prefersReducedMotion) ? `animate-delay-${delay}` : '';

  return (
    <div
      ref={elementRef}
      className={`${animationClass} ${delayClass} ${className}`}
      style={prefersReducedMotion ? { opacity: 1, transform: 'none' } : undefined}
    >
      {children}
    </div>
  );
};

// Clean up shared observer when component unmounts
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (sharedObserver) {
      sharedObserver.disconnect();
    }
  });
}