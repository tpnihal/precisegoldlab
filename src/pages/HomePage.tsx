import React from 'react';
import { Head } from 'vite-react-ssg';
import { site } from '@/config/site';
import { buildHomeJsonLd } from '@/lib/schema';
import { Hero } from '@/components/sections/Hero';
import { AboutProcessSection } from '@/components/sections/AboutProcessSection';
import { FullWidthMeltingFireAssaySection } from '@/components/sections/FullWidthMeltingFireAssaySection';
import { CompactGallerySlider } from '@/components/sections/CompactGallerySlider';
import { ScrapGoldCallout } from '@/components/sections/ScrapGoldCallout';
import { FAQSection } from '@/components/sections/FAQSection';
import { FastContactSection } from '@/components/sections/FastContactSection';

export const HomePage: React.FC = () => {
  const canonical = `${site.url}/`;
  const ogImageUrl = `${site.url}${site.seo.ogImage}`;
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <Head>
        <title>{site.seo.title}</title>
        <meta name="description" content={site.seo.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:locale" content={site.locale} />
        <meta property="og:title" content={site.seo.title} />
        <meta property="og:description" content={site.seo.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={site.seo.ogImageAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={site.seo.title} />
        <meta name="twitter:description" content={site.seo.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        {site.seo.verification.google && (
          <meta name="google-site-verification" content={site.seo.verification.google} />
        )}
        {site.seo.verification.bing && (
          <meta name="msvalidate.01" content={site.seo.verification.bing} />
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      {/* Section 1: Hero — 3D Curved Perspective Services Slider (#0A0A0A Dark Theme) */}
      <Hero />

      {/* Section 2: About & Testing Process (#FFFFFF Pure White Theme) */}
      <AboutProcessSection />

      {/* Full-Width Cinematic View: Gold Melting & Fire Assay Cupellation (#050505 Dark Cinematic) */}
      <FullWidthMeltingFireAssaySection />

      {/* Section 3: Inside Precise Gold Lab — Modern Editorial Facility Showcase (#FFFFFF Clean White Theme) */}
      <CompactGallerySlider />

      {/* Section 4: Scrap Gold Buying & Bulk Dealers (#111111 Charcoal Dark Theme) */}
      <ScrapGoldCallout />

      {/* Frequently Asked Questions Section (#FFFFFF Clean Accordion Theme) */}
      <FAQSection />

      {/* Section 5: Direct Contact, PHP Email & Location (#FAF8F5 Off-White Theme) */}
      <FastContactSection />
    </>
  );
};
