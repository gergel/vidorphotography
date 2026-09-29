'use client';

import Image from 'next/image';
import { motion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FILMS, type Film } from '@/lib/content';
import { photo } from '@/lib/images';
import { useAccent } from './Spill';

function Card({ f, onOpen }: { f: Film; onOpen: (f: Film, el: HTMLElement) => void }) {
  const x = useSpring(0, { stiffness: 250, damping: 20 });
  const y = useSpring(0, { stiffness: 250, damping: 20 });
  const p = photo(f.cover, 1600);
  return (
    <li className="w-[82vw] shrink-0 snap-start sm:w-[62vw] lg:w-[min(46vw,640px)]">
      <a
        href={`https://vimeo.com/${f.vimeo}`}
        aria-label={`Lejátszás: ${f.title} (${f.duration})`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          onOpen(f, e.currentTarget);
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          // „mágneses” gomb: legfeljebb 40 px-t mozdul a kurzor felé
          x.set(Math.max(-40, Math.min(40, (e.clientX - r.left - r.width / 2) * 0.15)));
          y.set(Math.max(-40, Math.min(40, (e.clientY - r.top - r.height * 0.36) * 0.15)));
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="tile group block overflow-hidden rounded-[6px] bg-night-2"
        style={{ ['--tc' as string]: 'var(--color-sun)' }}
        draggable={false}
      >
        <span className="relative block aspect-video overflow-hidden">
          <Image src={p.src} alt="" fill sizes="(min-width:1024px) 46vw, 82vw" draggable={false} className="tile-media object-cover" style={{ objectPosition: f.position }} />
          <motion.span style={{ x, y }} aria-hidden className="absolute left-1/2 top-1/2 -ml-10 -mt-10 grid h-20 w-20 place-items-center rounded-full bg-cream/95 shadow-[0_10px_40px_rgba(0,0,0,.4)]">
            <span className="ml-1.5 h-0 w-0 border-y-[13px] border-l-[21px] border-y-transparent border-l-night" />
          </motion.span>
        </span>
        <span className="flex items-end justify-between gap-4 border-t border-rule px-5 py-4">
          <span>
            <span className="display block text-[clamp(22px,2vw,30px)] leading-tight">{f.title}</span>
            <span className="block text-[14px] text-mist">{f.description}</span>
          </span>
          <span className="label shrink-0 rounded border border-sun/50 px-2 py-1 text-[11px] text-sun">▸ {f.duration}</span>
        </span>
      </a>
    </li>
  );
}

/** Filmek: vízszintesen húzható filmszalag; a Vimeo csak kattintásra töltődik be, bezáráskor leáll. */
export default function FilmReel() {
  const ref = useAccent('film');
  const strip = useRef<HTMLUListElement>(null);
  const [film, setFilm] = useState<Film | null>(null);
  const [current, setCurrent] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

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
    const onClose = () => {
      setFilm(null);
      document.documentElement.classList.remove('lock');
      trigger.current?.focus();
    };
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  const cardWidth = () => (strip.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 600;
  const go = (dir: number) => strip.current?.scrollBy({ left: dir * (cardWidth() + 16), behavior: 'smooth' });

  return (
    <section ref={ref} id="filmek" aria-labelledby="films-title" className="py-20 md:py-28">
      <div className="container-site mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="label mb-3 text-mist">3 film · Vimeo</p>
          <h2 id="films-title" className="display text-[clamp(44px,6vw,88px)] leading-[0.92]">Filmek</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="label text-mist" aria-live="polite">
            {String(current + 1).padStart(2, '0')} / {String(FILMS.length).padStart(2, '0')}
          </span>
          <button type="button" aria-label="Előző film" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-rule-strong hover:border-cream">←</button>
          <button type="button" aria-label="Következő film" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-night">→</button>
        </div>
      </div>

      <div className="bg-black/40 py-2">
        <div aria-hidden className="sprockets" />
        <ul
          ref={strip}
          aria-label="Filmek listája"
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,5vw,72px)] py-3 active:cursor-grabbing [scroll-padding-inline:clamp(20px,5vw,72px)]"
          onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / (cardWidth() + 16)))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
          }}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') return;
            drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || !strip.current) return;
            const dx = e.clientX - d.x;
            if (Math.abs(dx) > 5) {
              d.moved = true;
              strip.current.style.scrollSnapType = 'none';
            }
            strip.current.scrollLeft = d.left - dx;
          }}
          onPointerUp={() => {
            if (strip.current) strip.current.style.scrollSnapType = '';
            setTimeout(() => (drag.current = null), 0);
          }}
          onPointerLeave={() => {
            if (strip.current) strip.current.style.scrollSnapType = '';
            drag.current = null;
          }}
          onClickCapture={(e) => {
            if (drag.current?.moved) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {FILMS.map((f) => (
            <Card
              key={f.key}
              f={f}
              onOpen={(film, el) => {
                trigger.current = el;
                setFilm(film);
              }}
            />
          ))}
          <li aria-hidden className="w-[clamp(20px,5vw,72px)] shrink-0" />
        </ul>
        <div aria-hidden className="sprockets" />
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="player-title"
        className="vp-dialog m-auto w-[min(1180px,100vw,calc((100dvh-96px)*16/9))] max-w-none bg-night p-0 text-cream"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="flex items-center justify-between gap-4 py-3 pl-5 pr-3">
          <h2 id="player-title" className="display text-[clamp(22px,2.2vw,30px)] leading-tight">
            {film?.title ?? 'Videó'}
          </h2>
          <button type="button" autoFocus onClick={() => dialog.current?.close()} className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-rule-strong px-4 text-[13px] font-semibold hover:border-cream">
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
