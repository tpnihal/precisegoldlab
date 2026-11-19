import React from 'react';
import type { FaceRegion, ImageKey } from '@/config/site';
import { resolveImage, type ResolvedPicture } from '@/lib/media';

type PrivacyBlurProps = {
  regions: FaceRegion[];
  className?: string;
};

/**
 * Reusable <PrivacyBlur> overlay using percentage-based faceRegions from site.ts.
 * Note: Every image in /src/assets/images/generated ALREADY has its face regions
 * permanently pixelated + gaussian-blurred by `npm run optimize-images` so removing
 * this DOM node in DevTools never reveals an unblurred face.
 */
export const PrivacyBlur: React.FC<PrivacyBlurProps> = ({ regions, className = '' }) => {
  if (!regions || regions.length === 0) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
      data-privacy-shield="active"
    >
      {regions.map((r, idx) => (
        <span
          key={idx}
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: `${r.w}%`,
            height: `${r.h}%`,
            backdropFilter: 'blur(18px) saturate(0.85)',
            WebkitBackdropFilter: 'blur(18px) saturate(0.85)',
          }}
          className="absolute rounded-full bg-base/25"
        />
      ))}
    </div>
  );
};

type SmartPictureProps = {
  imageKey?: ImageKey;
  picture?: ResolvedPicture;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * Renders an AVIF + WebP + fallback <picture> with explicit width/height,
 * dominant color background, and automatic <PrivacyBlur> overlay when faceRegions exist.
 */
export const SmartPicture: React.FC<SmartPictureProps> = ({
  imageKey,
  picture,
  alt,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  className = '',
  imgClassName = 'h-full w-full object-cover',
}) => {
  const resolved = picture ?? (imageKey ? resolveImage(imageKey) : null);
  if (!resolved) return null;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: resolved.color }}
    >
      <picture>
        {resolved.avifSrcSet && (
          <source type="image/avif" srcSet={resolved.avifSrcSet} sizes={sizes} />
        )}
        {resolved.webpSrcSet && (
          <source type="image/webp" srcSet={resolved.webpSrcSet} sizes={sizes} />
        )}
        <img
          src={resolved.fallbackSrc}
          alt={alt ?? resolved.alt}
          width={resolved.width}
          height={resolved.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          {...(priority
            ? ({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)
            : {})}
          className={imgClassName}
        />
      </picture>
      <PrivacyBlur regions={resolved.faceRegions} />
    </div>
  );
};
