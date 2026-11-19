import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { site } from '@/config/site';

export const ScrapGoldCallout: React.FC = () => {
  const { heading, subtext, pills } = site.scrapCallout;

  return (
    <section
      id="scrap-gold"
      aria-labelledby="scrap-gold-heading"
      className="relative overflow-hidden bg-[#111111] py-28 lg:py-36 text-[#FFFFFF]"
    >
      {/* Subtle Gold Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.16),transparent_65%)]"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/5 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37] backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Scrap Gold Buying &amp; Bulk Dealers</span>
        </div>

        <h2
          id="scrap-gold-heading"
          className="mx-auto mt-6 max-w-3xl font-display text-3xl font-bold tracking-tight text-[#FFFFFF] sm:text-5xl lg:text-[52px] lg:leading-[1.12]"
        >
          {heading}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#D1D5DB]">
          {subtext}
        </p>

        {/* 3 Floating Glassmorphism Metric Pills */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {pills.map((pill, idx) => (
            <motion.div
              key={pill.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-white/[0.06] px-6 py-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_25px_rgba(212,175,55,0.12)] transition-transform duration-300 ease-luxe hover:-translate-y-1"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="mt-3 font-display text-base sm:text-lg font-bold text-[#FFFFFF]">
                {pill.label}
              </span>
              <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">
                {pill.detail}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Primary CTA Button */}
        <div className="mt-12">
          <a
            href="#contact"
            className="inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-3.5 font-display text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#111111] shadow-[0_12px_36px_rgba(212,175,55,0.35)] transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-[#E5C354]"
          >
            <span>Request Scrap Gold Valuation</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
