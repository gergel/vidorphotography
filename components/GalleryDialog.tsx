'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERIES, type GalleryKey } from '@/lib/content';
import { photo, ratio } from '@/lib/images';

type Props = { galleryKey: GalleryKey | null; onClose: () => void };

/** Egyetlen párbeszédablak: képrács → nagy kép nézet. Escape zár, nyilak lapoznak, húzás mobilon. */
export default function GalleryDialog({ galleryKey, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(-1);
  const gallery = galleryKey ? GALLERIES[galleryKey] : null;
  const n = gallery?.images.length ?? 0;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (galleryKey && !d.open) {
      setIndex(-1);
      d.showModal();
      document.documentElement.classList.add('lock');
    }
  }, [galleryKey]);

  // Fókusz: rács nézetben az utoljára nézett (vagy első) képre, nagy nézetben a „következő” gombra.
  const lastIndex = useRef(0);
  useEffect(() => {
    const d = ref.current;
    if (!d?.open) return;
    const id = requestAnimationFrame(() => {
      if (index >= 0) {
        lastIndex.current = index;
        d.querySelector<HTMLButtonElement>('[data-next]')?.focus({ preventScroll: true });
      } else {
        const thumbs = d.querySelectorAll<HTMLButtonElement>('[data-thumb]');
        const t = thumbs[lastIndex.current] ?? thumbs[0];
        t?.focus();
        t?.scrollIntoView({ block: 'nearest' });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [index, galleryKey]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handle = () => {
      document.documentElement.classList.remove('lock');
      lastIndex.current = 0;
      onClose();
    };
    d.addEventListener('close', handle);
    return () => d.removeEventListener('close', handle);
  }, [onClose]);

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (index < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const touch = useRef<{ x: number; y: number } | null>(null);
  const landscapeMajority = gallery ? gallery.images.filter((i) => ratio(i.src) > 1).length > n / 2 : false;
  const current = gallery && index >= 0 ? gallery.images[index] : null;
  const big = current ? photo(current.src) : null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="gallery-title"
      className={`vp-dialog m-0 h-dvh max-h-none w-screen max-w-none p-0 ${current ? 'bg-[#080807]' : 'bg-ink'} text-offwhite`}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className="flex h-full flex-col">
        <div className="container-site flex min-h-[76px] shrink-0 items-center justify-between gap-4 border-b border-line-dark py-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-4">
            <h2 id="gallery-title" className="display text-[28px] leading-tight md:text-[36px]">
              {gallery?.title ?? 'Galéria'}
            </h2>
            <p className="label text-muted-dark">
              {current ? `${index + 1} / ${n}` : `${gallery?.note ?? ''} · ${n} kép`}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {current && (
              <button type="button" onClick={() => setIndex(-1)} className="min-h-11 rounded-full border border-line-dark px-4 text-[13px] font-semibold hover:border-offwhite">
                ← Összes kép
              </button>
            )}
            <button type="button" onClick={() => ref.current?.close()} className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line-dark px-4 text-[13px] font-semibold hover:border-offwhite">
              <span className="sr-only md:not-sr-only">Bezárás</span> <span aria-hidden>✕</span>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {gallery && !current && (
            <ul className="container-site grid grid-cols-2 gap-2.5 py-5 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:gap-7 md:py-8">
              {gallery.images.map((img, i) => {
                const p = photo(img.src, 960);
                return (
                  <li key={img.src}>
                    <button
                      type="button"
                      data-thumb
                      onClick={() => setIndex(i)}
                      aria-label={`Kép megnyitása: ${img.alt}`}
                      className={`hover-zoom block w-full overflow-hidden bg-[#1c1c1a] ${landscapeMajority ? 'aspect-[3/2]' : 'aspect-[4/5]'}`}
                    >
                      <Image {...p} alt="" sizes="(max-width: 767px) 46vw, 25vw" className="hover-zoom__img h-full w-full object-cover" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {current && big && (
            <div
              className="relative flex h-full items-center justify-center"
              onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
              onTouchEnd={(e) => {
                if (!touch.current) return;
                const dx = e.changedTouches[0].clientX - touch.current.x;
                const dy = e.changedTouches[0].clientY - touch.current.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
                touch.current = null;
              }}
            >
              <figure className="flex h-full w-full flex-col items-center justify-center px-0 pb-24 pt-3 md:px-24 md:pb-4 md:pt-5">
                <Image
                  key={current.src}
                  {...big}
                  alt={current.alt}
                  sizes="100vw"
                  quality={85}
                  className="h-auto max-h-[calc(100%-40px)] w-auto max-w-full object-contain"
                />
                <figcaption className="mt-3 max-w-[60ch] text-center text-[13px] text-muted-dark">{current.alt}</figcaption>
              </figure>
              <button type="button" onClick={() => go(index - 1)} aria-label="Előző kép" className="absolute bottom-4 left-5 grid size-13 place-items-center rounded-full border border-line-dark hover:border-offwhite md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                ←
              </button>
              <button type="button" data-next onClick={() => go(index + 1)} aria-label="Következő kép" className="absolute bottom-4 right-5 grid size-13 place-items-center rounded-full border border-line-dark hover:border-offwhite md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
