'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { VIDEOS } from '@/lib/content';
import { photo } from '@/lib/images';
import { EASE_OUT } from './Reveal';

const POSTER = photo('/images/hero/eskuvo-mezo.jpg');

/** Csak desktopon és teljes mozgás esetén indul videó; mobilon és csökkentett mozgásnál a statikus kép marad. */
function useBackgroundVideo(src: string | null) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!src || reduce) return setEnabled(false);
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [src, reduce]);
  return enabled;
}

export default function Hero() {
  const showVideo = useBackgroundVideo(VIDEOS.hero);
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  });

  return (
    <section id="top" aria-labelledby="hero-title" className="relative h-svh min-h-[600px] overflow-hidden bg-ink text-offwhite">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: EASE_OUT }}
      >
        <Image
          src={POSTER.src}
          width={POSTER.width}
          height={POSTER.height}
          alt="Ifjú pár kéz a kézben sétál egy napsütötte mezőn, a háttérben egy vidéki ház"
          preload
          fetchPriority="high"
          sizes="(max-width: 767px) 260vw, 100vw"
          quality={85}
          className="absolute inset-0 h-full w-full object-cover object-[46%_50%] md:object-center"
        />
        {showVideo && VIDEOS.hero && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEOS.hero}
            poster={POSTER.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        )}
      </motion.div>
      {/* 36%-os sötét fedőréteg + helyi átmenet a szöveg mögött az olvashatóságért */}
      <div aria-hidden className="absolute inset-0 bg-black/[.36]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ink/90 via-black/30 to-transparent" />

      <div className="container-site absolute inset-x-0 bottom-[clamp(56px,13svh,150px)]">
        <h1 id="hero-title" className="display text-[clamp(44px,6.39vw,92px)] leading-[0.95]">
          <motion.span className="block" {...rise(0.12)}>Fotók és filmek.</motion.span>{' '}
          <motion.span className="block" {...rise(0.2)}>Saját látásmóddal.</motion.span>
        </h1>
        <motion.div className="mt-6 md:mt-10 md:grid md:grid-cols-[minmax(0,667px)_auto] md:items-center" {...rise(0.32)}>
          <p className="text-base leading-relaxed">Esküvők, emberek, események — ahogyan én látom.</p>
          <div className="mt-6 flex items-center gap-6 md:mt-0 md:gap-3">
            <a href="#munkak" className="btn-light">
              Munkáim <span aria-hidden>→</span>
            </a>
            <a href="#kapcsolat" className="link-underline flex min-h-11 items-center text-[13px] font-semibold md:min-h-0 md:self-start md:pt-1">
              Kapcsolat ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
