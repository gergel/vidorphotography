import manifest from './image-manifest.json';

type Entry = { w: number; h: number; sizes: number[]; base: string };
const MANIFEST = manifest as Record<string, Entry>;

/**
 * Egy eredeti kép (pl. '/images/eskuvo/eskuvo-01.jpg') legnagyobb webes változata
 * a next/image számára. Az <Image> ebből készít AVIF/WebP-t a kért méretekben.
 */
export function photo(path: string, maxWidth = 2400) {
  const m = MANIFEST[path];
  if (!m) throw new Error(`Nincs webes változat ehhez a képhez: ${path} — futtasd: npm run images`);
  const w = [...m.sizes].reverse().find((s) => s <= maxWidth) ?? m.sizes[0];
  return { src: `${m.base}-${w}.webp`, width: w, height: Math.round((m.h * w) / m.w) };
}

export function ratio(path: string) {
  const m = MANIFEST[path];
  return m ? m.w / m.h : 1;
}
