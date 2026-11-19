import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const SITE_URL = 'https://precisegoldlab.com';

interface BlogMeta {
  title: string;
  description: string;
  date: string;
  updated?: string;
  slug: string;
  category: string;
}

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key) meta[key] = val;
  }
  return meta;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function loadBlogPosts(): BlogMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const posts: BlogMeta[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const fm = parseFrontmatter(raw);
    if (fm.draft === 'true') continue;
    const slug = fm.slug || file.replace(/\.md$/, '');
    posts.push({
      title: fm.title || slug,
      description: fm.description || '',
      date: fm.date || '2025-07-01',
      updated: fm.updated || fm.date || '2025-07-01',
      slug,
      category: fm.category || 'Fire Assay',
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('[postbuild-seo] dist/ folder not found.');
    process.exit(1);
  }

  const posts = loadBlogPosts();
  const today = new Date().toISOString().split('T')[0];

  // 1. Generate dist/sitemap.xml
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/blog/`, lastmod: posts[0]?.updated || today, changefreq: 'weekly', priority: '0.9' },
    ...posts.map((p) => ({
      loc: `${SITE_URL}/blog/${p.slug}/`,
      lastmod: p.updated || p.date,
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemapXml, 'utf-8');

  // 2. Generate dist/rss.xml
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Precise Gold Laboratory L.L.C. — Assay &amp; Bullion Insights</title>
    <link>${SITE_URL}/blog/</link>
    <description>Technical briefings on Fire Assay (cupellation), XRF vs. destructive gold testing, hallmarked bullion verification, and scrap gold valuation in the Dubai Gold Souq.</description>
    <language>en-ae</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
  .map(
    (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}/</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description>${escapeXml(p.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;

  fs.writeFileSync(path.join(DIST, 'rss.xml'), rssXml, 'utf-8');

  // 3. Hoist <meta charset="UTF-8"> to immediately after <head> in all dist HTML files
  // so it always appears within the first 1024 bytes (Lighthouse Best Practices requirement)
  function walkHtml(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkHtml(full);
      } else if (entry.name.endsWith('.html')) {
        let html = fs.readFileSync(full, 'utf-8');
        html = html.replace(/<meta\s+charset=["']UTF-8["']\s*\/?>/gi, '');
        html = html.replace(/<head>/i, '<head><meta charset="UTF-8">');
        fs.writeFileSync(full, html, 'utf-8');
      }
    }
  }
  walkHtml(DIST);

  // 4. Ensure dist/404.html exists at root of dist/ for Apache ErrorDocument 404 /404.html
  const nested404 = path.join(DIST, '404', 'index.html');
  const root404 = path.join(DIST, '404.html');
  if (fs.existsSync(nested404)) {
    fs.copyFileSync(nested404, root404);
  }

  // 4. Copy .htaccess into dist/ explicitly (dotfiles in public/ may be skipped on some platforms)
  const srcHtaccess = path.join(ROOT, 'public', '.htaccess');
  if (fs.existsSync(srcHtaccess)) {
    fs.copyFileSync(srcHtaccess, path.join(DIST, '.htaccess'));
  }

  console.log(
    `[postbuild-seo] Generated sitemap.xml (${urls.length} URLs), rss.xml (${posts.length} articles), 404.html, and .htaccess in dist/.`,
  );
}

main();
