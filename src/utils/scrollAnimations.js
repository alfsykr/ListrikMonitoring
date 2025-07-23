/**
 * Utility for handling scroll animations using Intersection Observer API
 * Optimized for lower RAM usage
 */

// Shared observer instances to reduce memory usage
let animationObserver = null;
let batchSize = 15; // Process elements in batches to reduce load
let processingQueue = [];
let isProcessing = false;

// Initialize animation on elements with animation classes
export const initScrollAnimations = () => {
  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without support - just show all elements
    document.querySelectorAll(
      '.animate-fade-in, .animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-scale-up'
    ).forEach(el => {
      el.classList.add('animate-active');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return null;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // If user prefers reduced motion, disable animations
    document.querySelectorAll(
      '.animate-fade-in, .animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-scale-up'
    ).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.willChange = 'auto';
    });
    return null;
  }

  // Get all elements with animation classes
  const animatedElements = document.querySelectorAll(
    '.animate-fade-in, .animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-scale-up'
  );

  // If no elements found, return
  if (!animatedElements.length) return null;

  // Create observer options
  const observerOptions = {
    root: null, // viewport is root
    rootMargin: '20px', // slightly increased margin for better performance
    threshold: 0.05 // lower threshold to trigger earlier
  };

  // Process elements in batches to reduce memory pressure
  const processNextBatch = () => {
    if (processingQueue.length === 0) {
      isProcessing = false;
      return;
    }
    
    isProcessing = true;
    const batch = processingQueue.splice(0, batchSize);
    
    batch.forEach(element => {
      if (animationObserver) {
        animationObserver.observe(element);
      }
    });
    
    // Schedule next batch with a small delay to avoid blocking the main thread
    setTimeout(processNextBatch, 10);
  };

  // Create observer if it doesn't exist
  if (!animationObserver) {
    animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If element is intersecting (visible)
        if (entry.isIntersecting) {
          const element = entry.target;
          // Add active class to trigger animation
          element.classList.add('animate-active');
          
          // Clean up will-change after animation completes to free up resources
          const animationDuration = 500; // 0.5s animation + buffer
          setTimeout(() => {
            if (element && document.body.contains(element)) {
              element.style.willChange = 'auto';
            }
          }, animationDuration + 50);
          
          // Unobserve element after animation is triggered
          animationObserver.unobserve(element);
        }
      });
    }, observerOptions);
  }

  // Add elements to processing queue
  processingQueue = Array.from(animatedElements);
  
  // Start processing if not already in progress
  if (!isProcessing) {
    processNextBatch();
  }

  // Return cleanup function
  return () => {
    if (animationObserver) {
      animationObserver.disconnect();
      animationObserver = null;
    }
    processingQueue = [];
    isProcessing = false;
  };
};

// Shared observer for lazy loading
let lazyLoadObserver = null;
let lazyLoadQueue = [];
let isLoadingImages = false;

// Initialize lazy loading for images
export const initLazyLoading = () => {
  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without support - load all images immediately
    document.querySelectorAll('img.lazy-image').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      }
    });
    return null;
  }

  // Get all images with lazy-image class
  const lazyImages = document.querySelectorAll('img.lazy-image');

  // If no images found, return
  if (!lazyImages.length) return null;

  // Process images in batches to reduce memory pressure
  const processNextImageBatch = () => {
    if (lazyLoadQueue.length === 0) {
      isLoadingImages = false;
      return;
    }
    
    isLoadingImages = true;
    const batch = lazyLoadQueue.splice(0, batchSize);
    
    batch.forEach(img => {
      if (lazyLoadObserver) {
        lazyLoadObserver.observe(img);
      }
    });
    
    // Schedule next batch with a small delay
    setTimeout(processNextImageBatch, 10);
  };

  // Create observer options
  const observerOptions = {
    root: null,
    rootMargin: '100px', // increased for better performance
    threshold: 0.01 // lower threshold to load earlier
  };

  // Create observer if it doesn't exist
  if (!lazyLoadObserver) {
    lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // If data-src attribute exists, set src to data-src
          if (img.dataset.src) {
            const src = img.dataset.src;
            
            // Set src attribute
            img.src = src;
            
            // When image is loaded, add loaded class and clean up
            img.onload = () => {
              img.classList.add('loaded');
              img.onload = null;
              img.onerror = null;
              // Remove data-src to prevent potential reloading
              img.removeAttribute('data-src');
            };
            
            // Handle load errors
            img.onerror = () => {
              console.warn(`Failed to load image: ${src}`);
              img.onload = null;
              img.onerror = null;
            };
          }
          
          // Unobserve image after loading
          lazyLoadObserver.unobserve(img);
        }
      });
    }, observerOptions);
  }

  // Add images to processing queue
  lazyLoadQueue = Array.from(lazyImages);
  
  // Start processing if not already in progress
  if (!isLoadingImages) {
    processNextImageBatch();
  }

  // Return cleanup function
  return () => {
    if (lazyLoadObserver) {
      lazyLoadObserver.disconnect();
      lazyLoadObserver = null;
    }
    lazyLoadQueue = [];
    isLoadingImages = false;
  };
};

// Clean up observers when window unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (animationObserver) {
      animationObserver.disconnect();
      animationObserver = null;
    }
    if (lazyLoadObserver) {
      lazyLoadObserver.disconnect();
      lazyLoadObserver = null;
    }
    processingQueue = [];
    lazyLoadQueue = [];
    isProcessing = false;
    isLoadingImages = false;
  });
}