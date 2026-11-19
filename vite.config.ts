import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Ensure the user's uploaded Fire Assay & Gold Testing images are copied into public/assets/v2/
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v2Dir = path.join(__dirname, 'public', 'assets', 'v2');
fs.mkdirSync(v2Dir, { recursive: true });

const uploadedCopies: Array<[string, string]> = [
  [
    'C:/Users/HP/.gemini/antigravity/brain/1925b9be-d1f2-49f8-ad2c-c04a15ca4969/.user_uploaded/media_1794479104564_711cac6e.jpg',
    path.join(v2Dir, 'fire-assay-cupels-furnace.jpg'),
  ],
  [
    'C:/Users/HP/.gemini/antigravity/brain/1925b9be-d1f2-49f8-ad2c-c04a15ca4969/.user_uploaded/media_1794479147614_92cc9a70.jpg',
    path.join(v2Dir, 'fire-assay-machine-flasks.jpg'),
  ],
  [
    'C:/Users/HP/.gemini/antigravity/brain/1925b9be-d1f2-49f8-ad2c-c04a15ca4969/.user_uploaded/media_1794479159993_be8ca77a.jpg',
    path.join(v2Dir, 'gold-purity-probe-nugget.jpg'),
  ],
  [
    'C:/Users/HP/.gemini/antigravity/brain/1925b9be-d1f2-49f8-ad2c-c04a15ca4969/.user_uploaded/media_1794479205853_3df3206f.jpg',
    path.join(v2Dir, 'acid-parting-flasks-lab.jpg'),
  ],
];

for (const [src, dest] of uploadedCopies) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  } catch {
    // ignore if already copied
  }
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'motion';
          if (/[\\/]lenis[\\/]/.test(id)) return 'lenis';
          if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          if (/[\\/](react-router|react-router-dom|@remix-run)[\\/]/.test(id)) return 'router';
          return undefined;
        },
      },
    },
  },
  ssgOptions: {
    entry: 'src/main.tsx',
    dirStyle: 'nested',
    script: 'async',
    formatting: 'none',
  },
});
