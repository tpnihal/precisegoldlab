import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotionPref } from '@/lib/motion';

/**
 * Initializes Lenis smooth scrolling on the client when prefers-reduced-motion is false.
 * Also handles smooth anchor scrolling (including navigating from /blog/ to /#process).
 */
export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reducedMotion = useReducedMotionPref();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) return;

    let rafId = 0;
    let lenisInstance: import('lenis').default | null = null;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.12,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });
      lenisInstance = lenis;
      (window as Window & { __lenis?: typeof lenis }).__lenis = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };
      rafId = window.requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
      delete (window as Window & { __lenis?: unknown }).__lenis;
    };
  }, [reducedMotion]);

  // Smooth scroll to hash targets on route / hash change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }
    const id = location.hash.replace(/^#/, '');
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement, opts?: { offset?: number }) => void } }).__lenis;
      if (lenis && !reducedMotion) {
        lenis.scrollTo(el, { offset: -88 });
      } else {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }, 60);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, reducedMotion]);

  return <>{children}</>;
};
