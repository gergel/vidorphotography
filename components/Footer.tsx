import { CONTACT } from '@/lib/content';
import Logo from './Logo';

const LINKS = [
  { href: '#munkak', label: 'Munkák' },
  { href: '#filmek', label: 'Filmek' },
  { href: '#rolam', label: 'Rólam' },
  { href: '#kapcsolat', label: 'Kapcsolat' },
];

export default function Footer() {
  return (
    <footer className="bg-paper pt-10 text-ink md:pt-14">
      <div className="container-site">
        <div className="grid gap-6 border-t border-line pb-10 pt-9 md:grid-cols-[407px_1fr_auto] md:items-end md:pb-[63px] md:pt-[50px]">
          <a href="#top" aria-label="VIDOR Photo & Film — az oldal eleje" className="inline-flex min-h-11 items-center">
            <Logo size="lg" />
          </a>
          <ul className="-mx-1.5 flex flex-wrap text-[13px] md:gap-x-5 md:text-xs">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a className="link-underline inline-flex min-h-11 items-center px-1.5 md:min-h-0" href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a className="link-underline inline-flex min-h-11 items-center px-1.5 md:min-h-0" href={CONTACT.instagram} target="_blank" rel="noopener">
                Instagram<span className="sr-only"> (új lapon nyílik meg)</span>
              </a>
            </li>
          </ul>
          <p className="text-[10px] tracking-[0.02em] text-muted">© {new Date().getFullYear()} VIDOR PHOTOGRAPHY · BUDAPEST</p>
        </div>
      </div>
    </footer>
  );
}
