import React from 'react';
import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { ArrowRight, BookOpen, Calendar, Clock, Home } from 'lucide-react';
import { site } from '@/config/site';
import { getAllPosts } from '@/lib/blog';
import { SmartPicture } from '@/components/ui/PrivacyBlur';
import { TiltCard } from '@/components/ui/TiltCard';

export const BlogIndexPage: React.FC = () => {
  const posts = getAllPosts();
  const canonical = `${site.url}/blog/`;
  const title = `Gold Testing & Fire Assay Blog | ${site.name} Dubai`;
  const description =
    'Technical guides on Fire Assay cupellation, gold purity testing methods in Dubai Gold Souq, and how to value and sell scrap gold safely.';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: canonical },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${site.url}${site.seo.ogImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${site.url}${site.seo.ogImage}`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Head>

      <div className="relative bg-base pt-28 pb-24">
        <div className="luxury-grain pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-gray-300">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="inline-flex items-center gap-1 hover:text-gold-light">
                  <Home className="h-3.5 w-3.5 text-gold" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-gold-light">
                Blog
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-mono uppercase tracking-[0.22em] text-gold-light">
              <BookOpen className="h-3.5 w-3.5 text-amber" />
              Metallurgical Knowledge Base
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Fire Assay & Gold Purity Insights — Dubai Gold Souq
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-300">
              Practical resources written by the analytical team at {site.legalName} covering
              cupellation science, purity verification methods, and transparent scrap gold selling.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <TiltCard key={post.slug} className="h-full" maxTilt={4}>
                <article className="flex h-full flex-col justify-between p-5">
                  <div>
                    <Link
                      to={`/blog/${post.slug}/`}
                      className="block overflow-hidden rounded-xl border border-gold/25 bg-ink-900"
                    >
                      <SmartPicture
                        imageKey={post.coverImage}
                        alt={post.coverAlt}
                        sizes="(min-width: 768px) 31vw, 94vw"
                        className="aspect-[16/10] w-full"
                        imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-light">
                        {post.category}
                      </span>
                      <span className="inline-flex items-center gap-3 font-mono text-[11px]">
                        <time dateTime={post.date} className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gold" />
                          {new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-AE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-amber" />
                          {post.readTimeMinutes} min read
                        </span>
                      </span>
                    </div>

                    <h2 className="mt-3 font-display text-xl font-bold leading-snug text-white group-hover:text-gold-light">
                      <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
                    </h2>

                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-300">
                      {post.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <Link
                      to={`/blog/${post.slug}/`}
                      className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-light hover:text-amber"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
