import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
}

function createFallbackDataUri(label: string): string {
  const safeText = label.replace(/[<>&"']/g, '').slice(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="55%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#g)"/>
    <circle cx="680" cy="110" r="140" fill="#ffffff" fill-opacity="0.06"/>
    <circle cx="120" cy="420" r="180" fill="#fb923c" fill-opacity="0.12"/>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#fed7aa" font-family="Inter, sans-serif" font-size="22" font-weight="600">SevaSetu Verified Visual</text>
    <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-size="30" font-weight="700">${safeText}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackLabel = 'SevaSetu Service',
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);

  React.useEffect(() => {
    setImgSrc(src);
    setUsedFallback(false);
  }, [src]);

  const handleError = () => {
    if (!usedFallback) {
      setUsedFallback(true);
      setImgSrc(createFallbackDataUri(fallbackLabel || alt));
      setLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
          aria-hidden="true"
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};