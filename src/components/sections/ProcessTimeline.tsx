import React, { useEffect, useRef, useState } from 'react';
import { Award, Flame, FlaskConical, Scale, Sparkles, Zap } from 'lucide-react';
import { site } from '@/config/site';
import { useReducedMotionPref } from '@/lib/motion';
import { SmartPicture } from '@/components/ui/PrivacyBlur';
import { TiltCard } from '@/components/ui/TiltCard';

const STEP_ICONS = [Scale, Zap, Flame, FlaskConical, Award];

export const ProcessTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotionPref();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0.2);

  const steps = site.processSteps;

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const total = Math.max(1, rect.height - vh * 0.4);
      const scrolled = Math.min(Math.max(0, vh * 0.65 - rect.top), total);
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      setProgress(ratio);
      const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(ratio * steps.length)));
      setActiveStep(idx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [steps.length]);

  const currentStep = steps[activeStep] ?? steps[0];

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="relative border-t border-gold/25 bg-[#111111] py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,90,31,0.11),transparent_65%),radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.08),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.22em] text-gold-light">
            <Sparkles className="h-3.5 w-3.5 text-fire" />
            Section 03 · Cupellation Protocol
          </span>
          <h2
            id="process-heading"
            className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            5-Stage Fire Assay Gold Testing Process
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
            From dual-balance intake to nitric acid parting and certified stamping, every assay at
            Precise Gold Laboratory follows a strict gravimetric sequence.
          </p>
        </div>

        {/* Sticky Left Preview + Right Scroll-Drawn SVG Timeline */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Sticky Stage Visual (Desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 rounded-3xl border border-gold/40 bg-[#0a0a0a]/95 p-4 shadow-gold-glow backdrop-blur-xl">
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#050505]">
                <SmartPicture
                  key={currentStep.imageKey}
                  imageKey={currentStep.imageKey}
                  sizes="480px"
                  priority
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent p-6">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-amber">
                    <span>Stage {currentStep.step} / 05</span>
                    <span>{currentStep.metric}</span>
                  </div>
                  <p className="mt-2 font-display text-xl font-bold text-white">
                    {currentStep.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-300">{currentStep.subtitle}</p>
                </div>
              </div>

              {/* Quick Stage Selector Pills */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {steps.map((s, idx) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      setActiveStep(idx);
                      document
                        .getElementById(`process-step-${s.step}`)
                        ?.scrollIntoView({
                          behavior: reducedMotion ? 'auto' : 'smooth',
                          block: 'center',
                        });
                    }}
                    className={`rounded-lg py-2 font-mono text-xs font-semibold transition-all ${
                      idx === activeStep
                        ? 'bg-gradient-to-r from-gold-light to-amber text-neutral-950 shadow'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Scroll-Drawn SVG Path + Glowing Progress Node + Step Cards */}
          <div className="relative lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-6 left-5 top-6 w-6 sm:left-6"
            >
              <svg
                viewBox="0 0 24 1000"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="process-line-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5C84C" />
                    <stop offset="55%" stopColor="#FFB000" />
                    <stop offset="100%" stopColor="#FF5A1F" />
                  </linearGradient>
                </defs>
                <path
                  d="M 12 0 L 12 1000"
                  stroke="rgba(212, 175, 55, 0.22)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  fill="none"
                />
                <path
                  d="M 12 0 L 12 1000"
                  stroke="url(#process-line-grad)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="1000"
                  strokeDashoffset={reducedMotion ? 0 : Math.round(1000 * (1 - progress))}
                />
              </svg>

              {!reducedMotion && (
                <div
                  style={{ top: `${(progress * 100).toFixed(1)}%` }}
                  className="absolute left-1/2 -ml-2.5 -mt-2.5 h-5 w-5 rounded-full border-2 border-white bg-fire shadow-[0_0_22px_4px_rgba(255,90,31,0.85)] transition-all duration-150"
                />
              )}
            </div>

            <ol className="space-y-8 pl-14 sm:pl-16">
              {steps.map((s, idx) => {
                const Icon = STEP_ICONS[idx] ?? Sparkles;
                const isActive = idx === activeStep;

                return (
                  <li
                    key={s.step}
                    id={`process-step-${s.step}`}
                    onMouseEnter={() => setActiveStep(idx)}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className={`-left-14 sm:-left-16 absolute top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'border-gold-light bg-gradient-to-br from-gold-light to-fire text-neutral-950 shadow-[0_0_20px_rgba(245,200,76,0.5)]'
                          : 'border-gold/40 bg-[#0a0a0a] text-gold-light'
                      }`}
                    >
                      {s.step}
                    </span>

                    <TiltCard
                      className={`p-6 sm:p-8 ${
                        isActive ? 'border-gold/70 shadow-gold-glow' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-amber">
                          <Icon className="h-4 w-4 text-fire" />
                          <span>{s.subtitle}</span>
                        </span>
                        <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 font-mono text-[11px] font-semibold text-gold-light">
                          {s.metric}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                        {s.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-gray-300 sm:text-base">
                        {s.description}
                      </p>

                      {/* Inline Studio Visual on Mobile / Tablet */}
                      <div className="mt-4 overflow-hidden rounded-xl border border-gold/25 lg:hidden">
                        <SmartPicture
                          imageKey={s.imageKey}
                          sizes="92vw"
                          className="aspect-[16/10] w-full"
                        />
                      </div>
                    </TiltCard>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
