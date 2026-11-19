/**
 * npm run optimize-images
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads /src/config/site.ts and turns the raw uploads in /media-source + bespoke
 * studio scenes into production assets. Raw files are NEVER shipped.
 *
 *  1. Photos & Studio Scenes → permanent face blur (pixelate + gaussian) using
 *     `faceRegions`, then AVIF + WebP at several widths and a JPG/PNG fallback
 *     → src/assets/images/generated/ (+ manifest.json)
 *  2. Videos → trim, strip audio, ≤1080p, WebM (VP9) + MP4 (H.264, faststart)
 *     → public/media/
 *  3. Brand → logo SVGs, logo-512.png, favicon set, site.webmanifest,
 *     1200×630 og-image.jpg → public/
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import {
  site,
  type FaceRegion,
  type HeroVideo,
  type ImageAsset,
  type StudioScene,
} from '../src/config/site';
import { LOGO_MARK_BBOX, LOGO_MARK_PATH } from '../src/config/brand';

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'media-source');
const OUT_IMG = path.join(ROOT, 'src/assets/images/generated');
const PUBLIC = path.join(ROOT, 'public');
const OUT_MEDIA = path.join(PUBLIC, 'media');
const OUT_BRAND = path.join(PUBLIC, 'brand');
const TMP = path.join(ROOT, 'node_modules/.cache/optimize-images');
const CACHE_FILE = path.join(TMP, 'cache.json');
const FORCE = process.argv.includes('--force');

const DEFAULT_WIDTHS = [480, 800, 1200];

type ManifestEntry = {
  width: number;
  height: number;
  widths: number[];
  fallback: 'jpg' | 'png';
  fallbackWidth: number;
  color: string;
};
type Manifest = Record<string, ManifestEntry>;

for (const dir of [OUT_IMG, OUT_MEDIA, OUT_BRAND, TMP]) fs.mkdirSync(dir, { recursive: true });

const manifestPath = path.join(OUT_IMG, 'manifest.json');
const manifest: Manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : {};
const cache: Record<string, string> =
  !FORCE && fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) : {};

const log = (...a: unknown[]) => console.log('  ', ...a);
const hash = (v: unknown) => createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 12);
const fileSig = (p: string) =>
  fs.existsSync(p) ? `${fs.statSync(p).size}:${fs.statSync(p).mtimeMs}` : 'missing';
const kb = (p: string) => `${(fs.statSync(p).size / 1024).toFixed(0)} KB`;

/* ───────────────────────────── 1. PHOTOS & STUDIO SCENES ───────────────────────────── */

async function burnFaceBlur(input: Buffer, regions: FaceRegion[]): Promise<Buffer> {
  if (!regions.length) return input;
  const meta = await sharp(input).metadata();
  const W = meta.width!,
    H = meta.height!;
  const composites: sharp.OverlayOptions[] = [];
  for (const r of regions) {
    const left = Math.max(0, Math.round((r.x / 100) * W));
    const top = Math.max(0, Math.round((r.y / 100) * H));
    const width = Math.min(W - left, Math.round((r.w / 100) * W));
    const height = Math.min(H - top, Math.round((r.h / 100) * H));
    if (width < 4 || height < 4) continue;
    const block = Math.max(4, Math.round(Math.min(width, height) / 10));
    const pix = await sharp(input)
      .extract({ left, top, width, height })
      .resize(Math.max(1, Math.round(width / block)), Math.max(1, Math.round(height / block)), {
        kernel: 'nearest',
      })
      .resize(width, height, { kernel: 'nearest' })
      .blur(Math.max(8, Math.min(width, height) / 6))
      .ensureAlpha()
      .png()
      .toBuffer();
    const feather = Math.max(2, Math.round(Math.min(width, height) * 0.08));
    const mask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><filter id="f"><feGaussianBlur stdDeviation="${feather}"/></filter></defs><rect x="${feather}" y="${feather}" width="${
        width - feather * 2
      }" height="${height - feather * 2}" rx="${Math.round(
        Math.min(width, height) * 0.3,
      )}" fill="#fff" filter="url(#f)"/></svg>`,
    );
    const soft = await sharp(pix).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
    composites.push({ input: soft, left, top });
  }
  return sharp(input).composite(composites).toBuffer();
}

async function knockoutWhite(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const a = Math.min(1, ((255 - Math.min(r, g, b)) / 255) * 2.4);
    data[i + 3] = Math.round(a * 255);
    if (a > 0.01) {
      data[i] = Math.max(0, Math.min(255, (r - 255 * (1 - a)) / a));
      data[i + 1] = Math.max(0, Math.min(255, (g - 255 * (1 - a)) / a));
      data[i + 2] = Math.max(0, Math.min(255, (b - 255 * (1 - a)) / a));
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/**
 * Generates high-resolution, dark-luxury metallurgical & gold bullion studio visuals
 * for sections outside the real-photo gallery (#gallery).
 */
function renderStudioSceneSvg(
  scene: StudioScene | undefined,
  caption = 'PRECISE GOLD LABORATORY',
  sub = 'Fire Assay · Dubai Gold Souq',
): Buffer {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const isWide = scene === 'hero-crucible' || scene === 'hero-bullion';
  const w = isWide ? 1600 : 1200;
  const h = isWide ? 1000 : 960;
  const cx = w / 2;
  const cy = h / 2 - 40;
  caption = esc(caption);
  sub = esc(sub);

  let artwork = '';

  switch (scene) {
    case 'hero-crucible':
    case 'step-cupellation':
    case 'bento-furnace':
      artwork = `
        <circle cx="${cx}" cy="${cy}" r="270" fill="url(#fireGlow)" opacity="0.85"/>
        <circle cx="${cx}" cy="${cy}" r="195" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="10 8" opacity="0.5"/>
        <!-- Muffle Arch & Crucible -->
        <path d="M ${cx - 170} ${cy + 140} L ${cx - 170} ${cy - 40} A 170 170 0 0 1 ${cx + 170} ${cy - 40} L ${cx + 170} ${cy + 140} Z" fill="#0d0704" stroke="url(#goldGrad)" stroke-width="3"/>
        <path d="M ${cx - 135} ${cy + 125} L ${cx - 135} ${cy - 30} A 135 135 0 0 1 ${cx + 135} ${cy - 30} L ${cx + 135} ${cy + 125} Z" fill="url(#furnaceCore)" opacity="0.9"/>
        <!-- Glowing Magnesia Cupels -->
        <g transform="translate(${cx - 105}, ${cy + 40})">
          <path d="M 0 0 L 56 0 L 46 46 L 10 46 Z" fill="url(#goldGrad)"/>
          <ellipse cx="28" cy="4" rx="14" ry="6" fill="#fff7d6"/>
        </g>
        <g transform="translate(${cx - 28}, ${cy + 40})">
          <path d="M 0 0 L 56 0 L 46 46 L 10 46 Z" fill="url(#goldGrad)"/>
          <ellipse cx="28" cy="4" rx="15" ry="6" fill="#fff7d6"/>
        </g>
        <g transform="translate(${cx + 49}, ${cy + 40})">
          <path d="M 0 0 L 56 0 L 46 46 L 10 46 Z" fill="url(#goldGrad)"/>
          <ellipse cx="28" cy="4" rx="14" ry="6" fill="#fff7d6"/>
        </g>
      `;
      break;

    case 'hero-bullion':
    case 'bullion-vault':
    case 'scrap-melt':
    case 'step-certificate':
      artwork = `
        <circle cx="${cx}" cy="${cy}" r="250" fill="url(#goldGlow)" opacity="0.85"/>
        <!-- Isometric Cast Gold Bullion Bars -->
        <g transform="translate(${cx - 200}, ${cy - 95})">
          <rect x="0" y="0" width="400" height="190" rx="22" fill="url(#goldGrad)" stroke="#fff3c4" stroke-width="2"/>
          <rect x="18" y="18" width="364" height="154" rx="14" fill="none" stroke="#3a2807" stroke-width="2" stroke-opacity="0.45"/>
          <circle cx="90" cy="95" r="42" fill="#b8862b" stroke="#3a2807" stroke-width="2" stroke-opacity="0.5"/>
          <g transform="translate(90 95) scale(0.055) translate(-500 -500)">
            <path fill="#1a1204" fill-rule="evenodd" d="${LOGO_MARK_PATH}"/>
          </g>
          <text x="165" y="78" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="28" fill="#1f1503" letter-spacing="4">PRECISE GOLD</text>
          <text x="165" y="112" font-family="Courier New, monospace" font-weight="700" font-size="22" fill="#2b1d04" letter-spacing="3">FINE GOLD 999.9‰</text>
          <text x="165" y="142" font-family="Courier New, monospace" font-weight="700" font-size="18" fill="#3a2807" letter-spacing="3">1000g · ASSAY CERTIFIED</text>
        </g>
      `;
      break;

    case 'regal-sky-atrium':
      artwork = `
        <circle cx="${cx}" cy="${cy}" r="260" fill="url(#goldGlow)" opacity="0.8"/>
        <!-- Architectural Fluted Columns & Illuminated Emblem -->
        <g stroke="url(#goldGrad)" stroke-opacity="0.28" stroke-width="2">
          ${Array.from({ length: 19 }, (_, i) => {
            const x = cx - 270 + i * 30;
            return `<line x1="${x}" y1="${cy - 180}" x2="${x}" y2="${cy + 180}"/>`;
          }).join('')}
        </g>
        <rect x="${cx - 290}" y="${cy - 185}" width="580" height="370" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-opacity="0.65"/>
        <circle cx="${cx}" cy="${cy}" r="130" fill="#070707" stroke="url(#goldGrad)" stroke-width="4"/>
        <circle cx="${cx}" cy="${cy}" r="118" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-opacity="0.5"/>
        <g transform="translate(${cx} ${cy - 18}) scale(0.14) translate(-500 -500)">
          <path fill="url(#goldGrad)" fill-rule="evenodd" d="${LOGO_MARK_PATH}"/>
        </g>
        <text x="${cx}" y="${cy + 78}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="20" fill="#F5C84C" letter-spacing="4">PRECISE GOLD</text>
        <text x="${cx}" y="${cy + 98}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="#D4AF37" letter-spacing="3">LABORATORY L.L.C.</text>
      `;
      break;

    case 'step-weighing':
    case 'scale-bullion':
      artwork = `
        <circle cx="${cx}" cy="${cy}" r="245" fill="url(#goldGlow)" opacity="0.8"/>
        <!-- Analytical Balance Chamber & Digital Readout -->
        <rect x="${cx - 190}" y="${cy - 150}" width="380" height="240" rx="18" fill="#090909" stroke="url(#goldGrad)" stroke-width="2.5"/>
        <line x1="${cx}" y1="${cy - 120}" x2="${cx}" y2="${cy + 25}" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.6"/>
        <ellipse cx="${cx}" cy="${cy + 30}" rx="95" ry="20" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
        <!-- Gold Cornet / Bar on Pan -->
        <rect x="${cx - 48}" y="${cy - 2}" width="96" height="28" rx="6" fill="url(#goldGrad)"/>
        <!-- Digital Indicator -->
        <rect x="${cx - 190}" y="${cy + 108}" width="380" height="68" rx="12" fill="#0f1410" stroke="url(#goldGrad)" stroke-width="2"/>
        <text x="${cx}" y="${cy + 153}" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="36" fill="#F5C84C" letter-spacing="4">0.3580 g · 999.9‰</text>
      `;
      break;

    case 'step-induction':
      artwork = `
        <circle cx="${cx}" cy="${cy}" r="260" fill="url(#fireGlow)" opacity="0.9"/>
        <!-- Induction Coils & Molten Vortex -->
        <rect x="${cx - 125}" y="${cy - 135}" width="250" height="270" rx="28" fill="#0d0805" stroke="url(#goldGrad)" stroke-width="3"/>
        ${[-85, -35, 15, 65].map(
          (dy) =>
            `<rect x="${cx - 150}" y="${cy + dy}" width="300" height="22" rx="11" fill="url(#furnaceCore)" stroke="#F5C84C" stroke-width="1.5"/>`,
        ).join('')}
        <circle cx="${cx}" cy="${cy}" r="68" fill="url(#furnaceCore)"/>
        <circle cx="${cx}" cy="${cy}" r="38" fill="#fff6cc"/>
      `;
      break;

    case 'step-parting':
      artwork = `
        <circle cx="${cx}" cy="${cy}" r="250" fill="url(#goldGlow)" opacity="0.85"/>
        <!-- Three Volumetric Parting Flasks -->
        ${[-140, 0, 140]
          .map(
            (dx, idx) => `
          <g transform="translate(${cx + dx}, ${cy})">
            <path d="M -18 -145 L 18 -145 L 18 -35 L 62 95 A 62 32 0 0 1 -62 95 L -18 -35 Z" fill="#0c0b08" stroke="url(#goldGrad)" stroke-width="2.5"/>
            <path d="M -44 45 L 44 45 L 58 92 A 58 26 0 0 1 -58 92 Z" fill="${
              idx === 1 ? 'url(#furnaceCore)' : 'url(#goldGrad)'
            }" opacity="0.88"/>
            <line x1="-14" y1="-90" x2="14" y2="-90" stroke="#F5C84C" stroke-width="1.5" stroke-opacity="0.6"/>
            <text x="0" y="135" text-anchor="middle" font-family="Courier New, monospace" font-size="14" fill="#F5C84C">50 ml · HNO₃</text>
          </g>`,
          )
          .join('')}
      `;
      break;

    default:
      artwork = `
        <circle cx="${cx}" cy="${cy}" r="250" fill="url(#goldGlow)" opacity="0.85"/>
        <!-- Hexagonal Gold Assay Crest -->
        <polygon points="${cx},${cy - 150} ${cx + 130},${cy - 75} ${cx + 130},${cy + 75} ${cx},${
        cy + 150
      } ${cx - 130},${cy + 75} ${cx - 130},${cy - 75}" fill="#0a0906" stroke="url(#goldGrad)" stroke-width="3"/>
        <polygon points="${cx},${cy - 122} ${cx + 106},${cy - 61} ${cx + 106},${cy + 61} ${cx},${
        cy + 122
      } ${cx - 106},${cy + 61} ${cx - 106},${cy - 61}" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="8 6"/>
        <g transform="translate(${cx} ${cy}) scale(0.17) translate(-500 -500)">
          <path fill="url(#goldGrad)" fill-rule="evenodd" d="${LOGO_MARK_PATH}"/>
        </g>
      `;
      break;
  }

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="bgRad" cx="50%" cy="42%" r="72%">
      <stop offset="0%" stop-color="#1f1506"/>
      <stop offset="55%" stop-color="#0b0906"/>
      <stop offset="100%" stop-color="#040404"/>
    </radialGradient>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.38"/>
      <stop offset="65%" stop-color="#FFB000" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF5A1F" stop-opacity="0.45"/>
      <stop offset="55%" stop-color="#FFB000" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFF0B8"/>
      <stop offset="35%" stop-color="#F5C84C"/>
      <stop offset="70%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#9A6F1A"/>
    </linearGradient>
    <linearGradient id="furnaceCore" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF3C4"/>
      <stop offset="45%" stop-color="#FFB000"/>
      <stop offset="100%" stop-color="#FF5A1F"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgRad)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="28" y="28" width="${w - 56}" height="${h - 56}" rx="28" fill="none" stroke="url(#goldGrad)" stroke-opacity="0.38" stroke-width="2"/>
  ${artwork}
  <text x="${cx}" y="${h - 115}" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="26" fill="#F5C84C" letter-spacing="5">${caption}</text>
  <text x="${cx}" y="${h - 76}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="18" fill="#d4d4d4" letter-spacing="2">${sub}</text>
</svg>`);
}

async function dominantHex(buf: Buffer) {
  const { dominant } = await sharp(buf).stats();
  return '#' + [dominant.r, dominant.g, dominant.b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

async function processImage(asset: ImageAsset, sourcePathOverride?: string) {
  const srcPath = sourcePathOverride ?? (asset.source ? path.join(SRC_DIR, asset.source) : null);
  const sig = hash({ asset, src: srcPath ? fileSig(srcPath) : 'studio-v5', v: 5 });
  const exists =
    manifest[asset.key] &&
    fs.existsSync(
      path.join(OUT_IMG, `${asset.key}-${manifest[asset.key].fallbackWidth}.${manifest[asset.key].fallback}`),
    );
  if (cache[`img:${asset.key}`] === sig && exists) return log(`= ${asset.key} (cached)`);

  let input: Buffer;
  if (!srcPath) {
    input = await sharp(
      renderStudioSceneSvg(asset.studioScene, asset.studioCaption, asset.studioSub),
    )
      .png()
      .toBuffer();
  } else if (!fs.existsSync(srcPath)) {
    console.warn(`  ! missing source ${srcPath} → generating studio scene`);
    input = await sharp(
      renderStudioSceneSvg(asset.studioScene, asset.studioCaption, asset.studioSub),
    )
      .png()
      .toBuffer();
  } else {
    input = await sharp(srcPath).rotate().toBuffer();
  }

  // Privacy first: blur BEFORE any resize so no output ever contains face pixels.
  input = await burnFaceBlur(input, asset.faceRegions);
  if (asset.knockoutWhite) input = await knockoutWhite(input);

  const meta = await sharp(input).metadata();
  const W = meta.width!,
    H = meta.height!;
  const widths = [...new Set((asset.widths ?? DEFAULT_WIDTHS).map((w) => Math.min(w, W)))].sort(
    (a, b) => a - b,
  );
  const fallback: 'jpg' | 'png' = asset.knockoutWhite ? 'png' : 'jpg';
  const fallbackWidth = widths.filter((w) => w <= 800).pop() ?? widths[0];

  for (const f of fs.readdirSync(OUT_IMG))
    if (f.startsWith(`${asset.key}-`) && /-\d+\.(avif|webp|jpg|png)$/.test(f))
      fs.unlinkSync(path.join(OUT_IMG, f));

  for (const w of widths) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 55, effort: 4 }).toFile(path.join(OUT_IMG, `${asset.key}-${w}.avif`));
    await base.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(OUT_IMG, `${asset.key}-${w}.webp`));
    if (w === fallbackWidth) {
      if (fallback === 'png')
        await base
          .clone()
          .png({ compressionLevel: 9, palette: true })
          .toFile(path.join(OUT_IMG, `${asset.key}-${w}.png`));
      else
        await base
          .clone()
          .flatten({ background: '#050505' })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(path.join(OUT_IMG, `${asset.key}-${w}.jpg`));
    }
  }
  manifest[asset.key] = {
    width: W,
    height: H,
    widths,
    fallback,
    fallbackWidth,
    color: await dominantHex(input),
  };
  cache[`img:${asset.key}`] = sig;
  log(
    `✓ ${asset.key} ${W}×${H} → [${widths.join(', ')}]${
      asset.faceRegions.length ? `  (faces blurred: ${asset.faceRegions.length})` : ''
    }`,
  );
}

/* ───────────────────────────── 2. VIDEOS ───────────────────────────── */

function findFfmpeg(): string | null {
  try {
    const p = require('ffmpeg-static') as string | null;
    if (p && fs.existsSync(p)) return p;
  } catch {
    /* optional dependency not installed */
  }
  const probe = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['ffmpeg'], {
    encoding: 'utf8',
  });
  const sys = probe.status === 0 ? probe.stdout.split(/\r?\n/)[0].trim() : '';
  return sys || null;
}

function run(bin: string, args: string[]) {
  const r = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}\n${r.stderr?.slice(-2000)}`);
}

function videoFilter(v: HeroVideo) {
  const scale = "scale=w='if(gt(iw,ih),min(iw,1920),min(iw,1080))':h=-2:flags=lanczos";
  const regions = v.faceRegions ?? [];
  if (!regions.length) return { args: ['-vf', `${scale},format=yuv420p`] };
  let graph = `[0:v]${scale}[v0]`;
  regions.forEach((r, i) => {
    const x = `iw*${r.x / 100}`,
      y = `ih*${r.y / 100}`,
      w = `iw*${r.w / 100}`,
      h = `ih*${r.h / 100}`;
    graph += `;[v${i}]split[m${i}][c${i}];[c${i}]crop=${w}:${h}:${x}:${y},boxblur=24:6[b${i}];[m${i}][b${i}]overlay=${x.replace(
      'iw',
      'W',
    )}:${y.replace('ih', 'H')}:enable='between(t,${r.start},${r.end})'[v${i + 1}]`;
  });
  graph += `;[v${regions.length}]format=yuv420p[out]`;
  return { args: ['-filter_complex', graph, '-map', '[out]'] };
}

async function processVideo(ff: string | null, v: HeroVideo) {
  const src = path.join(SRC_DIR, v.source);
  const webm = path.join(PUBLIC, v.webm);
  const mp4 = path.join(PUBLIC, v.mp4);
  if (!fs.existsSync(src)) {
    console.warn(`  ! missing video ${src}`);
    return;
  }
  if (!ff) {
    console.warn(`  ! ffmpeg not found → cannot transcode ${v.source}`);
    return;
  }
  const sig = hash({ v, src: fileSig(src), v2: 3 });
  const done = fs.existsSync(webm) && fs.existsSync(mp4);
  if (cache[`vid:${v.id}`] !== sig || !done) {
    const trimIn = v.trim?.start ? ['-ss', String(v.trim.start)] : [];
    const trimLen = v.trim?.end ? ['-t', String(v.trim.end - (v.trim.start ?? 0))] : [];
    const { args: filter } = videoFilter(v);
    run(ff, [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      ...trimIn,
      '-i',
      src,
      ...trimLen,
      ...filter,
      '-an',
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '0',
      '-crf',
      '34',
      '-row-mt',
      '1',
      '-deadline',
      'good',
      '-cpu-used',
      '2',
      webm,
    ]);
    run(ff, [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      ...trimIn,
      '-i',
      src,
      ...trimLen,
      ...filter,
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '25',
      '-profile:v',
      'high',
      '-movflags',
      '+faststart',
      mp4,
    ]);
    cache[`vid:${v.id}`] = sig;
    log(`✓ video ${v.id}: webm ${kb(webm)}, mp4 ${kb(mp4)}`);
  } else log(`= video ${v.id} (cached)`);
}

/* ───────────────────────────── 3. BRAND ───────────────────────────── */

const GOLD_DEFS = `<linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5C84C"/><stop offset=".55" stop-color="#D4AF37"/><stop offset="1" stop-color="#B8862B"/></linearGradient>`;
const markG = (scale: number, cx = 500, cy = 500) =>
  `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(-500.5 -500.5)"><path fill="url(#pg)" fill-rule="evenodd" d="${LOGO_MARK_PATH}"/></g>`;

const circleSvg = (opts: { ring?: boolean; scale?: number; bg?: string } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs>${GOLD_DEFS}</defs><circle cx="500" cy="500" r="500" fill="${
    opts.bg ?? '#0a0a0a'
  }"/>${
    opts.ring === false
      ? ''
      : '<circle cx="500" cy="500" r="478" fill="none" stroke="url(#pg)" stroke-opacity=".7" stroke-width="10"/>'
  }${markG(opts.scale ?? 0.6)}</svg>`;

const fullLogoSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs>${GOLD_DEFS}</defs><circle cx="500" cy="500" r="500" fill="#0a0a0a"/><circle cx="500" cy="500" r="478" fill="none" stroke="url(#pg)" stroke-opacity=".7" stroke-width="10"/>${markG(
    0.44,
    500,
    360,
  )}<text x="500" y="705" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900" font-size="104" fill="url(#pg)" letter-spacing="2">PRECISE GOLD</text><text x="500" y="800" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="58" fill="#F5C84C" letter-spacing="6">LABORATORY L.L.C.</text></svg>`;

function writeIco(pngs: { size: number; buf: Buffer }[], out: string) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  fs.writeFileSync(out, Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]));
}

async function processBrand() {
  const sig = hash({
    LOGO_MARK_PATH,
    v: 5,
    og: fileSig(path.join(OUT_IMG, `${site.images.receptionCounter.key}-800.jpg`)),
  });
  if (cache.brand === sig && fs.existsSync(path.join(PUBLIC, 'og-image.jpg')))
    return log('= brand assets (cached)');
  const b = LOGO_MARK_BBOX;
  const markOnly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.x} ${b.y} ${b.w} ${b.h}"><defs>${GOLD_DEFS}</defs><path fill="url(#pg)" fill-rule="evenodd" d="${LOGO_MARK_PATH}"/></svg>`;
  fs.writeFileSync(path.join(OUT_BRAND, 'logo-mark.svg'), markOnly);
  fs.writeFileSync(path.join(OUT_BRAND, 'logo-circle.svg'), circleSvg());
  fs.writeFileSync(path.join(OUT_BRAND, 'logo-full.svg'), fullLogoSvg());
  fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), circleSvg({ ring: false, scale: 0.66 }));

  const png = (svg: string, size: number) =>
    sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer();
  fs.writeFileSync(path.join(OUT_BRAND, 'logo-512.png'), await png(fullLogoSvg(), 512));
  const fav = circleSvg({ ring: false, scale: 0.7 });
  fs.writeFileSync(path.join(PUBLIC, 'favicon-16x16.png'), await png(fav, 16));
  fs.writeFileSync(path.join(PUBLIC, 'favicon-32x32.png'), await png(fav, 32));
  writeIco(
    await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await png(fav, size) }))),
    path.join(PUBLIC, 'favicon.ico'),
  );
  const square = (scale: number) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs>${GOLD_DEFS}</defs><rect width="1000" height="1000" fill="#050505"/><circle cx="500" cy="500" r="430" fill="#0a0a0a" stroke="url(#pg)" stroke-opacity=".6" stroke-width="8"/>${markG(
      scale,
    )}</svg>`;
  fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), await png(square(0.52), 180));
  fs.writeFileSync(path.join(PUBLIC, 'android-chrome-192x192.png'), await png(circleSvg(), 192));
  fs.writeFileSync(path.join(PUBLIC, 'android-chrome-512x512.png'), await png(circleSvg(), 512));
  fs.writeFileSync(path.join(PUBLIC, 'maskable-512x512.png'), await png(square(0.42), 512));

  fs.writeFileSync(
    path.join(PUBLIC, 'site.webmanifest'),
    JSON.stringify(
      {
        name: site.legalName,
        short_name: site.name,
        description: site.seo.description,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: site.themeColor,
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      null,
      2,
    ),
  );

  const photoKey = site.images.receptionCounter.key;
  const photoPath = path.join(OUT_IMG, `${photoKey}-800.jpg`);
  const photo = fs.existsSync(photoPath)
    ? await sharp(photoPath).resize(680, 630, { fit: 'cover', position: 'top' }).toBuffer()
    : await sharp(renderStudioSceneSvg('regal-sky-atrium')).resize(680, 630).png().toBuffer();
  const fade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="f" x1="0" x2="1"><stop offset=".38" stop-color="#050505"/><stop offset=".62" stop-color="#050505" stop-opacity=".25"/><stop offset="1" stop-color="#050505" stop-opacity=".05"/></linearGradient><radialGradient id="glow" cx="20%" cy="30%" r="60%"><stop offset="0" stop-color="#FF5A1F" stop-opacity=".22"/><stop offset="1" stop-color="#050505" stop-opacity="0"/></radialGradient>${GOLD_DEFS}</defs>
    <rect width="1200" height="630" fill="url(#f)"/><rect width="1200" height="630" fill="url(#glow)"/>
    <rect x="0" y="626" width="1200" height="4" fill="url(#pg)"/>
    <text x="72" y="360" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="62" fill="#ffffff">Gold Testing Dubai</text>
    <text x="72" y="430" font-family="Arial, sans-serif" font-weight="700" font-size="38" fill="url(#pg)">Fire Assay Lab · Gold Souq</text>
    <text x="72" y="540" font-family="Arial, sans-serif" font-size="26" fill="#ffffff" fill-opacity=".7">precisegoldlab.com  ·  ${site.contact.phoneDisplay}</text></svg>`,
  );
  const logo = await png(fullLogoSvg(), 200);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#050505' } })
    .composite([
      { input: photo, left: 520, top: 0 },
      { input: fade, left: 0, top: 0 },
      { input: logo, left: 64, top: 60 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og-image.jpg'));
  cache.brand = sig;
  log(
    `✓ brand: logos, favicon set, site.webmanifest, og-image.jpg (${kb(
      path.join(PUBLIC, 'og-image.jpg'),
    )})`,
  );
}

/* ───────────────────────────── RUN ───────────────────────────── */

const t0 = Date.now();
console.log('\n▸ Photos & Studio Visuals');
for (const asset of Object.values(site.images) as ImageAsset[]) await processImage(asset);

console.log('\n▸ Hero videos');
const ff = findFfmpeg();
if (!ff) console.warn('  ! ffmpeg unavailable — see README "Compress the hero videos manually".');
for (const v of site.hero.videos) await processVideo(ff, v);

console.log('\n▸ Brand');
await processBrand();

const liveKeys = new Set([
  ...Object.values(site.images).map((i) => i.key),
  ...site.hero.videos.map((v) => v.posterKey),
]);
for (const k of Object.keys(manifest)) if (!liveKeys.has(k)) delete manifest[k];

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
console.log(
  `\nDone in ${((Date.now() - t0) / 1000).toFixed(
    1,
  )}s → src/assets/images/generated, public/media, public/brand\n`,
);
