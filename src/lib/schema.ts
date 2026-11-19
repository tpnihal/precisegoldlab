import { site } from '@/config/site';
import type { BlogPost } from '@/lib/blog';

export function buildHomeJsonLd() {
  const logoUrl = `${site.url}${site.brand.logoPng}`;
  const ogImageUrl = `${site.url}${site.seo.ogImage}`;

  const localBusiness: Record<string, unknown> = {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${site.url}/#laboratory`,
    name: site.legalName,
    alternateName: site.name,
    url: `${site.url}/`,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
      width: 512,
      height: 512,
    },
    image: [ogImageUrl, logoUrl],
    description: site.seo.description,
    telephone: site.contact.phoneE164,
    email: site.contact.email,
    priceRange: '$$',
    hasMap: site.contact.mapUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.contact.address.line1}, ${site.contact.address.line2}`,
      addressLocality: site.contact.address.city,
      addressRegion: 'Dubai',
      addressCountry: site.contact.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.contact.geo.lat,
      longitude: site.contact.geo.lng,
    },
    openingHours: site.openingHours.schema,
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
  };

  if (site.sameAs.length > 0) {
    localBusiness.sameAs = site.sameAs;
  }

  const services = [
    {
      name: 'Fire Assay Gold Testing (Cupellation Method)',
      description:
        'ISO-aligned gravimetric Fire Assay (cupellation) gold purity testing in Dubai Gold Souq reporting exact fineness in parts per thousand (‰).',
    },
    {
      name: 'Jewelry Gold Purity Testing (18K–24K)',
      description:
        'Accurate karat verification for rings, chains, bangles and manufactured gold jewelry.',
    },
    {
      name: 'Bulk Gold Testing for Traders & Wholesalers',
      description:
        'High-volume induction melting, sampling and Fire Assay certification for wholesale bullion traders and refiners.',
    },
    {
      name: 'Gold Coin & Bullion Bar Testing',
      description:
        'Weight, fineness and homogeneity verification for cast kilo bars, minted bars and gold coins.',
    },
    {
      name: 'Scrap Gold Buying & Melt Valuation',
      description:
        'Direct purchase of scrap gold in Dubai Gold Souq following induction homogenization and Fire Assay purity verification.',
    },
  ].map((s, idx) => ({
    '@type': 'Service',
    '@id': `${site.url}/#service-${idx + 1}`,
    name: s.name,
    description: s.description,
    provider: { '@id': `${site.url}/#laboratory` },
    areaServed: { '@type': 'City', name: 'Dubai' },
  }));

  const webSite = {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    publisher: { '@id': `${site.url}/#laboratory` },
    inLanguage: 'en',
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${site.url}/#faq`,
    mainEntity: site.about.faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [localBusiness, ...services, webSite, faqPage],
  };
}

export function buildBlogPostingJsonLd(post: BlogPost, coverUrl: string) {
  const postUrl = `${site.url}/blog/${post.slug}/`;
  const logoUrl = `${site.url}${site.brand.logoPng}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        mainEntityOfPage: postUrl,
        image: coverUrl ? `${site.url}${coverUrl}` : `${site.url}${site.seo.ogImage}`,
        author: {
          '@type': 'Organization',
          name: post.author,
          url: `${site.url}/`,
        },
        publisher: {
          '@type': 'Organization',
          name: site.legalName,
          logo: {
            '@type': 'ImageObject',
            url: logoUrl,
          },
        },
        keywords: post.tags.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${postUrl}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${site.url}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${site.url}/blog/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: postUrl,
          },
        ],
      },
    ],
  };
}
