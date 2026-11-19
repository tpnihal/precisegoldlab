import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { site } from '@/config/site';

export const FAQSection: React.FC = () => {
  const faqs = site.about.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-[#FFFFFF] py-24 sm:py-32 text-[#111111]"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7722] border border-[#D4AF37]/30">
            <HelpCircle className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2
            id="faq-heading"
            className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]"
          >
            Clear Answers on Gold Testing &amp; Assay
          </h2>
          <p className="mt-3 text-base text-[#555555] font-light">
            Everything you need to know about fire assay precision, testing turnaround, scrap gold valuation, and our Dubai Gold Souq facility.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 sm:mt-16 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-black/10 bg-[#FAF8F5] transition-all duration-300 hover:border-[#D4AF37]/60"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors"
                >
                  <span className="font-display text-base sm:text-lg font-bold text-[#111111]">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#D4AF37] text-black border-[#D4AF37]' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-black/5 px-6 pb-6 pt-2">
                        <p className="text-sm sm:text-base leading-relaxed text-[#444444] font-light">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Box */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#FAF8F5] via-[#FFFDF7] to-[#FAF8F5] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#9A7722]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-[#111111]">
                Have a specific lot or refinery question?
              </h4>
              <p className="text-xs text-[#666666]">
                Our metallurgists are on-site daily at the Regal Sky Gold building.
              </p>
            </div>
          </div>

          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#111111] px-5 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#D4AF37] hover:text-[#111111]"
          >
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
