'use client';

import { useEffect, useCallback } from 'react';

export function useMemoryOptimization() {
  const cleanupMemory = useCallback(() => {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear unused images from memory
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        img.src = '';
      }
    });
    
    // Clear unused event listeners
    const elements = document.querySelectorAll('[data-cleanup]');
    elements.forEach(el => {
      const clone = el.cloneNode(true);
      el.parentNode?.replaceChild(clone, el);
    });
  }, []);

  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading="lazy" if not present
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      
      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async';
      }
    });
  }, []);

  useEffect(() => {
    // Initial optimization
    optimizeImages();
    
    // Cleanup memory every 30 seconds
    const interval = setInterval(cleanupMemory, 30000);
    
    // Cleanup on page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanupMemory();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cleanupMemory, optimizeImages]);

  return { cleanupMemory, optimizeImages };
}