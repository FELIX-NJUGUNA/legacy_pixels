import Hero from "@/components/sections/CinematicHero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Services from "@/components/sections/Services";
import Packages from "@/components/sections/Packages";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Packages/>
      <Contact />
    </>
  );
}
