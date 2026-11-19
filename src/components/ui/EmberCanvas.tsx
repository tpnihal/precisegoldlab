import React, { useEffect, useRef } from 'react';
import { useLowDataOrReducedMotion } from '@/lib/motion';

/**
 * Lightweight fire-assay ember particles on a small internal canvas.
 * Capped by device hardwareConcurrency/viewport width, pauses when offscreen or tab hidden,
 * and completely disabled under prefers-reduced-motion or Save-Data.
 */
export const EmberCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { shouldUsePosterOnly } = useLowDataOrReducedMotion();

  useEffect(() => {
    if (shouldUsePosterOnly || !active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isTabVisible = !document.hidden;

    const width = 480;
    const height = 320;
    canvas.width = width;
    canvas.height = height;

    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = Math.min(isMobile ? 14 : 26, Math.max(10, cores * 3));

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      hue: number;
    };

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.22 + Math.random() * 0.45),
      r: 0.9 + Math.random() * 1.8,
      alpha: 0.2 + Math.random() * 0.55,
      hue: Math.random() > 0.35 ? 43 : 22,
    }));

    const onVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const render = () => {
      if (isTabVisible) {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -8) {
            p.y = height + 6;
            p.x = Math.random() * width;
          }
          if (p.x < -8) p.x = width + 6;
          if (p.x > width + 8) p.x = -6;

          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, 92%, 62%, ${p.alpha.toFixed(2)})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.cancelAnimationFrame(rafId);
    };
  }, [active, shouldUsePosterOnly]);

  if (shouldUsePosterOnly) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-65 mix-blend-screen"
    />
  );
};
