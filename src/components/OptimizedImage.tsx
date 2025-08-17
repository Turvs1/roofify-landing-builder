import React from 'react';

interface OptimizedImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  webpSrc,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  sizes,
  style,
  ...props
}) => {
  // Generate WebP source if not provided
  const generateWebPSrc = (originalSrc: string) => {
    if (webpSrc) return webpSrc;
    
    // If it's already a WebP, return as is
    if (originalSrc.endsWith('.webp')) return originalSrc;
    
    // Generate WebP path by replacing extension
    const basePath = originalSrc.replace(/\.[^/.]+$/, '');
    return `${basePath}.webp`;
  };

  const webpSource = generateWebPSrc(src);

  return (
    <picture>
      {/* WebP source for modern browsers */}
      <source
        srcSet={webpSource}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* Fallback for older browsers */}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        style={style}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
