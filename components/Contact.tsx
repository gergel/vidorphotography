'use client';

import ContactForm from './ContactForm';
import LoopVideo from './LoopVideo';
import { CONTACT, INQUIRIES } from '@/lib/content';
import { useSite } from '@/lib/site';

/** Kapcsolat: nagy színes lap, amelynek színe és kis loopja a kiválasztott műfajt követi. */
export default function Contact() {
  const { inquiry } = useSite();
  const sel = INQUIRIES.find((i) => i.value === inquiry) ?? INQUIRIES[0];
  const info = 'text-[13px] font-semibold text-mist';
  return (
    <section id="kapcsolat" aria-labelledby="contact-title" className="px-3 py-16 md:px-5 md:py-28">
      <div className="mx-auto max-w-[1296px] rounded-[28px] bg-night-2 p-6 text-cream md:p-12 lg:p-16">
        <p className="label mb-2">Kapcsolat</p>
        <h2 id="contact-title" className="display text-[clamp(40px,5.6vw,88px)] leading-[1.02]">Mesélj a történetedről.</h2>
        <p className="mt-5 max-w-[56ch] text-[19px] leading-relaxed text-mist">
          Portré, esküvő, rendezvény, gasztro, brandfilm vagy valami egészen más? Írj néhány sort, és beszéljük át, hogyan dolgozhatunk együtt.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:gap-12">
          <dl className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <dt className={info}>E-mail</dt>
              <dd><a className="inline-flex min-h-11 items-center break-all text-[16px] underline-offset-4 hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd>
            </div>
            <div>
              <dt className={info}>Telefon</dt>
              <dd><a className="inline-flex min-h-11 items-center text-[16px] underline-offset-4 hover:underline" href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd>
            </div>
            <div>
              <dt className={info}>Hely</dt>
              <dd className="text-[16px]">{CONTACT.city}</dd>
            </div>
            <div>
              <dt className={info}>Instagram</dt>
              <dd><a className="inline-flex min-h-11 items-center text-[16px] underline-offset-4 hover:underline" href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">@vidorphotography1<span className="sr-only"> (új lapon nyílik meg)</span></a></dd>
            </div>
          </dl>
          <ContactForm />
          <div className="relative hidden aspect-[3/4] overflow-hidden rounded-[18px] bg-black lg:block">
            <LoopVideo key={sel.loop} loop={sel.loop} priority={1} sizes="280px" />
            <span className="tag absolute bottom-3 left-3">{sel.value}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
