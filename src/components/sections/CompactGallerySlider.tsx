import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { site } from '@/config/site';

export const CompactGallerySlider: React.FC = () => {
  const slides = site.labGallerySlides;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  // Buttery-smooth, non-jumping infinite marquee scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let rafId: number;
    let accum = 0;

    const tick = () => {
      if (!paused && el) {
        accum += 1.05; // elegant fluid glide
        if (accum >= 1) {
          const step = Math.floor(accum);
          accum -= step;
          el.scrollLeft += step;
          const halfWidth = el.scrollWidth / 2;
          if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          }
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [paused]);

  const scrollByAmount = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const halfWidth = el.scrollWidth / 2;
    if (dir === -1 && el.scrollLeft < 380 && halfWidth > 0) {
      el.scrollLeft += halfWidth;
    } else if (dir === 1 && el.scrollLeft >= halfWidth) {
      el.scrollLeft -= halfWidth;
    }
    el.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden bg-white py-24 sm:py-32 text-[#111111]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Minimalist Editorial Header inspired by Reference Design */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            {/* Small subtle accent label */}
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#D4AF37]" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#9A7722]">
                Our Facility &amp; Presence
              </span>
            </div>

            {/* Bold, clean vision statement */}
            <h2
              id="gallery-heading"
              className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#111111] leading-[1.25]"
            >
              Inside Precise Gold Laboratory &amp; Facility
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed font-light">
              To remain Dubai Gold Souq’s trusted metallurgical testing facility, delivering certified fire assay accuracy, transparent gravimetric results, and immediate bullion liquidity.
            </p>
          </div>

          {/* Minimalist circular controls */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              aria-label="Scroll facility gallery left"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111] hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              aria-label="Scroll facility gallery right"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111] hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern, Clean Horizontal Gallery matching Reference Image */}
      <div
        ref={trackRef}
        className="mt-14 overflow-x-hidden px-4 sm:px-6 lg:px-8 select-none"
      >
        <div className="flex w-max items-center">
          {[...slides, ...slides].map((slide, idx) => (
            <figure
              key={`${slide.src}-${idx}`}
              className="group relative mr-6 sm:mr-8 h-[360px] w-[260px] sm:h-[400px] sm:w-[290px] shrink-0 overflow-hidden rounded-[26px] bg-neutral-100 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_-12px_rgba(212,175,55,0.25)]"
            >
              {/* Image Frame */}
              <img
                src={slide.src}
                alt={slide.title}
                width={290}
                height={400}
                loading="eager"
                draggable={false}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Minimalist Vignette Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300" />

              {/* Tag pill at top right */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] font-semibold tracking-wider text-[#F3D887] backdrop-blur-md border border-white/10">
                  {slide.tag}
                </span>
              </div>

              {/* Caption Content at Bottom */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                <figcaption className="font-display text-lg sm:text-xl font-bold leading-snug drop-shadow-sm">
                  {slide.title}
                </figcaption>
                {slide.desc && (
                  <p className="mt-1.5 text-xs text-neutral-300 leading-relaxed line-clamp-2 font-light">
                    {slide.desc}
                  </p>
                )}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
