'use client';

import Image from 'next/image';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import LoopVideo from './LoopVideo';
import { GALLERIES, GENRE, GENRES, WORKS, type GalleryKey } from '@/lib/content';
import { photo } from '@/lib/images';
import { useSite } from '@/lib/site';
import { useAccent } from './Spill';

const EASE = [0.23, 1, 0.32, 1] as const;
// „Mind” nézet: különböző méretű csempék (12 oszlopos rácson)
const SPANS = ['md:col-span-7 md:row-span-2', 'md:col-span-5 md:row-span-3', 'md:col-span-7 md:row-span-2', 'md:col-span-5 md:row-span-3', 'md:col-span-7 md:row-span-2'];
const ORDER: GalleryKey[] = ['eskuvo', 'koncert', 'rendezveny', 'portre', 'gastro'];

type Item = { id: string; gallery: GalleryKey; index: number; src: string; alt: string; title?: string; description?: string; count?: number; position?: string };

export default function Works() {
  const { openGallery, setAccent } = useSite();
  const [filter, setFilter] = useState<GalleryKey | 'mind'>('mind');
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useAccent(filter === 'mind' ? 'koncert' : filter);

  const items: Item[] =
    filter === 'mind'
      ? ORDER.map((k) => {
          const w = WORKS.find((x) => x.gallery === k)!;
          return { id: `w-${k}`, gallery: k, index: -1, src: w.cover, alt: w.alt, title: w.title, description: w.description, count: GALLERIES[k].images.length, position: w.position };
        })
      : GALLERIES[filter].images.slice(0, 5).map((img, i) => ({ id: `${filter}-${i}`, gallery: filter, index: i, src: img.src, alt: img.alt }));

  return (
    <section ref={ref} id="munkak" aria-labelledby="works-title" className="py-20 md:py-28">
      <div className="container-site">
        <header className="mb-8 flex flex-col gap-6 md:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label mb-3 text-mist">Válogatott munkák — válassz műfajt</p>
            <h2 id="works-title" className="display text-[clamp(44px,6vw,88px)] leading-[0.92]">Munkák</h2>
          </div>
          <div role="group" aria-label="Szűrés műfaj szerint" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
            {[{ key: 'mind' as const, label: 'Mind', color: 'var(--color-cream)' }, ...GENRES].map((g) => {
              const on = filter === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setFilter(g.key);
                    if (g.key !== 'mind') setAccent(g.key);
                  }}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-colors ${on ? 'border-transparent text-night' : 'border-rule-strong text-cream hover:border-cream'}`}
                  style={on ? { background: g.color } : undefined}
                >
                  {g.key !== 'mind' && <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: on ? 'var(--color-night)' : g.color }} />}
                  {g.label}
                </button>
              );
            })}
          </div>
        </header>

        <LayoutGroup>
          <motion.ul layout className="grid auto-rows-[minmax(0,1fr)] gap-2.5 md:auto-rows-[190px] md:grid-cols-12">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((it, i) => {
                const g = GENRE[it.gallery];
                const span = filter === 'mind' ? SPANS[i] : i === 0 ? 'md:col-span-6 md:row-span-4' : 'md:col-span-3 md:row-span-2';
                const p = photo(it.src, 1600);
                const work = filter === 'mind';
                return (
                  <motion.li
                    key={it.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className={`${span} min-h-[260px] md:min-h-0`}
                  >
                    <button
                      type="button"
                      onClick={() => openGallery(it.gallery, it.index)}
                      onMouseEnter={() => {
                        setHovered(it.id);
                        setAccent(it.gallery);
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setAccent(it.gallery)}
                      className="tile group flex h-full w-full flex-col overflow-hidden rounded-[6px] bg-night-2 text-left"
                      style={{ ['--tc' as string]: g.color }}
                      aria-label={work ? `${it.title} galéria megnyitása (${it.count} fotó)` : `${it.alt} — nagy nézet`}
                    >
                      <span className="relative block min-h-0 flex-1 overflow-hidden">
                        <Image src={p.src} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="tile-media object-cover" style={{ objectPosition: it.position ?? '50% 45%' }} />
                        {work && <LoopVideo loop={g.loop} hoverPlay active={hovered === it.id} position={it.position} imgClassName="tile-media" className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
                        {work && hovered === it.id && <span className="live absolute right-3 top-3">LOOP</span>}
                      </span>
                      {work && (
                        <span className="flex items-end justify-between gap-4 border-t-2 px-4 py-3" style={{ borderColor: g.color }}>
                          <span>
                            <span className="display block text-[22px] leading-tight">{it.title}</span>
                            <span className="block text-[13px] text-mist">{it.description}</span>
                          </span>
                          <span className="label shrink-0 text-[11px] text-mist">{it.count} fotó →</span>
                        </span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
        {filter !== 'mind' && (
          <div className="mt-6">
            <button type="button" onClick={() => openGallery(filter)} className="btn btn-ghost">
              Mind a {GALLERIES[filter].images.length} fotó — {GALLERIES[filter].title} <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
