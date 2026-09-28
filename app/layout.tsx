import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { SITE } from '@/lib/content';
import Providers from '@/components/Providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500'],
  variable: '--font-cormorant',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const description =
  'Vidor Gergely budapesti fotós és operatőr. Portré, esküvő, koncert, gasztro és rendezvény fotózás, dokumentum- és esküvői film.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'VIDOR Photo & Film — Vidor Gergely fotós és operatőr, Budapest',
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    siteName: SITE.name,
    title: 'VIDOR Photo & Film — Fotók és filmek. Saját látásmóddal.',
    description: 'Esküvők, emberek, események — ahogyan én látom.',
    url: '/',
    images: [{ url: '/images/web/og-image.jpg', width: 1200, height: 630, alt: 'Ifjú pár kéz a kézben sétál egy napsütötte mezőn' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%2311110F'/%3E%3Ctext x='16' y='22.5' font-family='Arial,sans-serif' font-weight='700' font-size='18' text-anchor='middle' fill='%23FAFAF7'%3EV%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: '#11110F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="absolute left-3 -top-16 z-[100] rounded-full bg-offwhite px-4 py-3 text-sm font-semibold text-ink focus:top-3"
        >
          Ugrás a tartalomra
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
