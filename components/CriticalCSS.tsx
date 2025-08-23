'use client';

import { useEffect } from 'react';

export default function CriticalCSS() {
  useEffect(() => {
    // Load fonts normally to avoid preload warnings
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    document.head.appendChild(link);

    // Remove unused CSS after load
    const removeUnusedCSS = () => {
      const unusedSelectors = [
        '.hidden',
        '.sr-only',
        '.not-sr-only',
        '.focus\\:not-sr-only',
        '.motion-reduce\\:transition-none',
        '.motion-reduce\\:animate-none'
      ];
      
      unusedSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          if (elements.length === 0) {
            // Remove unused CSS rules
            for (let i = 0; i < document.styleSheets.length; i++) {
              try {
                const sheet = document.styleSheets[i];
                if (sheet.cssRules) {
                  for (let j = sheet.cssRules.length - 1; j >= 0; j--) {
                    const rule = sheet.cssRules[j] as CSSStyleRule;
                    if (rule.selectorText && rule.selectorText.includes(selector.replace('\\', ''))) {
                      sheet.deleteRule(j);
                    }
                  }
                }
              } catch (e) {
                // Cross-origin stylesheets
              }
            }
          }
        } catch (e) {
          // Invalid selector
        }
      });
    };

    setTimeout(removeUnusedCSS, 2000);
  }, []);

  return null;
}