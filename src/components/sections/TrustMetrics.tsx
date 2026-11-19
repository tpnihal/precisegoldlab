import React, { useEffect, useRef, useState } from 'react';
import { site } from '@/config/site';
import { useReducedMotionPref } from '@/lib/motion';

function CountUpNumber({
  target,
  suffix,
  active,
  reducedMotion,
}: {
  target: number;
  suffix: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [val, setVal] = useState(target);

  useEffect(() => {
    if (!active || reducedMotion) {
      setVal(target);
      return;
    }
    let raf = 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.max(1, Math.round(target * eased)));
      if (progress < 1) {
        raf = window.requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };

    setVal(0);
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [active, reducedMotion, target]);

  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

export const TrustMetrics: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotionPref();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="metrics"
      ref={ref}
      aria-label="Laboratory trust metrics"
      className="relative border-y border-gold/25 bg-[#111111] py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_70%)]"
      />
      <div className="luxury-grain pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {site.metrics.map((m) => (
            <div
              key={m.label}
              className="relative rounded-2xl border border-gold/35 bg-[#0a0a0a]/90 p-7 text-center shadow-glass backdrop-blur-md"
            >
              {m.isPlaceholder && (
                <span className="mb-2 inline-block rounded-full border border-amber/45 bg-amber/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber">
                  Placeholder · Confirm
                </span>
              )}
              <p className="font-display text-4xl font-bold tracking-tight text-gold-shimmer sm:text-5xl">
                <CountUpNumber
                  target={m.value}
                  suffix={m.suffix}
                  active={seen}
                  reducedMotion={reducedMotion}
                />
              </p>
              <p className="mt-2.5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
