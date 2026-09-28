'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { WORKS, type GalleryKey, type Work } from '@/lib/content';
import { photo } from '@/lib/images';
import { EASE_OUT, Reveal } from './Reveal';
import GalleryDialog from './GalleryDialog';

// 8 oszlopos rács (1440 px-en 28 px köz): széles 5, keskeny 3 oszlop; a képarányok a designból.
const LAYOUT: Record<Work['layout'], { box: string; ratio: string; sizes: string }> = {
  wide: { box: 'md:col-span-5', ratio: 'aspect-[800/610]', sizes: '(max-width: 767px) 90vw, (min-width: 1440px) 800px, 56vw' },
  landscape: { box: 'md:col-span-5', ratio: 'aspect-[800/500]', sizes: '(max-width: 767px) 90vw, (min-width: 1440px) 800px, 56vw' },
  tall: { box: 'md:col-span-3', ratio: 'aspect-[468/620]', sizes: '(max-width: 767px) 90vw, (min-width: 1440px) 468px, 33vw' },
};

export default function Works() {
  const [open, setOpen] = useState<GalleryKey | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const close = useCallback(() => {
    setOpen(null);
    trigger.current?.focus();
  }, []);

  return (
    <section id="munkak" aria-labelledby="works-title" className="bg-paper py-[72px] text-ink md:py-[120px]">
      <div className="container-site">
        <Reveal as="header" className="mb-10 md:mb-[76px] md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <p className="label mb-3 text-muted">Válogatott munkák — 01</p>
            <h2 id="works-title" className="display text-[clamp(40px,4.45vw,64px)] leading-[1.02]">
              Képek, amelyek tovább élnek <span className="lg:block">a pillanatnál.</span>
            </h2>
          </div>
          <p className="mt-5 max-w-[300px] text-base leading-[1.625] text-muted md:mr-[30px] md:mt-0 md:shrink-0">
            Emberek, helyzetek és részletek — őszintén, érzékenyen, felesleges pózok nélkül.
          </p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-y-11 md:grid-cols-8 md:items-start md:gap-x-[22px] md:gap-y-[72px] xl:gap-x-7">
          {WORKS.map((w, i) => {
            const l = LAYOUT[w.layout];
            const p = photo(w.cover, 1600);
            return (
              <motion.li
                key={w.title}
                className={l.box}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: (i % 2) * 0.08 }}
              >
                <button
                  type="button"
                  className="hover-zoom hover-nudge group block w-full text-left"
                  onClick={(e) => {
                    trigger.current = e.currentTarget;
                    setOpen(w.gallery);
                  }}
                  aria-haspopup="dialog"
                >
                  <span className={`block overflow-hidden bg-[#DDD9D0] ${l.ratio}`}>
                    {/* enyhe scale-up megjelenéskor (a hover-nagyítás a belső képen fut) */}
                    <motion.span
                      className="block h-full w-full"
                      initial={{ scale: 1.08 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                      transition={{ duration: 1.4, ease: EASE_OUT }}
                    >
                      <Image {...p} alt={w.alt} sizes={l.sizes} className="hover-zoom__img h-full w-full object-cover" style={{ objectPosition: w.position }} />
                    </motion.span>
                  </span>
                  <span className="flex flex-wrap items-start justify-between gap-x-4 pt-2.5">
                    <span className="display text-[clamp(26px,2.1vw,30px)] leading-[1.3] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                      {w.title}
                    </span>
                    <span className="whitespace-nowrap pt-[5px] text-xs text-muted">
                      {w.description} <span className="hover-nudge__icon" aria-hidden>↗</span>
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <GalleryDialog galleryKey={open} onClose={close} />
    </section>
  );
}
