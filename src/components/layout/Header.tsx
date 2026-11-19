import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Eye, Menu, Phone, X, ShieldCheck, MapPin } from 'lucide-react';
import { site } from '@/config/site';
import { Logo } from '@/components/ui/Logo';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const ids = ['hero', 'about-process', 'melting-fireassay', 'gallery', 'scrap-gold', 'faq', 'contact'];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.3, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome, location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (!href.startsWith('/#')) return;
    const targetId = href.slice(2);
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${targetId}`);
      }
    } else {
      e.preventDefault();
      navigate(`/#${targetId}`);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md bg-[#0A0A0A]/95 border-b border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.65)]'
            : 'backdrop-blur-md bg-black/80 border-b border-white/10'
        }`}
      >
        {/* Compact, clean responsive height: h-16 on mobile, h-20 on desktop */}
        <div className="w-full flex h-16 sm:h-20 items-center justify-between px-3.5 sm:px-8 lg:px-12 xl:px-16">
          {/* Left: Mobile-friendly logo (compact on mobile, prominent on desktop) */}
          <Link to="/" className="group relative z-10 flex items-center py-1 focus:outline-none">
            <Logo size="md" tone="dark" />
          </Link>

          {/* Center: Desktop Navigation */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {site.nav.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3 py-2 text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                    isActive ? 'text-[#D4AF37]' : 'text-white/85 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`pointer-events-none absolute inset-x-3 bottom-1 h-[1.5px] bg-[#D4AF37] transition-transform duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={site.catalogue.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#D4AF37] bg-transparent px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37] transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-[#D4AF37]/15 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{site.catalogue.label}</span>
              </a>

              <a
                href="https://regalskygold.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3D887] to-[#D4AF37] px-5 py-2 font-display text-xs font-bold uppercase tracking-[0.15em] text-[#111111] shadow-[0_6px_24px_rgba(212,175,55,0.4)] transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(212,175,55,0.6)] hover:brightness-105"
              >
                <span>GOLD BULLION</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
              </a>
            </div>

            {/* Quick Mobile Bullion Link (Compact Pill) */}
            <a
              href="https://regalskygold.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C354] px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-[#111111] shadow-sm"
            >
              <span>BULLION</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-black/40 text-[#D4AF37] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 active:scale-95 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Modern Drawer - Pitch-black luxury styling matching logo */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            ref={menuPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#080808] text-white px-5 pb-6 pt-20 shadow-2xl border-b border-[#D4AF37]/20 lg:hidden overflow-y-auto"
          >
            {/* Navigation links - High contrast, gold + white logo aesthetic */}
            <nav aria-label="Mobile" className="flex flex-col divide-y divide-white/[0.08]">
              {site.nav.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center justify-between py-3.5 font-display text-lg font-bold text-white transition-colors hover:text-[#D4AF37] active:text-[#D4AF37]"
                >
                  <span className="tracking-wide">{item.label}</span>
                  <span className="text-sm font-mono text-[#D4AF37] font-bold">
                    →
                  </span>
                </a>
              ))}
            </nav>

            {/* Bottom Mobile Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-white/10 mt-4">
              <a
                href={site.catalogue.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#F3D887] hover:bg-[#D4AF37] hover:text-[#111111] transition-colors"
              >
                <Eye className="h-4 w-4 text-[#D4AF37]" />
                <span>Download Catalogue (PDF)</span>
              </a>

              <a
                href="https://regalskygold.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D887] to-[#D4AF37] px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-[#111111] shadow-[0_6px_20px_rgba(212,175,55,0.35)]"
              >
                <span>GOLD BULLION TRADING</span>
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </a>

              <div className="flex items-center justify-between pt-3 text-xs text-neutral-400">
                <a
                  href={site.contact.tel}
                  className="flex items-center gap-1.5 text-neutral-300 hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>{site.contact.phoneDisplay}</span>
                </a>
                <span className="flex items-center gap-1 text-neutral-300">
                  <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Dubai Gold Souq</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
