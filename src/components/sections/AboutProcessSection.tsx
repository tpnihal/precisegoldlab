import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { site } from '@/config/site';

export const AboutProcessSection: React.FC = () => {
  const { intro, cards } = site.aboutProcess;

  return (
    <section
      id="about-process"
      aria-labelledby="about-process-heading"
      className="relative bg-[#FFFFFF] py-28 lg:py-36 text-[#111111]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Spacious Minimalist Intro Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FAF8F5] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#111111]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>About &amp; Testing Standards</span>
          </div>

          <h2
            id="about-process-heading"
            className="mt-6 font-display text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl"
          >
            Precision Metallurgy.{' '}
            <span className="text-[#D4AF37]">Uncompromised Trust.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-[#555555]">
            {intro}
          </p>
        </div>

        {/* 3-Column Card Grid with Generous gap-10 */}
        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3">
          {cards.map((card, idx) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#FAF8F5] shadow-[0_14px_40px_-18px_rgba(17,17,17,0.08)] transition-all duration-300 ease-luxe hover:-translate-y-1 hover:border-[#D4AF37]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6DF]">
                <img
                  src={card.image}
                  alt={card.title}
                  width={600}
                  height={375}
                  loading="eager"
                  onError={(e) => {
                    if (e.currentTarget.src !== window.location.origin + card.fallbackImage) {
                      e.currentTarget.src = card.fallbackImage;
                    }
                  }}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#111111] shadow-sm">
                  {card.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-7">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111]">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#555555]">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-[#111111] transition-colors group-hover:text-[#D4AF37]"
                  >
                    <span>Book Assay</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
