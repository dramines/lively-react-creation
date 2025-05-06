
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  placeholder?: string;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  loading = 'lazy',
  sizes = '100vw',
  placeholder = 'blur'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(priority ? src : null);
  const [retryCount, setRetryCount] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle image source changes and preloading
  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setRetryCount(0);
    
    // If priority is true, load immediately
    if (priority) {
      setImgSrc(src);
      return;
    }
    
    // Check if image is cached
    const img = new Image();
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      // If image fails to load even after checking, still try to display it
      // The component's error handler will retry if needed
      setImgSrc(src);
    };
    img.src = src;
    
    // Use Intersection Observer for lazy loading
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImgSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Start loading when image is within 200px of viewport
        threshold: 0.01
      }
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
      observerRef.current = observer;
    }
    
    return () => {
      img.onload = null;
      img.onerror = null;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setRetryCount(0);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    
    // Retry loading with exponential backoff
    if (retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 500;
      setTimeout(() => {
        const timestamp = new Date().getTime();
        setImgSrc(`${src}?t=${timestamp}`);
        setRetryCount(prev => prev + 1);
      }, delay);
    }
  };

  const aspectRatioClass = width && height ? 'aspect-ratio' : '';
  const blurClass = !isLoaded && placeholder === 'blur' ? 'blur-sm' : '';

  const style: React.CSSProperties = {
    ...(width && typeof width === 'number' ? { width: `${width}px` } : width ? { width } : {}),
    ...(height && typeof height === 'number' ? { height: `${height}px` } : height ? { height } : {}),
    ...(width && height && typeof width === 'number' && typeof height === 'number' 
      ? { aspectRatio: `${width} / ${height}` } 
      : {})
  };

  return (
    <div 
      ref={imageRef}
      className={`${className} ${aspectRatioClass} overflow-hidden relative`} 
      style={style}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${blurClass}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes={sizes}
          style={style}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" style={style}></div>
      )}
    </div>
  );
};

export default OptimizedImage;
