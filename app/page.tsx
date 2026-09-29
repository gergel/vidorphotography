import Header from '@/components/Header';
import HeroWall from '@/components/HeroWall';
import GenreMarquee from '@/components/GenreMarquee';
import Works from '@/components/Works';
import CinemaBand from '@/components/CinemaBand';
import FilmReel from '@/components/FilmReel';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import GalleryHost from '@/components/GalleryHost';
import Spill from '@/components/Spill';

export default function Page() {
  return (
    <>
      <Spill />
      <Header />
      <main id="main">
        <HeroWall />
        <GenreMarquee />
        <Works />
        <CinemaBand />
        <FilmReel />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
      <GalleryHost />
    </>
  );
}
