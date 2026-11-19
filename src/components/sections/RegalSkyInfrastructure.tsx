import React, { useState } from 'react';
import { Building2, CheckCircle2, ChevronDown, HelpCircle, MapPin, Shield } from 'lucide-react';
import { site } from '@/config/site';
import { SmartPicture } from '@/components/ui/PrivacyBlur';
import { TiltCard } from '@/components/ui/TiltCard';

export const RegalSkyInfrastructure: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number>(0);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden border-t border-gold/25 bg-[#0a0a0a] py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.12),transparent_65%),radial-gradient(ellipse_at_bottom_left,rgba(255,90,31,0.08),transparent_60%)]"
      />
      <div className="luxury-grain pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Split Layout: Gold-Framed Studio Infrastructure Visuals + Prestige Copy */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left: Gold-Framed Studio Visuals */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-gold/45 bg-[#111111] p-3 shadow-gold-glow">
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
                  <SmartPicture
                    imageKey="studioRegalSkyAtrium"
                    sizes="(min-width: 1024px) 46vw, 94vw"
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#000000] via-[#000000]/75 to-transparent p-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/45 bg-[#0a0a0a]/90 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-gold-light">
                      <Building2 className="h-3.5 w-3.5 text-amber" />
                      Ground Floor · Regal Sky Gold Building
                    </span>
                    <p className="mt-2 font-display text-base font-semibold text-white">
                      Dedicated Fire Assay Concourse · Dubai Gold Souq
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Card: Bullion Desk Synergy */}
              <div className="mt-6 grid grid-cols-1 items-center gap-4 rounded-2xl border border-gold/40 bg-[#111111]/95 p-4 shadow-xl sm:grid-cols-12">
                <div className="overflow-hidden rounded-xl border border-gold/30 sm:col-span-5">
                  <SmartPicture
                    imageKey="studioBullionVault"
                    sizes="260px"
                    className="aspect-[16/10] w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
                    Regal Sky Gold Synergy
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-white">
                    Immediate Post-Assay Bullion Settlement
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-300">
                    Move directly from certified Fire Assay purity verification to wholesale kilo-bar
                    and scrap gold liquidity on the same ground floor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Prestige Copy */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-gold-light">
              <Shield className="h-3.5 w-3.5 text-amber" />
              <span>{site.about.eyebrow}</span>
            </div>

            <h2
              id="about-heading"
              className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.6rem]"
            >
              {site.about.title}
            </h2>

            <p className="mt-4 text-base font-medium leading-relaxed text-gold-light sm:text-lg">
              {site.about.lead}
            </p>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-300 sm:text-base">
              {site.about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Infrastructure Highlights */}
            <div className="mt-8 grid grid-cols-1 gap-4">
              {site.about.highlights.map((h) => (
                <TiltCard key={h.label} className="p-5">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" />
                    <div>
                      <h3 className="font-display text-base font-bold text-white">
                        {h.label}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-300">
                        {h.detail}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={site.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-gold bg-gold/15 px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-light transition-all duration-300 ease-luxe hover:bg-gold hover:text-neutral-950"
              >
                <MapPin className="h-4 w-4" />
                <span>Visit Ground Floor Lab · Gold Souq</span>
              </a>
              <a
                href="#process"
                className="inline-flex min-h-[48px] items-center px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-gray-200 transition-colors hover:text-gold-light"
              >
                Explore 5-Stage Assay →
              </a>
            </div>
          </div>
        </div>

        {/* Visible 5-Item FAQ Accordion (Matches FAQPage JSON-LD 1:1) */}
        <div className="mt-24 border-t border-white/10 pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.24em] text-amber">
              <HelpCircle className="h-3.5 w-3.5 text-fire" />
              Frequently Asked Questions
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              Fire Assay & Gold Testing in Dubai — Key Answers
            </h3>
            <p className="mt-2 text-sm text-gray-300 sm:text-base">
              Clear answers on accuracy, turnaround times, scrap gold buying and appointments.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl divide-y divide-gold/20 rounded-2xl border border-gold/30 bg-[#111111]/90 backdrop-blur-md">
            {site.about.faq.map((item, idx) => {
              const isOpen = openFaq === idx;
              const panelId = `faq-panel-${idx}`;
              const btnId = `faq-btn-${idx}`;

              return (
                <div key={item.question} className="p-6">
                  <h4>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="flex w-full items-center justify-between gap-4 text-left font-display text-base font-bold text-white transition-colors hover:text-gold-light sm:text-lg"
                    >
                      <span>{item.question}</span>
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-white/5 text-gold-light transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-gold/20' : ''
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                  </h4>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!isOpen}
                    className={`mt-3 text-sm leading-relaxed text-gray-300 sm:text-base ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
