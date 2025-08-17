/**
 * Image optimization utilities for WebP conversion
 */

/**
 * Generates a WebP version URL for an image
 * @param originalSrc - Original image source path
 * @returns WebP version path if available, otherwise original
 */
export function getWebPSrc(originalSrc: string): string {
  // If it's already a WebP, return as is
  if (originalSrc.endsWith('.webp')) {
    return originalSrc;
  }
  
  // Generate WebP path by replacing extension
  const basePath = originalSrc.replace(/\.[^/.]+$/, '');
  return `${basePath}.webp`;
}

/**
 * Checks if WebP is supported in the current browser
 * @returns Promise<boolean> - True if WebP is supported
 */
export function isWebPSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Preloads an image for better performance
 * @param src - Image source to preload
 */
export function preloadImage(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Generates responsive image sources for different screen sizes
 * @param baseSrc - Base image source
 * @param sizes - Array of sizes (e.g., ['300w', '600w', '900w'])
 * @returns Object with srcSet and sizes attributes
 */
export function generateResponsiveImage(baseSrc: string, sizes: string[] = ['300w', '600w', '900w']) {
  const srcSet = sizes.map(size => {
    const width = size.replace('w', '');
    return `${baseSrc}?w=${width} ${size}`;
  }).join(', ');
  
  return {
    srcSet,
    sizes: '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px'
  };
}

/**
 * Optimizes image loading with intersection observer for lazy loading
 * @param selector - CSS selector for images to observe
 * @param options - IntersectionObserver options
 */
export function setupLazyLoading(
  selector: string = 'img[data-src]',
  options: IntersectionObserverInit = {}
): void {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    const images = document.querySelectorAll(selector);
    images.forEach((img: Element) => {
      const imgElement = img as HTMLImageElement;
      if (imgElement.dataset.src) {
        imgElement.src = imgElement.dataset.src;
        imgElement.removeAttribute('data-src');
      }
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options
  });

  const images = document.querySelectorAll(selector);
  images.forEach(img => imageObserver.observe(img));
}
