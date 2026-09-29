'use client';

import { MotionConfig } from 'framer-motion';
import { SiteProvider } from '@/lib/site';

/** Csökkentett mozgásnál a Framer Motion csak az áttűnést tartja meg; a SiteProvider a videókeretet és a közös állapotot adja. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SiteProvider>{children}</SiteProvider>
    </MotionConfig>
  );
}
