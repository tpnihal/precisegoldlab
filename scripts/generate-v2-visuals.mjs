import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('public/assets/v2');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Helper to create ultra-crisp 3D-render-style vertical coverflow cards (900x1400)
// and HD horizontal process/news thumbnails (1200x800) by blending real lab frames + 3D volumetric SVG shaders
async function buildCoverflowCard({ filename, baseImage, svgOverlay }) {
  const width = 900;
  const height = 1400;

  let pipeline;
  if (baseImage && fs.existsSync(baseImage)) {
    pipeline = sharp(baseImage)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 0.85, saturation: 1.15 });
  } else {
    pipeline = sharp({
      create: { width, height, channels: 4, background: { r: 14, g: 12, b: 10, alpha: 1 } },
    });
  }

  const overlayBuf = Buffer.from(svgOverlay(width, height));
  const outWebp = path.join(OUT_DIR, `${filename}.webp`);
  const outJpg = path.join(OUT_DIR, `${filename}.jpg`);

  await pipeline
    .clone()
    .composite([{ input: overlayBuf, top: 0, left: 0 }])
    .webp({ quality: 88 })
    .toFile(outWebp);

  await pipeline
    .clone()
    .composite([{ input: overlayBuf, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outJpg);
}

async function buildProcessThumb({ filename, baseImage, svgOverlay }) {
  const width = 1200;
  const height = 800;

  let pipeline;
  if (baseImage && fs.existsSync(baseImage)) {
    pipeline = sharp(baseImage)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 0.96, saturation: 1.08 });
  } else {
    pipeline = sharp({
      create: { width, height, channels: 4, background: { r: 245, g: 242, b: 235, alpha: 1 } },
    });
  }

  const overlayBuf = Buffer.from(svgOverlay(width, height));
  const outWebp = path.join(OUT_DIR, `${filename}.webp`);
  const outJpg = path.join(OUT_DIR, `${filename}.jpg`);

  await pipeline
    .clone()
    .composite([{ input: overlayBuf, top: 0, left: 0 }])
    .webp({ quality: 88 })
    .toFile(outWebp);

  await pipeline
    .clone()
    .composite([{ input: overlayBuf, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outJpg);
}

const rawDir = 'src/assets/images/raw';
const genDir = 'src/assets/images/generated';

// 1. Six 3D Coverflow Hero Slides (900x1400)
await buildCoverflowCard({
  filename: 'hero-3d-fire-assay',
  baseImage: path.join(genDir, 'hero-poster-fire-assay-reel-576.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <radialGradient id="g1" cx="50%" cy="38%" r="55%">
        <stop offset="0%" stop-color="#FFB800" stop-opacity="0.45"/>
        <stop offset="45%" stop-color="#FF5A1F" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#050505" stop-opacity="0.88"/>
      </radialGradient>
      <linearGradient id="gold3d" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF4D0"/>
        <stop offset="35%" stop-color="#F5C84C"/>
        <stop offset="70%" stop-color="#D4AF37"/>
        <stop offset="100%" stop-color="#8A6414"/>
      </linearGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#050505" stop-opacity="0.45"/>
        <stop offset="40%" stop-color="#050505" stop-opacity="0.1"/>
        <stop offset="75%" stop-color="#050505" stop-opacity="0.65"/>
        <stop offset="100%" stop-color="#050505" stop-opacity="0.95"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g1)"/>
    <rect width="${w}" height="${h}" fill="url(#fade)"/>
    <!-- 3D Volumetric Crucible & Glowing Gold Orb -->
    <g transform="translate(450, 510)">
      <circle cx="0" cy="0" r="230" fill="none" stroke="url(#gold3d)" stroke-width="1.5" stroke-opacity="0.35"/>
      <circle cx="0" cy="0" r="175" fill="none" stroke="url(#gold3d)" stroke-width="1" stroke-dasharray="6 10" stroke-opacity="0.45"/>
      <ellipse cx="0" cy="95" rx="135" ry="38" fill="#000" fill-opacity="0.55"/>
      <path d="M-110,-60 L110,-60 L82,90 C75,120 -75,120 -82,90 Z" fill="url(#gold3d)" fill-opacity="0.22" stroke="url(#gold3d)" stroke-width="2.5"/>
      <ellipse cx="0" cy="-60" rx="110" ry="28" fill="url(#gold3d)" fill-opacity="0.85"/>
    </g>
  </svg>`,
});

await buildCoverflowCard({
  filename: 'hero-3d-xrf-testing',
  baseImage: path.join(rawDir, 'precision-balance-gold-cornets.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <radialGradient id="g2" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#F5C84C" stop-opacity="0.35"/>
        <stop offset="55%" stop-color="#1A1610" stop-opacity="0.65"/>
        <stop offset="100%" stop-color="#060608" stop-opacity="0.92"/>
      </radialGradient>
      <linearGradient id="goldBeam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF6D6"/>
        <stop offset="50%" stop-color="#E5C158"/>
        <stop offset="100%" stop-color="#9B741B"/>
      </linearGradient>
      <linearGradient id="fade2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#060608" stop-opacity="0.5"/>
        <stop offset="45%" stop-color="#060608" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#060608" stop-opacity="0.95"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g2)"/>
    <rect width="${w}" height="${h}" fill="url(#fade2)"/>
    <!-- 3D Precision Laser Grid & Isometric Gold Prism -->
    <g transform="translate(450, 500)">
      <polygon points="0,-170 150,-85 150,85 0,170 -150,85 -150,-85" fill="url(#goldBeam)" fill-opacity="0.14" stroke="url(#goldBeam)" stroke-width="2"/>
      <polygon points="0,-115 100,-55 100,55 0,115 -100,55 -100,-55" fill="url(#goldBeam)" fill-opacity="0.28" stroke="#FFF6D6" stroke-width="1.5"/>
      <line x1="0" y1="-220" x2="0" y2="220" stroke="#FFF6D6" stroke-width="1" stroke-opacity="0.4"/>
      <line x1="-220" y1="0" x2="220" y2="0" stroke="#FFF6D6" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="14" fill="#FFF6D6"/>
    </g>
  </svg>`,
});

await buildCoverflowCard({
  filename: 'hero-3d-scrap-gold',
  baseImage: path.join(rawDir, 'precise-cast-gold-bar.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="fade3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#080705" stop-opacity="0.55"/>
        <stop offset="40%" stop-color="#080705" stop-opacity="0.18"/>
        <stop offset="80%" stop-color="#080705" stop-opacity="0.78"/>
        <stop offset="100%" stop-color="#080705" stop-opacity="0.96"/>
      </linearGradient>
      <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF3C4"/>
        <stop offset="50%" stop-color="#D4AF37"/>
        <stop offset="100%" stop-color="#7A5810"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#fade3)"/>
    <g transform="translate(450, 490)">
      <rect x="-150" y="-210" width="300" height="420" rx="36" fill="none" stroke="url(#g3)" stroke-width="2" stroke-opacity="0.55"/>
      <circle cx="0" cy="-110" r="54" fill="url(#g3)" fill-opacity="0.25" stroke="url(#g3)" stroke-width="2"/>
    </g>
  </svg>`,
});

await buildCoverflowCard({
  filename: 'hero-3d-bullion-assay',
  baseImage: path.join(rawDir, 'gold-bar-weighing-scale.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="fade4" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#070605" stop-opacity="0.55"/>
        <stop offset="45%" stop-color="#070605" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#070605" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF5D6"/>
        <stop offset="50%" stop-color="#E6C35C"/>
        <stop offset="100%" stop-color="#8C6716"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#fade4)"/>
    <!-- 3D Bullion Ingot Wireframe Overlay -->
    <g transform="translate(450, 500)">
      <path d="M-140,-70 L40,-140 L160,-60 L-20,10 Z" fill="url(#g4)" fill-opacity="0.32" stroke="url(#g4)" stroke-width="2"/>
      <path d="M-140,-70 L-20,10 L-20,75 L-140,-5 Z" fill="url(#g4)" fill-opacity="0.22" stroke="url(#g4)" stroke-width="2"/>
      <path d="M-20,10 L160,-60 L160,5 L-20,75 Z" fill="url(#g4)" fill-opacity="0.42" stroke="url(#g4)" stroke-width="2"/>
    </g>
  </svg>`,
});

await buildCoverflowCard({
  filename: 'hero-3d-acid-parting',
  baseImage: path.join(rawDir, 'gold-solution-flasks.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="fade5" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#060608" stop-opacity="0.5"/>
        <stop offset="45%" stop-color="#060608" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#060608" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="g5" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF5D6"/>
        <stop offset="50%" stop-color="#F5C84C"/>
        <stop offset="100%" stop-color="#9A7219"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#fade5)"/>
    <g transform="translate(450, 500)">
      <circle cx="0" cy="0" r="190" fill="none" stroke="url(#g5)" stroke-width="1.5" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="130" fill="url(#g5)" fill-opacity="0.12" stroke="url(#g5)" stroke-width="1.5" stroke-opacity="0.6"/>
    </g>
  </svg>`,
});

await buildCoverflowCard({
  filename: 'hero-3d-certification',
  baseImage: path.join(rawDir, 'lab-flasks-logo-wall.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="fade6" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#060608" stop-opacity="0.52"/>
        <stop offset="45%" stop-color="#060608" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#060608" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="g6" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF6D6"/>
        <stop offset="50%" stop-color="#D4AF37"/>
        <stop offset="100%" stop-color="#8A6414"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#fade6)"/>
    <g transform="translate(450, 500)">
      <rect x="-155" y="-155" width="310" height="310" rx="155" fill="url(#g6)" fill-opacity="0.14" stroke="url(#g6)" stroke-width="2"/>
    </g>
  </svg>`,
});

// 2. Section 2 HD Stock-Style Process & News Thumbnails (1200x800)
await buildProcessThumb({
  filename: 'stock-process-weighing',
  baseImage: path.join(rawDir, 'precision-balance-gold-cornets.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="p1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#p1)"/>
  </svg>`,
});

await buildProcessThumb({
  filename: 'stock-process-melting',
  baseImage: path.join(genDir, 'hero-poster-fire-assay-reel-576.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="p2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FF8A00" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.5"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#p2)"/>
  </svg>`,
});

await buildProcessThumb({
  filename: 'stock-process-parting',
  baseImage: path.join(rawDir, 'gold-solution-flasks.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="p3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.42"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#p3)"/>
  </svg>`,
});

await buildProcessThumb({
  filename: 'stock-process-stamped',
  baseImage: path.join(rawDir, 'precise-cast-gold-bar.jpg'),
  svgOverlay: (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="p4" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.48"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#p4)"/>
  </svg>`,
});

console.log('Generated all v2 3D Coverflow and HD Process/News assets in public/assets/v2/');
