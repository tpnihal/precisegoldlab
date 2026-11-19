import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, ShieldAlert } from 'lucide-react';
import { site } from '@/config/site';

export function NotFoundPage() {
  return (
    <>
      <Head>
        <title>{`Page Not Found (404) | ${site.brandName}`}</title>
        <meta
          name="description"
          content="The page you requested could not be found. Return to Precise Gold Laboratory L.L.C. in the Dubai Gold Souq."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden bg-[#000000] px-4 py-32 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_65%)]"
        />

        <div className="relative z-10 mx-auto max-w-2xl rounded-3xl border border-gold/25 bg-[#0a0a0a]/90 p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-12">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/35 bg-gold/10 text-gold-light">
            <ShieldAlert className="h-7 w-7" aria-hidden="true" />
          </div>

          <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">
            Error 404 · Route Not Found
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Assay Reference Not Found
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
            The page or link you followed does not exist or has moved. Return to our Dubai Gold Souq laboratory home page, view our official Fire Assay service catalogue, or book an appointment directly.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-fire-gradient px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 shadow-fire-glow transition-all duration-300 ease-luxe hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Return to Home</span>
            </Link>

            <a
              href={site.catalogue.localPath}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-gold bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-light transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-gold-light hover:to-amber hover:text-neutral-950"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>Our Catalogue</span>
            </a>

            <a
              href="/#contact"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 ease-luxe hover:border-gold/40 hover:text-gold-light"
            >
              <Calendar className="h-4 w-4 text-gold-light" aria-hidden="true" />
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
