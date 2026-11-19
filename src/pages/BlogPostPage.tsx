import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { ArrowLeft, ArrowRight, Calendar, Clock, Home, List } from 'lucide-react';
import { site } from '@/config/site';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { resolveImage } from '@/lib/media';
import { buildBlogPostingJsonLd } from '@/lib/schema';
import { SmartPicture } from '@/components/ui/PrivacyBlur';

export const BlogPostPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-36 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Article Not Found</h1>
        <p className="mt-3 text-sm text-gray-300">
          The requested article could not be found in our laboratory archive.
        </p>
        <Link
          to="/blog/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold px-6 py-2.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-light"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  const canonical = `${site.url}/blog/${post.slug}/`;
  const coverPic = resolveImage(post.coverImage);
  const jsonLd = buildBlogPostingJsonLd(post, coverPic.fallbackSrc);
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Head>
        <title>{`${post.title} | ${site.name}`}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content={
            coverPic.fallbackSrc
              ? `${site.url}${coverPic.fallbackSrc}`
              : `${site.url}${site.seo.ogImage}`
          }
        />
        <meta property="article:published_time" content={post.date} />
        {post.updated && <meta property="article:modified_time" content={post.updated} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <article className="relative bg-base pt-28 pb-24">
        <div className="luxury-grain pointer-events-none absolute inset-0 opacity-35" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-gray-300">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="inline-flex items-center gap-1 hover:text-gold-light">
                  <Home className="h-3.5 w-3.5 text-gold" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/blog/" className="hover:text-gold-light">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate font-semibold text-gold-light">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Post Header (ONE H1) */}
          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
              <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-light">
                {post.category}
              </span>
              <time dateTime={post.date} className="inline-flex items-center gap-1 font-mono">
                <Calendar className="h-3.5 w-3.5 text-gold" />
                {new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-AE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className="inline-flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-amber" />
                {post.readTimeMinutes} min read
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-neutral-300 sm:text-lg">
              {post.description}
            </p>
          </header>

          {/* Cover Image */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-gold/35 bg-ink-900 shadow-gold-glow">
            <SmartPicture
              imageKey={post.coverImage}
              alt={post.coverAlt}
              priority
              sizes="(min-width: 1024px) 840px, 94vw"
              className="aspect-[16/9] w-full"
            />
          </div>

          {/* Table of Contents */}
          {post.toc.length > 0 && (
            <nav
              aria-label="Table of contents"
              className="mt-8 rounded-2xl border border-gold/25 bg-ink-800/80 p-5"
            >
              <div className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-light">
                <List className="h-4 w-4 text-amber" />
                <span>In This Article</span>
              </div>
              <ol className="mt-3 space-y-1.5 text-sm">
                {post.toc.map((h) => (
                  <li key={h.id} className={h.level === 3 ? 'pl-4 text-xs' : ''}>
                    <a
                      href={`#${h.id}`}
                      className="text-neutral-300 transition-colors hover:text-gold-light"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Rendered Markdown Body */}
          <div
            className="mt-8 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Article CTA to #contact */}
          <div className="mt-12 rounded-3xl border border-gold/40 bg-gradient-to-br from-ink-800 via-ink-900 to-base p-6 sm:p-8 shadow-gold-glow">
            <h2 className="font-display text-2xl font-bold text-white">
              Need a Certified Fire Assay or Scrap Gold Valuation in Dubai?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              Visit {site.legalName} on the ground floor of the Regal Sky Gold building, Dubai Gold
              Souq, or book a priority furnace appointment online.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/#contact"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-amber via-fire to-fire-deep px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-white shadow-fire-glow"
              >
                <span>Book Assay Appointment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={site.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-gold px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.15em] text-gold-light hover:bg-gold hover:text-neutral-950"
              >
                <span>WhatsApp {site.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <section aria-label="Related articles" className="mt-14 border-t border-white/10 pt-10">
              <h2 className="font-display text-xl font-bold text-white">Related Articles</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/blog/${r.slug}/`}
                    className="group rounded-2xl border border-gold/25 bg-ink-800/70 p-5 transition-colors hover:border-gold"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gold-light">
                      {r.category}
                    </span>
                    <h3 className="mt-1.5 font-display text-base font-bold text-white group-hover:text-gold-light">
                      {r.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-300">{r.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
};
