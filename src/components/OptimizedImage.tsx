"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onError?: () => void;
  style?: React.CSSProperties;
}

/**
 * مكون صورة محسن يحل مشاكل Hydration ويوفر error handling
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  onError,
  style,
  ...props 
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    setError(true);
    setLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // في حالة الخطأ، عرض بديل
  if (error) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          width: fill ? '100%' : width || 'auto', 
          height: fill ? '100%' : height || 'auto',
          ...style 
        }}
      >
        <div className="text-center">
          <div className="w-6 h-6 bg-gray-300 rounded mx-auto mb-1"></div>
          <span className="text-gray-400 text-xs">صورة غير متوفرة</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div 
          className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center ${className}`}
          style={{ 
            width: fill ? '100%' : width || 'auto', 
            height: fill ? '100%' : height || 'auto' 
          }}
        >
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={fill ? sizes : undefined}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        style={{ 
          width: fill ? undefined : 'auto',
          height: fill ? undefined : 'auto',
          ...style
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
