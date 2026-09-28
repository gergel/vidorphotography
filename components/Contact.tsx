import { CONTACT } from '@/lib/content';
import ContactForm from './ContactForm';
import { Reveal } from './Reveal';

export default function Contact() {
  return (
    <section id="kapcsolat" aria-labelledby="contact-title" className="bg-ink py-[72px] text-offwhite md:py-[120px]">
      <div className="container-site grid gap-14 lg:grid-cols-[minmax(0,620fr)_minmax(0,676fr)] lg:gap-0">
        <Reveal>
          <p className="label mb-3 text-muted-dark">Kapcsolat — 06</p>
          <h2 id="contact-title" className="display text-[clamp(40px,4.45vw,64px)] leading-[1.02]">
            Mesélj a <span className="lg:block">történetedről.</span>
          </h2>
          <p className="mt-8 max-w-[470px] text-base leading-[1.69] text-muted-dark">
            Portré, esküvő, rendezvény, gasztro, brandfilm vagy valami egészen más? Írj néhány sort, és beszéljük át, hogyan
            dolgozhatunk együtt.
          </p>
          <ul className="mt-7 text-[15px] leading-[1.87]">
            <li><a className="link-underline inline-flex min-h-11 items-center md:min-h-0" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            <li><a className="link-underline inline-flex min-h-11 items-center md:min-h-0" href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
            <li>{CONTACT.city}</li>
          </ul>
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
