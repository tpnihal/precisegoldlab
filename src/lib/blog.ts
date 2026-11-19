import type { ImageKey } from '@/config/site';

export type BlogFrontmatter = {
  title: string;
  slug: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: ImageKey;
  coverAlt: string;
};

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPost = BlogFrontmatter & {
  body: string;
  html: string;
  toc: TocHeading[];
  readTimeMinutes: number;
};

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const yamlBlock = match[1];
  const body = match[2].trim();
  const data: Record<string, unknown> = {};

  for (const line of yamlBlock.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();

    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, '');
      data[key] = val;
    }
  }

  return { data, body };
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-gold-light">$1</code>',
    );
}

function renderMarkdown(markdown: string): { html: string; toc: TocHeading[] } {
  const lines = markdown.split(/\r?\n/);
  const toc: TocHeading[] = [];
  const out: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      out.push('</ol>');
      inOl = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeLists();
      continue;
    }

    if (line.startsWith('### ')) {
      closeLists();
      const text = line.slice(4).trim();
      const id = slugifyHeading(text);
      toc.push({ id, text, level: 3 });
      out.push(
        `<h3 id="${id}" class="mt-8 mb-3 scroll-mt-28 font-display text-xl font-bold text-gold-light sm:text-2xl">${formatInline(
          text,
        )}</h3>`,
      );
      continue;
    }

    if (line.startsWith('## ')) {
      closeLists();
      const text = line.slice(3).trim();
      const id = slugifyHeading(text);
      toc.push({ id, text, level: 2 });
      out.push(
        `<h2 id="${id}" class="mt-10 mb-4 scroll-mt-28 border-b border-gold/20 pb-2 font-display text-2xl font-bold text-white sm:text-3xl">${formatInline(
          text,
        )}</h2>`,
      );
      continue;
    }

    if (line.startsWith('- ')) {
      if (inOl) {
        out.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        out.push('<ul class="my-4 list-disc space-y-2 pl-6 text-neutral-300">');
        inUl = true;
      }
      out.push(`<li class="leading-relaxed">${formatInline(line.slice(2).trim())}</li>`);
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (inUl) {
        out.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        out.push('<ol class="my-4 list-decimal space-y-2 pl-6 text-neutral-300">');
        inOl = true;
      }
      out.push(`<li class="leading-relaxed">${formatInline(olMatch[1])}</li>`);
      continue;
    }

    closeLists();
    out.push(`<p class="my-4 leading-relaxed text-neutral-300">${formatInline(line)}</p>`);
  }

  closeLists();
  return { html: out.join('\n'), toc };
}

const rawFiles = import.meta.glob<string>('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const allPosts: BlogPost[] = Object.values(rawFiles)
  .map((raw) => {
    const { data, body } = parseFrontmatter(raw);
    const { html, toc } = renderMarkdown(body);
    const words = body.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(2, Math.round(words / 200));

    return {
      title: String(data.title ?? ''),
      slug: String(data.slug ?? ''),
      description: String(data.description ?? ''),
      date: String(data.date ?? '2026-10-01'),
      updated: data.updated ? String(data.updated) : undefined,
      author: String(data.author ?? 'Precise Gold Laboratory'),
      category: String(data.category ?? 'Insights'),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      coverImage: (data.coverImage as ImageKey) || 'fireAssayFlyer',
      coverAlt: String(data.coverAlt ?? data.title ?? ''),
      body,
      html,
      toc,
      readTimeMinutes,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): BlogPost[] {
  return allPosts;
}

export function getLatestPosts(limit = 3): BlogPost[] {
  return allPosts.slice(0, limit);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}
