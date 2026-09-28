'use client';

import { motion, type Variants } from 'framer-motion';

/** Az animate skill erős ease-out görbéje. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** enyhe nagyítás is (képeknél) */
  scale?: boolean;
  as?: 'div' | 'li' | 'section' | 'header' | 'figure';
};

/**
 * Görgetéses megjelenés: opacity 0 → 1 és 30 px-es felfelé csúszás, egyszer.
 * Csökkentett mozgásnál (MotionConfig reducedMotion="user") csak az áttűnés marad.
 */
export function Reveal({ children, className, delay = 0, scale = false, as = 'div' }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 30, ...(scale ? { scale: 0.97 } : {}) }}
      whileInView={{ opacity: 1, y: 0, ...(scale ? { scale: 1 } : {}) }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
export const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

/** Lépcsőzetes megjelenés: a gyerek <RevealItem> elemek 80 ms-onként indulnak. */
export function RevealGroup({ children, className, as = 'div' }: Omit<Props, 'delay' | 'scale'>) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={group} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }}>
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, as = 'div' }: Omit<Props, 'delay' | 'scale'>) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}
