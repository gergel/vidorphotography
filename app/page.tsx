import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Works from '@/components/Works';
import Statement from '@/components/Statement';
import Films from '@/components/Films';
import ServicesApproach from '@/components/ServicesApproach';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Works />
        <Statement />
        <Films />
        <ServicesApproach />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
