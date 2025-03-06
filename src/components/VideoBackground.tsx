
import React, { useEffect, useRef, useState } from 'react';

// Component that handles video display with multiple fallback options
const VideoBackground = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Try loading the video directly from Vimeo
  const vimeoEmbedUrl = "https://player.vimeo.com/video/123456789"; // Replace with actual Vimeo video ID

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        console.log("Video loaded successfully from direct source");
        setIsLoaded(true);
      });
      
      videoRef.current.addEventListener('error', (e) => {
        console.error("Video error from direct source:", e);
        setHasError(true);
      });
    }
  }, []);

  if (hasError) {
    // Return iframe with Vimeo embed as fallback
    return (
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <iframe 
          src={vimeoEmbedUrl}
          className="absolute w-full h-full object-cover" 
          frameBorder="0" 
          allow="autoplay; fullscreen" 
          allowFullScreen
          title="ARW Construction Video"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      
      {/* Fallback image - always displayed initially or if video fails */}
      <img 
        src="/lovable-uploads/7c65c431-125a-4ddf-a074-0aa214d57e37.jpg" 
        alt="ARW Construction Background"
        className="absolute w-full h-full object-cover"
        style={{display: isLoaded ? 'none' : 'block'}}
      />
      
      {/* Video with multiple sources */}
      <video 
        ref={videoRef}
        className="absolute w-full h-full object-cover" 
        autoPlay 
        muted 
        loop 
        playsInline
        style={{display: isLoaded ? 'block' : 'none'}}
      >
        {/* You can add CloudFront/CDN URL here */}
        <source src="https://d1e2bs8cc8wh1n.cloudfront.net/ARWCVideo.mp4" type="video/mp4" />
        <source src="https://player.vimeo.com/progressive_redirect/download/123456789/container/mp4" type="video/mp4" />
        <source src="/lovable-uploads/ARWC Video (1).mov" type="video/quicktime" />
        <source src="/lovable-uploads/ARWC_Video.mp4" type="video/mp4" />
      </video>
      
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white">Loading video...</p>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
