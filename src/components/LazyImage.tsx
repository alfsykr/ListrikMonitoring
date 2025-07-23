import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  placeholderColor?: string;
}

// Shared IntersectionObserver instance to reduce memory usage
const createImageObserver = (options: IntersectionObserverInit) => {
  // Check if the browser supports IntersectionObserver
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          // Set the actual src when image is visible
          img.src = dataSrc;
          // Remove the data-src attribute to prevent potential reloading
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, options);
};

// Create a single shared observer with common options
const sharedImageObserver = createImageObserver({
  threshold: 0.01, // Lower threshold for faster loading
  rootMargin: '100px' // Increased for better performance
});

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderColor = '#f0f0f0'
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !sharedImageObserver) {
      // If no observer support, load image immediately
      if (img) img.src = src;
      return;
    }

    // Start observing the image
    sharedImageObserver.observe(img);
    
    // Cleanup on component unmount
    return () => {
      if (img && sharedImageObserver) {
        sharedImageObserver.unobserve(img);
      }
    };

  }, [src]);

  // Handle image load event
  const handleImageLoaded = () => {
    setIsLoaded(true);
    // Free up memory by removing references
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
    }
  };

  // Handle image error
  const handleImageError = () => {
    console.warn(`Failed to load image: ${src}`);
    // Free up memory by removing references
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
    }
  };

  // Generate a simple SVG placeholder with the specified color
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' fill='${placeholderColor.replace('#', '%23')}'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E`;

  return (
    <img
      ref={imgRef}
      className={`lazy-image ${isLoaded ? 'loaded' : ''} ${className}`}
      alt={alt}
      width={width}
      height={height}
      onLoad={handleImageLoaded}
      onError={handleImageError}
      src={placeholderSvg}
      data-src={src}
      loading="lazy" // Use native lazy loading as a fallback
      style={{
        backgroundColor: placeholderColor,
        transition: 'opacity 0.3s ease',
        opacity: isLoaded ? 1 : 0.5
      }}
    />
  );
};

// Clean up shared observer when component unmounts
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (sharedImageObserver) {
      sharedImageObserver.disconnect();
    }
  });
}