'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FILMS, type Film } from '@/lib/content';
import { photo } from '@/lib/images';
import { EASE_OUT, Reveal } from './Reveal';

export default function Films() {
  const [film, setFilm] = useState<Film | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (film && d && !d.open) {
      d.showModal();
      document.documentElement.classList.add('lock');
    }
  }, [film]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    // Bezáráskor az iframe eltűnik → a lejátszás azonnal leáll.
    const onClose = () => {
      setFilm(null);
      document.documentElement.classList.remove('lock');
      trigger.current?.focus();
    };
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  return (
    <section id="filmek" aria-labelledby="films-title" className="bg-ink py-[72px] text-offwhite md:py-[120px]">
      <div className="container-site">
        <Reveal as="header" className="mb-10 md:mb-[58px] md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <p className="label mb-3 text-muted-dark">Filmek — 02</p>
            <h2 id="films-title" className="display text-[clamp(40px,4.45vw,64px)] leading-[1.02]">
              A kép mozdul. A történet <span className="lg:block">marad.</span>
            </h2>
          </div>
          <p className="mt-5 max-w-[220px] text-sm leading-[1.57] text-muted-dark md:mr-16 md:mt-0 md:shrink-0">
            Rövid és hosszabb formátumok, atmoszférával és saját ritmussal.
          </p>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3 md:gap-5">
          {FILMS.map((f, i) => {
            const p = photo(f.cover, 960);
            return (
              <motion.article
                key={f.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.08 }}
              >
                <a
                  href={`https://vimeo.com/${f.vimeo}`}
                  aria-label={`Lejátszás: ${f.title}`}
                  className="hover-zoom group block"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    trigger.current = e.currentTarget;
                    setFilm(f);
                  }}
                >
                  <span className="relative block aspect-[4/3.6] overflow-hidden bg-[#1c1c1a] md:aspect-[419/430]">
                    <Image {...p} alt="" sizes="(max-width: 767px) 90vw, (min-width: 1440px) 420px, 30vw" className="hover-zoom__img h-full w-full object-cover" style={{ objectPosition: f.position }} />
                    {/* hoverre sötétedő réteg + lejátszás gomb (érintésnél mindig látható, kisebb) */}
                    <span aria-hidden className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-offwhite/90 text-ink opacity-90 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] [@media(hover:hover)]:scale-90 [@media(hover:hover)]:opacity-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                    >
                      <span className="ml-0.5 text-sm">▶</span>
                    </span>
                  </span>
                  <h3 className="display mt-3.5 text-[clamp(26px,2.1vw,30px)] leading-[1.3] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{f.title}</h3>
                  <p className="mt-3 text-[13px] text-muted-dark">
                    {f.description} <span className="mx-1 text-offwhite" aria-hidden>▶</span> <span className="tabular-nums">{f.duration}</span>
                  </p>
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="player-title"
        className="vp-dialog m-auto w-[min(1180px,100vw,calc((100dvh-96px)*16/9))] max-w-none bg-ink p-0 text-offwhite"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="flex items-center justify-between gap-4 py-3 pl-5 pr-3">
          <h2 id="player-title" className="display text-[clamp(24px,2.2vw,30px)] leading-tight">
            {film?.title ?? 'Videó'}
          </h2>
          <button type="button" autoFocus onClick={() => dialog.current?.close()} className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line-dark px-4 text-[13px] font-semibold hover:border-offwhite">
            <span className="sr-only md:not-sr-only">Bezárás</span> <span aria-hidden>✕</span>
          </button>
        </div>
        <div className="relative aspect-video bg-black">
          {film && (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://player.vimeo.com/video/${film.vimeo}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`}
              title={`Videólejátszó: ${film.title}`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            />
          )}
        </div>
      </dialog>
    </section>
  );
}
