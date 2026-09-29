'use client';

import GalleryDialog from './GalleryDialog';
import { useSite } from '@/lib/site';

/** Egyetlen galéria-ablak az egész oldalnak; bezáráskor a fókusz visszatér a megnyitó elemre (lásd lib/site). */
export default function GalleryHost() {
  const { gallery, closeGallery } = useSite();
  return <GalleryDialog galleryKey={gallery?.key ?? null} initialIndex={gallery?.index ?? -1} onClose={closeGallery} />;
}
