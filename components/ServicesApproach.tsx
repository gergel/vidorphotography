import Image from 'next/image';
import { SERVICES } from '@/lib/content';
import { photo } from '@/lib/images';
import { Reveal, RevealGroup, RevealItem } from './Reveal';

const BTS = photo('/images/about-photo.jpg', 1600);

export default function ServicesApproach() {
  return (
    <section id="szolgaltatasok" aria-label="Szolgáltatások és szemlélet" className="bg-paper text-ink">
      {/* 5a — Amiben segíthetek */}
      <div className="container-site grid gap-10 py-[72px] md:py-[120px] lg:grid-cols-[minmax(0,540fr)_minmax(0,756fr)] lg:gap-0">
        <Reveal>
          <p className="label mb-3 text-muted">Amiben segíthetek — 03</p>
          <h2 className="display max-w-[460px] text-[clamp(34px,3.34vw,48px)] leading-[1.05]">
            Személyre szabott vizuális megoldások, bármilyen műfajban.
          </h2>
        </Reveal>
        <RevealGroup as="div" className="border-t border-line">
          <ol>
            {SERVICES.map((s, i) => (
              <RevealItem as="li" key={s.title} className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-b border-line py-5 md:grid-cols-[69px_minmax(0,274px)_minmax(0,1fr)] md:items-center md:gap-0 md:py-6">
                <span className="text-[11px] tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display text-[clamp(26px,2.1vw,30px)] leading-[1.25]">{s.title}</h3>
                <p className="col-start-2 text-sm leading-normal text-muted md:col-start-auto md:max-w-[320px]">{s.text}</p>
              </RevealItem>
            ))}
          </ol>
        </RevealGroup>
      </div>

      {/* 5b — Szemlélet: szöveg balra, kulisszák mögötti kép jobbra */}
      <div id="szemlelet" className="grid md:min-h-[590px] md:grid-cols-2">
        <div className="container-site flex items-center py-14 md:mr-0 md:max-w-[720px] md:py-20 md:pr-[72px]">
          <RevealGroup>
            <RevealItem>
              <p className="label mb-4 text-muted">Szemlélet — 04</p>
            </RevealItem>
            <RevealItem>
              <h2 className="display text-[clamp(34px,3.34vw,48px)] leading-[1.03]">Figyelek. Kapcsolódom. Nem rendezek túl.</h2>
            </RevealItem>
            <RevealItem>
              <p className="mt-7 max-w-[545px] text-base leading-[1.69] text-muted">
                A közös munka beszélgetéssel kezdődik. Megismerem a történetet és a közeget, majd teret hagyok annak, ami
                természetesen történik. A végeredmény letisztult, személyes és időtálló.
              </p>
            </RevealItem>
            <RevealItem>
              <ol className="label mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-ink">
                <li>01 Kapcsolódás</li>
                <li aria-hidden className="text-muted">→</li>
                <li>02 Alkotás</li>
                <li aria-hidden className="text-muted">→</li>
                <li>03 Átadás</li>
              </ol>
            </RevealItem>
          </RevealGroup>
        </div>
        <Reveal className="relative aspect-[4/3.4] overflow-hidden bg-[#DDD9D0] md:aspect-auto">
          <Image {...BTS} alt="Vidor Gergely filmkamerával a vállán egy futóverseny rajtjánál" sizes="(max-width: 767px) 100vw, 50vw" className="absolute inset-0 h-full w-full object-cover object-[58%_50%]" />
        </Reveal>
      </div>
    </section>
  );
}
