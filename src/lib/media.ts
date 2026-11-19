import manifestJson from '../assets/images/generated/manifest.json';
import { site, type FaceRegion, type ImageAsset, type ImageKey } from '../config/site';

type ManifestEntry = {
  width: number;
  height: number;
  widths: number[];
  fallback: 'jpg' | 'png';
  fallbackWidth: number;
  color: string;
};

const manifest = manifestJson as Record<string, ManifestEntry>;

const generatedUrls = import.meta.glob<string>(
  '../assets/images/generated/*.{avif,webp,jpg,png}',
  { eager: true, import: 'default' },
);

function urlFor(filename: string): string {
  const key = `../assets/images/generated/${filename}`;
  return generatedUrls[key] ?? '';
}

export type ResolvedPicture = {
  key: string;
  alt: string;
  width: number;
  height: number;
  color: string;
  avifSrcSet: string;
  webpSrcSet: string;
  fallbackSrc: string;
  faceRegions: FaceRegion[];
  containsPeople: boolean;
};

export function resolvePictureByKey(
  rawKey: string,
  alt = '',
  faceRegions: FaceRegion[] = [],
  containsPeople = false,
): ResolvedPicture {
  const entry = manifest[rawKey] ?? {
    width: 1200,
    height: 900,
    widths: [800],
    fallback: 'jpg' as const,
    fallbackWidth: 800,
    color: '#0b0b0b',
  };

  const avifSrcSet = entry.widths
    .map((w) => {
      const u = urlFor(`${rawKey}-${w}.avif`);
      return u ? `${u} ${w}w` : '';
    })
    .filter(Boolean)
    .join(', ');

  const webpSrcSet = entry.widths
    .map((w) => {
      const u = urlFor(`${rawKey}-${w}.webp`);
      return u ? `${u} ${w}w` : '';
    })
    .filter(Boolean)
    .join(', ');

  const fallbackSrc =
    urlFor(`${rawKey}-${entry.fallbackWidth}.${entry.fallback}`) ||
    urlFor(`${rawKey}-${entry.widths[0]}.webp`) ||
    '';

  return {
    key: rawKey,
    alt,
    width: entry.width,
    height: entry.height,
    color: entry.color,
    avifSrcSet,
    webpSrcSet,
    fallbackSrc,
    faceRegions,
    containsPeople,
  };
}

export function resolveImage(imageKey: ImageKey): ResolvedPicture {
  const asset = site.images[imageKey] as ImageAsset;
  return resolvePictureByKey(
    asset.key,
    asset.alt,
    asset.faceRegions,
    asset.containsPeople,
  );
}

export function resolvePoster(posterKey: string, alt = ''): ResolvedPicture {
  return resolvePictureByKey(posterKey, alt, [], false);
}
