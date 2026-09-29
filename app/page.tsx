import Header from '@/components/Header';
import HeroSequence from '@/components/HeroSequence';
import WorksRail, { Intro } from '@/components/WorksRail';
import CinemaBand from '@/components/CinemaBand';
import FilmReel from '@/components/FilmReel';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import GalleryHost from '@/components/GalleryHost';

export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSequence />
        <Intro />
        <WorksRail />
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
