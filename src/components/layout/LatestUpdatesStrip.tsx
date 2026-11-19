import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Sparkles } from 'lucide-react';
import { site } from '@/config/site';
import { getLatestPosts } from '@/lib/blog';
import { SmartPicture } from '@/components/ui/PrivacyBlur';
import { TiltCard } from '@/components/ui/TiltCard';

/**
 * Latest Updates Strip — positioned above the footer in the footer zone
 * (NOT an 8th landing section). Auto-pulls the 3 newest blog posts with semantic
 * <article> and <time>, plus the optional announcement line in site.ts.
 */
export const LatestUpdatesStrip: React.FC = () => {
  const posts = getLatestPosts(3);

  return (
    <aside
      aria-label="Latest laboratory articles and updates"
      className="relative border-t border-gold/25 bg-[#0a0a0a] py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.10),transparent_65%)]"
      />
      <div className="luxury-grain pointer-events-none absolute inset-0 opacity-35" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {site.announcement && (
          <div className="mb-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/35 bg-gradient-to-r from-gold/15 via-amber/10 to-fire/15 px-5 py-3.5 text-xs sm:text-sm text-gold-light">
            <span className="inline-flex items-center gap-2 font-medium text-white">
              <Sparkles className="h-4 w-4 shrink-0 text-amber" />
              <span>{site.announcement}</span>
            </span>
            <a
              href="/#contact"
              className="font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-light underline decoration-gold/60 underline-offset-4 hover:text-white"
            >
              Book Slot →
            </a>
          </div>
        )}

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-gold-light">
              <BookOpen className="h-3.5 w-3.5 text-amber" />
              Latest Laboratory Insights
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              Fire Assay & Dubai Gold Market Guides
            </h2>
          </div>

          <Link
            to="/blog/"
            className="group inline-flex items-center gap-2 rounded-full border border-gold/45 bg-white/5 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-light transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-neutral-950"
          >
            <span>View All Articles</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <TiltCard key={post.slug} className="h-full">
              <article className="flex h-full flex-col justify-between p-5">
                <div>
                  <Link
                    to={`/blog/${post.slug}/`}
                    className="block overflow-hidden rounded-xl border border-gold/25 bg-[#050505]"
                  >
                    <SmartPicture
                      imageKey={post.coverImage}
                      alt={post.coverAlt}
                      sizes="(min-width: 768px) 31vw, 94vw"
                      className="aspect-[16/10] w-full"
                      imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-300">
                    <span className="rounded-full border border-gold/35 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-light">
                      {post.category}
                    </span>
                    <time
                      dateTime={post.date}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-300"
                    >
                      <Calendar className="h-3 w-3 text-gold-light" />
                      {new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-AE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white group-hover:text-gold-light">
                    <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-300 sm:text-sm">
                    {post.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-white/10 pt-3.5">
                  <Link
                    to={`/blog/${post.slug}/`}
                    className="inline-flex min-h-[36px] items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-light transition-colors hover:text-amber"
                  >
                    <span>
                      Read Article<span className="sr-only">: {post.title}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </aside>
  );
};
