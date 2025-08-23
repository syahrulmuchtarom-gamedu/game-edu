// Performance monitoring utilities
export const measurePerformance = () => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        console.log('🚀 Performance Metrics:', {
          'DNS Lookup': navEntry.domainLookupEnd - navEntry.domainLookupStart,
          'TCP Connection': navEntry.connectEnd - navEntry.connectStart,
          'Request': navEntry.responseStart - navEntry.requestStart,
          'Response': navEntry.responseEnd - navEntry.responseStart,
          'DOM Processing': navEntry.domContentLoadedEventStart - navEntry.responseEnd,
          'Total Load Time': navEntry.loadEventEnd - navEntry.startTime,
        });
      }
      
      if (entry.entryType === 'paint') {
        console.log(`🎨 ${entry.name}: ${entry.startTime}ms`);
      }
      
      if (entry.entryType === 'largest-contentful-paint') {
        console.log(`📏 LCP: ${entry.startTime}ms`);
      }
    }
  });

  observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

  // Memory usage
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('💾 Memory Usage:', {
      'Used': `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      'Total': `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      'Limit': `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`,
    });
  }

  // Bundle size estimation
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;
  scripts.forEach(script => {
    const scriptElement = script as HTMLScriptElement;
    fetch(scriptElement.src, { method: 'HEAD' })
      .then(response => {
        const size = response.headers.get('content-length');
        if (size) totalSize += parseInt(size);
      })
      .catch(() => {});
  });

  setTimeout(() => {
    console.log(`📦 Estimated Bundle Size: ${Math.round(totalSize / 1024)}KB`);
  }, 2000);
};

// FPS monitoring
export const monitorFPS = () => {
  if (typeof window === 'undefined') return;

  let fps = 0;
  let lastTime = performance.now();
  let frames = 0;

  function countFPS() {
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime));
      console.log(`🎯 FPS: ${fps}`);
      frames = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(countFPS);
  }
  
  requestAnimationFrame(countFPS);
};