import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { site, SLIDE_INTERVAL_MS } from '@/config/site';

const SLOTS = [-3, -2, -1, 0, 1, 2, 3] as const;

export const Hero: React.FC = () => {
  const cards = site.hero3DCards;
  const total = cards.length; // 5
  const [virtualIndex, setVirtualIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(1440);
  const pointerStartX = useRef<number | null>(null);

  const activeIndex = ((virtualIndex % total) + total) % total;

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth, { passive: true });
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const nextSlide = useCallback(() => {
    setVirtualIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setVirtualIndex((prev) => prev - 1);
  }, []);

  // Smooth infinite autoplay every 2.2s
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, nextSlide]);

  const isMobile = viewportWidth < 640;
  const spacingFactor =
    viewportWidth < 640 ? 0.38 : viewportWidth < 1024 ? 0.68 : viewportWidth < 1280 ? 0.86 : 1;

  return (
    <section
      id="hero"
      aria-label="Precise Gold Laboratory Services"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[92vh] sm:min-h-screen overflow-hidden bg-[#0A0A0A] pt-20 pb-12 sm:pt-32 sm:pb-20 flex flex-col justify-between select-none"
    >
      {/* Subtle Ambient Gold Stage Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(212,175,55,0.14),transparent_62%)]"
      />

      {/* Top Center: Responsive Title & Short Subtitle */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 text-center mt-2 sm:mt-0">
        <h1 className="font-display text-2xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-[0.04em] sm:tracking-[0.06em] text-[#D4AF37] drop-shadow-[0_4px_28px_rgba(212,175,55,0.25)] leading-tight">
          PRECISE GOLD TESTING LABORATORY LLC
        </h1>
        <p className="mx-auto mt-2 sm:mt-3 max-w-2xl font-display text-xs sm:text-base lg:text-lg font-medium tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[#FFFFFF]">
          Certified Gold Purity, Weight Accuracy &amp; Metallurgical Verification
        </p>
        <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.1em] sm:tracking-[0.14em] text-[#D1D5DB]">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
          <span>Ground Floor, Dubai Gold Souq · ISO-Aligned Assay Facility</span>
        </div>
      </div>

      {/* Centerpiece: Zero-Jump Infinite 3D Curved Perspective Stage */}
      <div
        className="relative z-10 my-4 sm:my-10 flex w-full items-center justify-center touch-pan-y"
        onPointerDown={(e) => {
          pointerStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (pointerStartX.current === null) return;
          const delta = e.clientX - pointerStartX.current;
          pointerStartX.current = null;
          if (delta < -30) nextSlide();
          else if (delta > 30) prevSlide();
        }}
      >
        <div
          className="relative flex h-[370px] sm:h-[450px] w-full max-w-7xl items-center justify-center"
          style={{ perspective: isMobile ? '800px' : '1200px', transformStyle: 'preserve-3d' }}
        >
          {SLOTS.map((offset) => {
            const vIdx = virtualIndex + offset;
            const cardIdx = ((vIdx % total) + total) % total;
            const card = cards[cardIdx];
            const isCenter = offset === 0;
            const isHiddenEdge = Math.abs(offset) === 3;

            // 3D stage tilts
            const rotateY =
              offset <= -3
                ? 30
                : offset === -2
                ? 25
                : offset === -1
                ? 12
                : offset === 0
                ? 0
                : offset === 1
                ? -12
                : offset === 2
                ? -25
                : -30;

            // Mobile-adapted horizontal offsets
            const xOffset =
              offset === 0
                ? 0
                : offset === -1
                ? -210 * spacingFactor
                : offset === 1
                ? 210 * spacingFactor
                : offset === -2
                ? -380 * spacingFactor
                : offset === 2
                ? 380 * spacingFactor
                : offset === -3
                ? -540 * spacingFactor
                : 540 * spacingFactor;

            const scale =
              offset === 0
                ? (isMobile ? 1.02 : 1.08)
                : Math.abs(offset) === 1
                ? (isMobile ? 0.9 : 0.94)
                : Math.abs(offset) === 2
                ? (isMobile ? 0.8 : 0.86)
                : 0.76;

            const opacity = isHiddenEdge ? 0 : Math.abs(offset) === 2 ? (isMobile ? 0.25 : 0.6) : Math.abs(offset) === 1 ? (isMobile ? 0.7 : 0.9) : 1;
            const zIndex = 30 - Math.abs(offset) * 5;

            return (
              <motion.article
                key={vIdx}
                animate={{
                  x: xOffset,
                  scale,
                  rotateY,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 28,
                  mass: 0.85,
                }}
                onClick={() => {
                  if (offset < 0) prevSlide();
                  else if (offset > 0) nextSlide();
                }}
                className={`absolute w-[220px] h-[340px] sm:w-[260px] sm:h-[400px] rounded-2xl overflow-hidden cursor-pointer select-none transition-shadow duration-300 ${
                  isCenter
                    ? 'ring-2 ring-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.35)]'
                    : 'ring-1 ring-white/10 opacity-70 hover:opacity-90'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  pointerEvents: isHiddenEdge ? 'none' : 'auto',
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-neutral-900">
                  <img
                    src={card.image}
                    alt={card.title}
                    width={260}
                    height={400}
                    loading={isCenter ? 'eager' : 'lazy'}
                    draggable={false}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                </div>

                {/* Top Badge: Card Number */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                  <span className="font-mono text-xs font-bold text-[#D4AF37] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/30">
                    {card.num}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end text-left">
                  <h3 className="font-display text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">
                    {card.title}
                  </h3>

                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="mt-3"
                    >
                      <a
                        href={card.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-950 shadow-md hover:bg-[#D4AF37] transition-colors"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>{card.ctaLabel}</span>
                      </a>
                    </motion.div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 mx-auto flex items-center justify-center gap-4 px-4">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous service"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dynamic Pagination Pill */}
        <span className="font-mono text-xs text-neutral-400">
          <strong className="text-[#D4AF37]">0{activeIndex + 1}</strong> / 0{total}
        </span>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next service"
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};
