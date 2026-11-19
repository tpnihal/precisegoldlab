# Precise Gold Laboratory L.L.C. — Official Website & Static Blog

Ultra-fast, cinematic, SEO-prerendered website for **Precise Gold Laboratory L.L.C.** (`precisegoldlab.com`), an independent Fire Assay (cupellation) gold testing laboratory on the Ground Floor of the **Regal Sky Gold** building, Dubai Gold Souq, Deira, Dubai, UAE.

---

## 1. Tech Stack & Architecture

- **Framework:** React 18 + TypeScript + Vite 6 + Tailwind CSS 3.4
- **Static Prerendering (SSG):** `vite-react-ssg` prerenders every route (`/`, `/blog/`, `/blog/{slug}/`, `/404/`) into complete, indexable static HTML with full `<head>` metadata and JSON-LD before JavaScript loads.
- **Motion & Smooth Scroll:** Framer Motion + Lenis smooth scrolling (automatically disabled under `prefers-reduced-motion: reduce`), GPU-friendly transforms, custom desktop cursor ring, smooth button elevation (`cubic-bezier(0.22, 1, 0.36, 1)`), and $< 1.2\text{s}$ fire-gold intro curtain (skipped on repeat visits).
- **Fonts:** Self-hosted `Space Grotesk Variable` (headings) and `Inter Variable` (body) in `/public/fonts/` with `font-display: swap` and metric-matched `@font-face` fallbacks (`CLS = 0`).
- **Centralized Configuration:** Every phone number, email, map link, slide interval (`SLIDE_INTERVAL_MS`), FAQ, process step, service card, and image/video reference lives in [`src/config/site.ts`](file:///c:/Users/HP/Downloads/testinglab/src/config/site.ts).

---

## 2. Quick Start (Local Development in VS Code)

### Prerequisites
- **Node.js 20 LTS** (pinned in `.nvmrc` and `package.json` `"engines"`)

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Optimize & generate responsive AVIF / WebP / JPG images + permanent face blurs
npm run optimize-images

# 3. Start local development server (http://localhost:5173/)
npm run dev

# 4. Build static production bundle into dist/ (runs vite-react-ssg + postbuild-seo)
npm run build

# 5. Preview the prerendered production build locally (http://localhost:4173/)
npm run preview
```

---

## 3. Asset Mapping Table (Old Uploaded Filename → Clean Project Path)

All uploaded assets were inspected, renamed to clean lowercase-hyphen filenames, and wired exclusively through [`src/config/site.ts`](file:///c:/Users/HP/Downloads/testinglab/src/config/site.ts):

| Original Uploaded File | New Clean Project Path | Description & Placement | Contains People / Face Blur? |
| :--- | :--- | :--- | :--- |
| `media_1794400896575_7bff5f6f.png` | `public/assets/logo-mark.png`, `public/favicon.svg`, `public/apple-touch-icon.png` | Official gold "P" emblem in header, footer, favicons, manifest & JSON-LD | No |
| `precisegoldlab_(1).mp4` | `public/assets/video/hero-fire-assay.mp4` (`+ .webm`) | Primary hero background video (glowing molten gold bar in crucible) + extracted LCP poster `hero-fire-assay-poster` | No |
| `precisegoldlab_(2).mp4` | `public/assets/video/hero-cupellation-reel.mp4` (`+ .webm`) | Secondary hero slide reel (multi-step lab reel: furnace, bullion, acid parting, rolling mill) | Faces permanently blurred in extracted frames |
| `media_1794400797848_c7e23fab.jpg` | `src/assets/images/raw/reception-logo-wall-gold-bar.jpg` | Reception counter with circular Precise Gold wall sign, flyer stand, and kilo gold bar (`#gallery`) | **Yes — 1 staff member (`faceRegions` blurred)** |
| `media_1794400875491_cf6832b7.jpg` | `src/assets/images/raw/regal-sky-showroom-gold-bars.jpg` | Regal Sky Gold & Jewellery showroom with ten 1-kilo 995.0 gold bars (`#gallery`) | **Yes — 1 seated person on far left (`faceRegions` blurred)** |
| `media_1794400875539_f5321e8d.jpg` | `src/assets/images/raw/regal-sky-crest-logo.png` | Regal Sky Gold & Jewellery golden crown "RS" crest | No |
| `media_1794400875687_9933a638.jpg` | `src/assets/images/raw/reception-volumetric-flasks.jpg` | Reception counter with three 50 ml volumetric acid parting flasks and gloved technician hand (`#gallery`) | No (gloved hand only) |
| `media_1794400875708_a24ff4ec.jpg` | `src/assets/images/raw/precise-gold-flyer-cupellation.jpg` | Official "Gold Analysis by Fire Assay (Cupellation Method)" promotional poster (`#gallery`) | No |
| `media_1794400875719_2b3ce755.jpg` | `src/assets/images/raw/acid-parting-flasks-closeup.jpg` | Four volumetric parting flasks with golden nitric acid solution (`#gallery`) | No |
| `media_1794401199960_bfd37deb.jpg` | `src/assets/images/raw/induction-melting-furnace-room.jpg` | Induction melting & cupellation furnace room (`#gallery`) | No |
| `media_1794401199971_97c3e64b.jpg` | `src/assets/images/raw/stamped-assay-gold-bar-a8350.jpg` | Cast gold bar with circular sample cut and stamped `PRECISE A8350` hallmark (`#gallery`) | No |
| `media_1794401199971_c9f0fa04.jpg` | `src/assets/images/raw/scrap-gold-chains-and-bars.jpg` | Assorted scrap gold chains, rings, coins and cast bars (`#gallery`) | No |
| `media_1794401405517_aab61b16.jpg` | `src/assets/images/raw/aed-cash-payout-stack.jpg` | High-value UAE Dirham (AED 500 & 1,000) cash settlement bundles (`#gallery`) | No |
| `media_1794401407197_e53db4c5.jpg` | `src/assets/images/raw/usd-aed-settlement-desk.jpg` | Bullion settlement desk with USD $100 stacks, AED bundles, and ten 1-kilo bars (`#gallery`) | **Yes — 2 seated staff in background (`faceRegions` blurred)** |
| `Precise-Flyer.pdf` | `public/assets/precise-gold-lab-catalogue.pdf` | Official downloadable service catalogue PDF opened by "Our Catalogue" buttons | No |

---

## 4. Dual-Layer Face Privacy Architecture

To guarantee strict privacy for staff and visitors:
1. **Permanent Pixel-Level Blur (`npm run optimize-images`):** [`scripts/optimize-images.ts`](file:///c:/Users/HP/Downloads/testinglab/scripts/optimize-images.ts) reads the percentage-based `faceRegions` configured in [`src/config/site.ts`](file:///c:/Users/HP/Downloads/testinglab/src/config/site.ts), extracts each region with a safety margin, applies a heavy Gaussian blur (`sigma: 28`), and composites it permanently into every generated `.avif`, `.webp`, and `.jpg` file before saving to `src/assets/images/generated/`. Even if CSS is inspected or disabled in DevTools, the underlying image files never contain an unblurred face.
2. **Runtime `<PrivacyBlur>` Overlay:** [`src/components/ui/PrivacyBlur.tsx`](file:///c:/Users/HP/Downloads/testinglab/src/components/ui/PrivacyBlur.tsx) renders an additional percentage-positioned `backdrop-filter: blur(18px)` mask over every `faceRegions` coordinate.

---

## 5. Hostinger Shared Hosting Deployment (`public_html`)

1. Run `npm run build` locally.
2. Verify that `dist/` contains:
   - `dist/index.html` (prerendered home page)
   - `dist/blog/index.html` and `dist/blog/{slug}/index.html` (prerendered blog articles)
   - `dist/404.html` (custom luxury 404 page)
   - `dist/sitemap.xml`, `dist/rss.xml`, `dist/robots.txt`, and `dist/.htaccess`
3. Open **Hostinger hPanel → Files → File Manager** and navigate to `public_html/`.
4. Upload the **entire contents of `dist/`** directly into `public_html/` (ensure `.htaccess` is uploaded with dotfiles visible).

---

## 6. How to Customize Content, Videos & Blog Posts

- **Add a Blog Post:** Create a new `.md` file in `src/content/blog/` with YAML frontmatter (`title`, `description`, `date`, `updated`, `slug`, `category`, `tags`, `readTime`, `coverKey`, `coverAlt`, `ogImage`) and run `npm run build`. It will automatically appear on `/blog/`, the home page strip, `sitemap.xml`, and `rss.xml`.
- **Swap Hero Videos:** Replace the MP4/WebM files in `public/assets/video/` or update `site.hero.videos` in [`src/config/site.ts`](file:///c:/Users/HP/Downloads/testinglab/src/config/site.ts).
- **Confirm Placeholders:** Search [`src/config/site.ts`](file:///c:/Users/HP/Downloads/testinglab/src/config/site.ts) for `isPlaceholder: true` (`Expert Consultants` count and `openingHours` display) and update once confirmed.
