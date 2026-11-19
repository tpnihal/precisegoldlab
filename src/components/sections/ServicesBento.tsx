import React from 'react';
import {
  Award,
  Coins,
  Eye,
  FileCheck2,
  Flame,
  Gem,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { site } from '@/config/site';
import { Magnetic } from '@/components/ui/Magnetic';
import { SmartPicture } from '@/components/ui/PrivacyBlur';
import { TiltCard } from '@/components/ui/TiltCard';

const SERVICE_ICONS = [Flame, Sparkles, Gem, Layers, Coins, ShieldCheck, FileCheck2];

export const ServicesBento: React.FC = () => {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative border-t border-gold/25 bg-[#0a0a0a] py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(255,90,31,0.08),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading + Catalogue CTA */}
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.22em] text-gold-light">
              <Award className="h-3.5 w-3.5 text-amber" />
              Section 05 · Laboratory Capabilities
            </span>
            <h2
              id="services-heading"
              className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Comprehensive Gold Assay & Metallurgical Services
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300 sm:text-base">
              Engineered for Dubai Gold Souq wholesalers, retail jewellers, bullion traders and
              private sellers seeking indisputable purity verification.
            </p>
          </div>

          <Magnetic>
            <a
              href={site.catalogue.href}
              target="_blank"
              rel="noopener"
              className="group relative inline-flex min-h-[48px] items-center gap-2.5 overflow-hidden rounded-full border border-gold px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-light transition-all duration-300 ease-luxe hover:border-amber hover:text-neutral-950 hover:shadow-gold-glow"
            >
              <span
                className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-gold-light via-amber to-gold transition-transform duration-300 ease-luxe group-hover:translate-y-0"
                aria-hidden="true"
              />
              <Eye className="h-4 w-4" />
              <span>Download Full Service Catalogue (PDF)</span>
            </a>
          </Magnetic>
        </div>

        {/* Bento Grid (gap-8) */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {site.services.map((srv, idx) => {
            const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];

            if (srv.featured) {
              return (
                <TiltCard
                  key={srv.id}
                  className={`${srv.span} border-gold/45 bg-gradient-to-br from-[#141414] via-[#111111] to-[#080808] p-6 sm:p-8 shadow-gold-glow`}
                >
                  <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
                    <div className="md:col-span-7">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-fire/40 bg-fire/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-amber">
                        <Icon className="h-3.5 w-3.5 text-fire" />
                        {srv.badge}
                      </span>
                      <h3 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                        {srv.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-300 sm:text-base">
                        {srv.description}
                      </p>
                      <ul className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-gold-light">
                        <li>• Karat Verification (18K–24K)</li>
                        <li>• Same-Day Certified Reports</li>
                        <li>• Purity Consultation</li>
                        <li>• Secure CCTV Handling</li>
                      </ul>
                      <div className="mt-6">
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-gold-light transition-colors hover:text-amber"
                        >
                          <span>Schedule Fire Assay →</span>
                        </a>
                      </div>
                    </div>

                    <div className="md:col-span-5">
                      <div className="overflow-hidden rounded-2xl border border-gold/35 bg-[#050505]">
                        <SmartPicture
                          imageKey="studioBentoFurnace"
                          sizes="320px"
                          className="aspect-[5/4] w-full"
                        />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            }

            return (
              <TiltCard key={srv.id} className={`${srv.span} p-6 sm:p-8`}>
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/35 bg-gold/10 text-gold-light">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-200">
                        {srv.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold text-white">{srv.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-gray-300">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <a
                      href="#contact"
                      className="inline-flex items-center text-xs font-mono uppercase tracking-[0.18em] text-gold-light transition-colors hover:text-amber"
                    >
                      Book This Service →
                    </a>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
