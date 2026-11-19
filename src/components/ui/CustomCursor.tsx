import React, { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReducedMotionPref } from '@/lib/motion';

/**
 * Desktop-only luxury gold ring cursor that expands when hovering interactive elements.
 * Hidden on touch devices and when prefers-reduced-motion is enabled.
 */
export const CustomCursor: React.FC = () => {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotionPref();
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const active = finePointer && !reducedMotion;

  useEffect(() => {
    if (!active) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('a, button, [role="button"], input, select, textarea, summary, [data-cursor="interactive"]'),
      );
      setHovered(isInteractive);
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [active, visible]);

  if (!active) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div
        ref={ringRef}
        className="fixed left-0 top-0 -ml-5 -mt-5 h-10 w-10 will-change-transform"
      >
        <div
          className={`h-full w-full rounded-full border transition-transform duration-300 ease-luxe ${
            hovered
              ? 'scale-150 border-gold-light bg-gold/10 shadow-[0_0_24px_rgba(245,200,76,0.35)]'
              : 'scale-100 border-gold/60 bg-transparent'
          }`}
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-gold-light shadow-[0_0_10px_#F5C84C] will-change-transform"
      />
    </div>
  );
};
