'use client';

import { useEffect } from 'react';

export default function ResourcePreloader() {
  useEffect(() => {
    // Preload critical game routes
    const criticalRoutes = [
      '/play/math-adventure',
      '/play/memory-animals',
      '/play/spelling-game',
      '/play/color-patterns'
    ];

    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

    // Preload critical images/emojis
    const criticalEmojis = ['🧮', '🐱', '📝', '🌈', '🍎', '📚'];
    criticalEmojis.forEach(emoji => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '64px Arial';
        ctx.fillText(emoji, 0, 64);
      }
    });

    // Preconnect to external resources
    const preconnectLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectLinks.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

  }, []);

  return null;
}