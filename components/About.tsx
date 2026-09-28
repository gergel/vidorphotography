import Image from 'next/image';
import { photo } from '@/lib/images';
import { Reveal, RevealGroup, RevealItem } from './Reveal';

const PORTRAIT = photo('/images/headline.jpg', 1600);
const DETAIL = photo('/images/about/kamera-reszlet.jpg');

export default function About() {
  return (
    <section id="rolam" aria-labelledby="about-title" className="border-t border-line bg-paper py-[72px] text-ink md:py-[120px]">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[630px_minmax(0,1fr)] lg:gap-[100px]">
        {/* nagy, meleg tónusú portré + kisebb részletfotó, közös alsó éllel */}
        <Reveal className="grid max-w-[630px] grid-cols-[430fr_200fr] items-end">
          <figure className="aspect-[430/540] overflow-hidden bg-[#DDD9D0]">
            <Image {...PORTRAIT} alt="Vidor Gergely nádasban áll, egyik kezében magasra emelt filmkamera" sizes="(max-width: 767px) 62vw, 430px" className="h-full w-full object-cover object-[40%_50%]" />
          </figure>
          <figure className="aspect-[200/280] overflow-hidden bg-[#2a2a28]">
            <Image {...DETAIL} alt="Kamera Vidor Gergely kezében forgatás közben" sizes="(max-width: 767px) 30vw, 200px" className="is-bw h-full w-full object-cover" />
          </figure>
        </Reveal>
        <RevealGroup>
          <RevealItem>
            <p className="label mb-4 text-muted">Rólam — 05</p>
          </RevealItem>
          <RevealItem>
            <h2 id="about-title" className="display text-[clamp(34px,3.34vw,48px)] leading-[1.03]">
              Vidor Gergely, fotós és <span className="lg:block">operatőr.</span>
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-6 max-w-[562px] text-base leading-[1.75] text-muted">
              Budapesten élek és dolgozom. 2015 óta fotózom és filmezek — portrékat, eseményeket, márkákat, ételeket,
              koncerteket és történeteket. Nem számít a műfaj: a képeimben mindig az őszinteség és a személyes látásmód a közös.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="label mt-6 inline-block border border-line px-3 py-1.5 text-[11px] text-ink">Budapest · 2015 óta</p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
