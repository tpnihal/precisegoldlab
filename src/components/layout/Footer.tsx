import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye, Mail, MapPin, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { site } from '@/config/site';
import { Logo } from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#D4AF37]/25 bg-[#050505] text-neutral-300">
      <div className="luxury-grain pointer-events-none absolute inset-0 opacity-30" />

      {/* Main Footer Container */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* Brand & Introduction Column (Span 5) */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link to="/" className="inline-block group focus:outline-none">
              <Logo size="md" />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-300 font-light">
              Certified gold purity, weight accuracy and metallurgical verification laboratory on the
              Ground Floor of the Regal Sky Gold building, Dubai Gold Souq. Fast, reliable testing for traders, wholesalers
              and jewellery manufacturers.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href={site.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 py-2 text-xs font-display font-semibold uppercase tracking-[0.14em] text-[#F3D887] transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Visit Us in Gold Souq</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <a
                href="https://regalskygold.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-display font-medium uppercase tracking-[0.12em] text-neutral-300 hover:text-white hover:border-[#D4AF37] transition-all"
              >
                <span>Parent: Regal Sky Gold</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column (Span 3 on Desktop, 2 Columns in a Row on Mobile) */}
          <div className="lg:col-span-3 sm:pl-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-white text-center sm:text-left">
              Navigation &amp; Process
            </h3>
            
            {/* 2-Column Balanced Grid on Mobile, Single Column on sm/desktop */}
            <ul className="mt-5 grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5 text-sm text-center sm:text-left">
              {site.footerLinks.map((item) => (
                <li key={item.label}>
                  {item.href.startsWith('/blog') ? (
                    <Link
                      to={item.href}
                      className="inline-block py-1 text-neutral-400 transition-colors hover:text-[#F3D887] text-xs sm:text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="inline-block py-1 text-neutral-400 transition-colors hover:text-[#F3D887] text-xs sm:text-sm font-medium"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
              <li className="col-span-2 sm:col-span-1 pt-1">
                <a
                  href={site.catalogue.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-[#D4AF37] font-semibold text-xs sm:text-sm transition-colors hover:text-[#F3D887]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Download Catalogue (PDF)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Laboratory Contact Column (Span 4) */}
          <div className="lg:col-span-4 text-center sm:text-left">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-white">
              Laboratory Contact
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm flex flex-col items-center sm:items-start">
              <li className="flex items-center sm:items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                <a
                  href={site.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-snug text-neutral-300 transition-colors hover:text-[#F3D887] text-xs sm:text-sm max-w-xs sm:max-w-none"
                >
                  Ground Floor, Regal Sky Gold Building, Dubai Gold Souq, Deira, Dubai, UAE
                </a>
              </li>
              <li>
                <a
                  href={site.contact.tel}
                  className="inline-flex items-center gap-2.5 text-neutral-300 transition-colors hover:text-[#F3D887] text-xs sm:text-sm"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                  <span>{site.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={site.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-neutral-300 transition-colors hover:text-[#F3D887] text-xs sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" />
                  <span>WhatsApp Direct ({site.contact.phoneDisplay})</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex items-center gap-2.5 text-neutral-300 transition-colors hover:text-[#F3D887] text-xs sm:text-sm"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                  <span>{site.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Subtle Credit Strip */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-400 text-center sm:text-left">
          <p>
            © {year} {site.legalName} All rights reserved.
          </p>
          <p className="text-xs tracking-wider text-neutral-400">
            Designed &amp; Developed by{' '}
            <a
              href={site.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#F3D887] hover:text-white transition-colors underline decoration-[#D4AF37]/60 underline-offset-4"
            >
              A1 RANK
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
