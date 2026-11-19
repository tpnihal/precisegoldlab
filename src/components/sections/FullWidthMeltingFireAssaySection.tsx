import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Flame, ShieldCheck, Sparkles, Thermometer, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export const FullWidthMeltingFireAssaySection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.08]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 0.75, 0.75, 0.35]);

  const stages = [
    {
      id: '01',
      title: 'Induction Melting',
      stage: 'Stage 01 · Thermal Homogenization',
      temp: '1,150 °C',
      tagline: 'High-Frequency Crucible Thermal Fusion',
      desc: 'Raw jewelry scrap, doré bars and refining lots are fused inside high-purity clay-graphite crucibles. Thermal induction homogenizes the alloy so drill-core or vacuum pin-tube samples represent 100% of the lot.',
      stat: '0.00% Variance',
      statLabel: 'Sample Homogeneity',
      icon: Flame,
      bgImage: '/assets/v2/fire-assay-cupels-furnace.jpg',
    },
    {
      id: '02',
      title: 'Cupellation Stage',
      stage: 'Stage 02 · Lead Oxidation',
      temp: '1,050 °C',
      tagline: 'Thermal Separation in Magnesia Cupels',
      desc: 'Wrapped with high-purity lead foil and exact inquartation silver, samples enter the 1,050 °C muffle furnace. Base metals (copper, nickel, zinc) oxidize and are absorbed into the cupel, isolating pure precious metal doré beads.',
      stat: '1,050 °C',
      statLabel: 'Furnace Operating Temp',
      icon: Thermometer,
      bgImage: '/assets/v2/fire-assay-machine-flasks.jpg',
    },
    {
      id: '03',
      title: 'Acid Parting',
      stage: 'Stage 03 · Gravimetric Extraction',
      temp: 'Nitric Bath',
      tagline: 'Selective Nitric Acid Chemical Parting',
      desc: 'The doré bead is cold-rolled into a delicate thin cornet and submerged in boiling nitric acid baths across multi-stage volumetric flasks. Silver is completely parted into solution, leaving pure gold intact.',
      stat: '99.99%',
      statLabel: 'Silver Removal Efficiency',
      icon: Sparkles,
      bgImage: '/assets/v2/acid-parting-flasks-lab.jpg',
    },
    {
      id: '04',
      title: 'Certified Stamping',
      stage: 'Stage 04 · Gravimetric Certification',
      temp: '±0.1‰ Precision',
      tagline: 'Dual-Balance Precision Weighing & Stamping',
      desc: 'Annealed gold cornets are weighed on high-sensitivity draft-shield analytical balances down to 0.0001 g. Bars are stamped with the official PRECISE hallmark and issued a tamper-proof metallurgical certificate.',
      stat: '±0.01%',
      statLabel: 'Repeatability Tolerance',
      icon: ShieldCheck,
      bgImage: '/assets/v2/gold-purity-probe-nugget.jpg',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="melting-fireassay"
      aria-label="Melting and Fire Assay Full Width Experience"
      className="relative w-full overflow-hidden bg-[#050505] py-28 sm:py-36 text-white"
    >
      {/* Background Media with Cross-Fade Image on Click */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Dynamic Image Crossfade that changes on each click */}
        <AnimatePresence mode="sync">
          <motion.div
            key={stages[activeStage].bgImage}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full"
          >
            <img
              src={stages[activeStage].bgImage}
              alt={stages[activeStage].title}
              className="h-full w-full object-cover object-center filter brightness-[0.32] contrast-125 saturate-125"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Film Grain & Radial Gold Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[800px] rounded-full bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-transparent to-[#050505]/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Strip (Without Pause Cinema Reel button) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/40 bg-black/70 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            <span>Refinery Reference Method · ISO 11426</span>
          </div>

          <div className="font-mono text-xs text-neutral-400 tracking-wider hidden sm:block">
            Dubai Gold Souq · Regal Sky Gold Bldg
          </div>
        </div>

        {/* Section Headline */}
        <div className="mt-12 max-w-4xl">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Direct Metallurgical Verification
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Gold Melting &amp; <br />
            <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F3D887] to-[#D4AF37] bg-clip-text text-transparent">
              Fire Assay Cupellation
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl">
            The undisputed gold standard of purity analysis. In-house induction melting fuses and homogenizes client lots at 1,150 °C, followed by rigorous cupellation and nitric acid parting for certified parts-per-thousand accuracy.
          </p>
        </div>

        {/* Modern Interactive Master Bento Grid */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Stages Selector (Tabs) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
            {stages.map((st, idx) => {
              const Icon = st.icon;
              const isActive = activeStage === idx;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`group relative text-left w-full rounded-2xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl border ${
                    isActive
                      ? 'bg-gradient-to-r from-white/[0.14] via-white/[0.08] to-transparent border-[#D4AF37] shadow-[0_10px_30px_-10px_rgba(212,175,55,0.4)]'
                      : 'bg-black/60 border-white/10 hover:border-white/25 hover:bg-black/80'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-y-0 left-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-[#F3D887] to-[#D4AF37]"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#D4AF37]' : 'text-neutral-500'}`}>
                        {st.id}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                        {st.stage}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#F3D887] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {st.temp}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <h3 className={`font-display text-lg sm:text-xl font-bold transition-colors ${
                      isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                    }`}>
                      {st.title}
                    </h3>
                    <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${
                      isActive ? 'text-[#D4AF37] translate-x-1' : 'text-neutral-600 group-hover:text-neutral-400'
                    }`} />
                  </div>

                  <p className="mt-1 text-xs sm:text-sm text-neutral-400 font-light line-clamp-2">
                    {st.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Stage Spotlight Showcase (Big Modern Display) */}
          <div className="lg:col-span-7 relative min-h-[440px] sm:min-h-[500px] rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-black/60 backdrop-blur-2xl p-8 sm:p-10 flex flex-col justify-between shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
            {/* Visual Thumbnail of Current Stage inside card */}
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 opacity-25 pointer-events-none rounded-bl-full overflow-hidden">
              <img
                src={stages[activeStage].bgImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="relative z-10 flex flex-col h-full justify-between"
              >
                {/* Top Badge Info */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#F3D887]">
                      <Layers className="h-3 w-3" />
                      {stages[activeStage].stage}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D4AF37]">
                      Standard: ISO 11426:2021
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    {stages[activeStage].title}
                  </h3>
                  <div className="mt-2 text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                    {stages[activeStage].tagline}
                  </div>

                  <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
                    {stages[activeStage].desc}
                  </p>
                </div>

                {/* Bottom Highlight Metrics Box */}
                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 sm:gap-6 bg-black/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md border border-white/10">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                      Target Benchmark
                    </div>
                    <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#F3D887]">
                      {stages[activeStage].temp}
                    </div>
                    <div className="mt-1 text-xs text-neutral-400">
                      Calibrated Chamber Control
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-xs uppercase tracking-wider text-neutral-400">
                      {stages[activeStage].statLabel}
                    </div>
                    <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
                      {stages[activeStage].stat}
                    </div>
                    <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Certified In-House</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Subtle Visual Watermark */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 font-display text-[140px] font-extrabold text-white/[0.03] select-none">
              {stages[activeStage].id}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
