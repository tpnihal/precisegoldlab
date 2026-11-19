import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Flame,
  Scale,
  TrendingUp,
  X,
} from 'lucide-react';
import { site, type ImageKey } from '@/config/site';
import { useGoldTicker } from '@/lib/useGoldTicker';
import { Magnetic } from '@/components/ui/Magnetic';
import { SmartPicture } from '@/components/ui/PrivacyBlur';
import { TiltCard } from '@/components/ui/TiltCard';

export const ScrapGoldBuying: React.FC = () => {
  const ticker = useGoldTicker();
  const gallery = site.gallery;
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevPhoto = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
  }, [gallery.length]);
  const nextPhoto = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i + 1) % gallery.length));
  }, [gallery.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxIdx, closeLightbox, prevPhoto, nextPhoto]);

  const minVal = Math.min(...ticker.sparkline);
  const maxVal = Math.max(...ticker.sparkline);
  const range = Math.max(1, maxVal - minVal);
  const points = ticker.sparkline
    .map((v, i) => {
      const x = (i / (ticker.sparkline.length - 1)) * 280;
      const y = 64 - ((v - minVal) / range) * 52;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const scrapFrames: Array<{
    imageKey: ImageKey;
    tag: string;
    title: string;
    caption: string;
  }> = [
    {
      imageKey: 'studioScrapMelt',
      tag: 'Melted & Stamped',
      title: 'Homogenized Scrap Melt Bar',
      caption: 'Mixed scrap jewelry melted into a single cast bar and sampled for exact fineness.',
    },
    {
      imageKey: 'studioScaleBullion',
      tag: 'Certified Mass',
      title: 'Calibrated Bullion Weighing',
      caption: 'Weighed openly in front of you on our Mettler Toledo balance before settlement.',
    },
    {
      imageKey: 'studioScrapJewelry',
      tag: 'Scrap Intake',
      title: 'Broken Jewelry, Sweeps & Manufacturing Scrap',
      caption: '18K, 21K, 22K and 24K scrap lots accepted for melt-and-assay valuation.',
    },
    {
      imageKey: 'studioGoldSettlement',
      tag: 'Immediate Settlement',
      title: 'Transparent Bullion Desk Payout',
      caption: 'Paid directly against your verified fine gold weight with zero hidden deductions.',
    },
  ];

  const activeLightboxItem = lightboxIdx !== null ? gallery[lightboxIdx] : null;

  return (
    <section
      id="scrap-gold"
      aria-labelledby="scrap-gold-heading"
      className="relative border-t border-gold/25 bg-[#000000] py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,200,76,0.12),transparent_65%),radial-gradient(ellipse_at_bottom_right,rgba(255,90,31,0.09),transparent_60%)]"
      />
      <div className="luxury-grain pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Split: Headline + Copy + CTA on Left, XAU/USD DEMO Widget on Right */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-fire/40 bg-fire/10 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.22em] text-amber">
              <Flame className="h-3.5 w-3.5 text-fire" />
              Section 04 · Direct Scrap Gold Buyers Dubai
            </span>

            <h2
              id="scrap-gold-heading"
              className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
            >
              We Buy Scrap Gold at the{' '}
              <span className="text-gold-shimmer">Best Buy Price Level.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Never sell scrap gold on guesswork or acid-stone estimates. At Precise Gold
              Laboratory, we induction-melt your lot into a homogeneous bar, perform a certified
              Fire Assay to establish exact fine-gold content in parts per thousand (‰), and pay you
              at top Dubai Gold Souq bullion rates.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#contact"
                  className="group inline-flex min-h-[50px] items-center gap-2.5 rounded-full bg-gradient-to-r from-amber via-fire to-fire-deep px-7 py-3.5 font-display text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-white shadow-fire-glow transition-all duration-300 ease-luxe hover:brightness-110"
                >
                  <span>Get Your Scrap Gold Valued</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>

              <a
                href={site.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[50px] items-center gap-2 rounded-full border border-gold/45 bg-white/5 px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-gold-light transition-all duration-300 ease-luxe hover:border-gold hover:bg-gold/15"
              >
                <Scale className="h-4 w-4 text-amber" />
                <span>WhatsApp Lot Weight</span>
              </a>
            </div>
          </div>

          {/* XAU/USD Style Widget with Unmistakable DEMO DATA Badge */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-gold/40 bg-[#111111]/95 p-6 shadow-gold-glow backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-amber/55 bg-amber/15 px-3.5 py-2">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-amber">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-fire" />
                  DEMO DATA
                </span>
                <span className="font-mono text-[11px] text-amber">
                  Simulated Reference Feed
                </span>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-300">
                    {ticker.symbol} (Demo)
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">
                    ${ticker.ouncePriceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <span className="ml-1.5 text-xs font-normal text-gray-300">/ troy oz</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-300">
                  <TrendingUp className="h-3.5 w-3.5" />+{ticker.changePct}%
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#050505] p-3">
                <svg
                  viewBox="0 0 280 72"
                  className="h-16 w-full overflow-visible"
                  role="img"
                  aria-label="Illustrative demo sparkline for gold reference trend"
                >
                  <defs>
                    <linearGradient id="spark-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="60%" stopColor="#F5C84C" />
                      <stop offset="100%" stopColor="#FF5A1F" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#spark-grad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                </svg>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { k: '24K (999.9)', v: ticker.gram24kAed },
                  { k: '22K (916.6)', v: ticker.gram22kAed },
                  { k: '21K (875.0)', v: ticker.gram21kAed },
                  { k: '18K (750.0)', v: ticker.gram18kAed },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-center"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-wider text-gold-light">
                      {row.k}
                    </p>
                    <p className="mt-1 font-display text-sm font-bold text-white">
                      {row.v.toFixed(2)} <span className="text-[10px] text-gray-300">AED/g</span>
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-gray-300">
                {ticker.updatedNote}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Glowing Studio Scrap Gold & Payout Cards */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {scrapFrames.map((item) => (
            <TiltCard
              key={item.imageKey}
              className="flex flex-col justify-between border-gold/35 p-4 shadow-gold-glow"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#050505]">
                  <SmartPicture
                    imageKey={item.imageKey}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 94vw"
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-gold/45 bg-[#050505]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-light backdrop-blur-md">
                    {item.tag}
                  </span>
                </div>
                <div className="mt-4 px-1">
                  <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 pb-2 text-xs leading-relaxed text-gray-300">
                    {item.caption}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Embedded Gallery Block (#gallery) — Real Facility Photos Exclusively Here */}
        <div id="gallery" className="mt-24 scroll-mt-28 border-t border-gold/25 pt-20">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-gold-light">
                Laboratory & Bullion Gallery
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                Inside Precise Gold Laboratory & Regal Sky Gold
              </h3>
            </div>
            <p className="text-xs text-gray-300 sm:text-sm">
              Select any photograph to inspect in full-screen lightbox ({gallery.length} verified
              facility photos · all faces privacy-protected).
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {gallery.map((g, idx) => (
              <button
                key={g.imageKey}
                type="button"
                onClick={() => setLightboxIdx(idx)}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/30 bg-[#0a0a0a] text-left transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-gold-light hover:shadow-gold-glow"
              >
                <SmartPicture
                  imageKey={g.imageKey}
                  sizes="(min-width: 1024px) 19vw, (min-width: 640px) 31vw, 47vw"
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                <span className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-[#050505]/80 text-gold-light opacity-0 transition-opacity group-hover:opacity-100">
                  <Expand className="h-3.5 w-3.5" />
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-light">
                    {g.category}
                  </span>
                  <p className="mt-0.5 line-clamp-2 text-xs font-medium text-white">{g.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && lightboxIdx !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Laboratory photo lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/95 p-4 backdrop-blur-2xl sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-gold/40 bg-[#111111] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
                  {activeLightboxItem.category} · {lightboxIdx + 1} / {gallery.length}
                </span>
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close lightbox"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-gold hover:text-gold-light"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative flex max-h-[70vh] items-center justify-center overflow-hidden bg-[#050505]">
                <SmartPicture
                  imageKey={activeLightboxItem.imageKey}
                  sizes="90vw"
                  className="max-h-[70vh] w-full"
                  imgClassName="max-h-[70vh] w-full object-contain"
                />
                <button
                  type="button"
                  onClick={prevPhoto}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-[#050505]/85 text-gold-light transition-colors hover:bg-gold hover:text-neutral-950"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-[#050505]/85 text-gold-light transition-colors hover:bg-gold hover:text-neutral-950"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="border-t border-white/10 px-6 py-4 text-sm text-gray-200">
                {activeLightboxItem.caption}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
