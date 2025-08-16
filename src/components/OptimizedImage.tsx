import React, { useState, useEffect, useRef, CSSProperties } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  placeholder,
  style = {},
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Generate WebP version if supported
    const generateWebPSrc = (originalSrc: string) => {
      if (originalSrc.includes('/lovable-uploads/')) {
        // For lovable-uploads, we'll use the original for now
        // In production, you'd want to generate WebP versions
        return originalSrc;
      }
      return originalSrc;
    };

    setImageSrc(generateWebPSrc(src));
  }, [src]);

  useEffect(() => {
    if (priority) {
      // Preload critical images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageSrc;
      document.head.appendChild(link);
    }
  }, [imageSrc, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    // Fallback to original image if WebP fails
    if (imageSrc !== src) {
      setImageSrc(src);
    }
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        ...style
      }}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default OptimizedImage;
