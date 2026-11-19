import React, { useRef, useState } from 'react';
import { useFinePointer, useReducedMotionPref } from '@/lib/motion';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
};

/**
 * Luxury card with smooth moving gold glare and glowing animated border.
 * Keeps card geometry steady (no shaky rotation jitter on mousemove).
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPref();
  const [glare, setGlare] = useState<{ gx: number; gy: number; hover: boolean }>({
    gx: 50,
    gy: 50,
    hover: false,
  });

  const enabled = finePointer && !reducedMotion;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setGlare({ gx: px, gy: py, hover: true });
  };

  const onLeave = () => {
    if (!enabled) return;
    setGlare((prev) => ({ ...prev, hover: false }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-2xl border border-gold/25 bg-[#121212]/90 backdrop-blur-md transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-gold/65 ${className}`}
    >
      {enabled && (
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(460px circle at ${glare.gx.toFixed(1)}% ${glare.gy.toFixed(
              1,
            )}%, rgba(245, 200, 76, 0.14), transparent 68%)`,
            opacity: glare.hover ? 1 : 0,
          }}
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        />
      )}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};
